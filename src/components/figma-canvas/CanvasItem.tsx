import React, { useState, useRef, useEffect } from "react";
import { CanvasElement } from "./types";
import { useGsapFloat } from "./useGsapFloat";
import { SelectionBox } from "./SelectionBox";
import { cn } from "@/lib/utils";
import gsap from "gsap";

interface CanvasItemProps {
  element: CanvasElement;
  isSelected: boolean;
  isHovered: boolean;
  isDragged: boolean;
  collaboratorName?: string;
  collaboratorColor?: string;
  scale?: number;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  onPointerMove: (e: React.PointerEvent, id: string) => void;
  onPointerUp: (e: React.PointerEvent, id: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const playSwitchSound = (isOn: boolean) => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    // High frequency transient click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(isOn ? 900 : 700, ctx.currentTime);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (error) {
    console.error("Failed to play sound:", error);
  }
};

export function CanvasItem({
  element,
  isSelected,
  isHovered,
  isDragged,
  collaboratorName,
  collaboratorColor,
  scale = 1,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onMouseEnter,
  onMouseLeave,
}: CanvasItemProps) {
  const [isOn, setIsOn] = useState(true);
  const isWord = element.type === "word";
  const isSubheading = element.type === "subheading";
  const isTab = element.type === "tab";
  const isSwitch = element.type === "switch";
  const isTextOnly = isWord || isSubheading || isTab || isSwitch;
  // Inner container is used for the float effect
  const floatRef = useGsapFloat(!isDragged && !isSelected, {
    maxTranslation: isTextOnly ? 3 : 4,
    maxRotation: isTextOnly ? 0.8 : 1,
    minDuration: isTextOnly ? 4 : 3,
    maxDuration: isTextOnly ? 6 : 5,
  });

  const cardRef = useRef<HTMLDivElement>(null);

  // Interaction animation on hover, select, drag
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (isDragged) {
        // Dragging lift effect
        gsap.to(el, {
          scale: 1,
          z: 0,
          rotate: element.rotation,
          boxShadow: "none",
          filter: "none",
          duration: 0.2,
          ease: "power2.out",
        });
      } else if (isSelected) {
        // Selected locked state
        gsap.to(el, {
          scale: 1,
          z: 0,
          rotate: element.rotation,
          boxShadow: "none",
          filter: "none",
          duration: 0.2,
          ease: "power2.out",
        });
      } else if (isHovered) {
        // Hover state (completely static, no zoom or shadow changes)
        gsap.to(el, {
          scale: 1,
          z: 0,
          rotate: element.rotation,
          boxShadow: "none",
          filter: "none",
          duration: 0.2,
          ease: "power2.out",
        });
      } else {
        // Reset state
        gsap.to(el, {
          scale: 1,
          z: 0,
          rotate: element.rotation,
          boxShadow: "none",
          filter: "none",
          duration: 0.2,
          ease: "power2.out",
        });
      }
    }, el);

    return () => ctx.revert();
  }, [isHovered, isSelected, isDragged, element.rotation]);

  // Disable 3D tilt effect on hover
  const handlePointerMove = (e: React.PointerEvent) => {
    return;
  };

  const handlePointerLeave = () => {
    onMouseLeave();
  };

  // Render specific canvas elements based on their type
  const renderContent = () => {
    const { type, content } = element;

    switch (type) {
      case "word":
        return (
          <h2
            className="font-semibold text-[#343434] tracking-tighter leading-[0.95] select-none px-4 py-1"
            style={{ fontSize: `${scale * 160}px` }}
          >
            {content as string}
          </h2>
        );

      case "subheading":
        return (
          <p
            className="text-[#343434] font-normal tracking-normal leading-[1.64] text-center select-none max-w-full"
            style={{
              fontSize: `${Math.max(15, scale * 24)}px`,
              width: `${Math.max(300, scale * 566)}px`,
            }}
          >
            {content as string}
          </p>
        );

      case "tab":
        return (
          <div
            className="bg-white border border-[#D3D3D3] rounded-lg shadow-[1px_1px_4px_rgba(0,0,0,0.08)] flex items-center justify-between px-4 select-none"
            style={{
              width: `${scale * 180}px`,
              height: `${scale * 44}px`,
            }}
          >
            <span
              className="text-black font-normal font-sans pointer-events-none select-none"
              style={{
                fontSize: `${scale * 14}px`,
                lineHeight: `${scale * 17}px`,
              }}
            >
              {content as string}
            </span>
            <img
              src="/menu.svg"
              alt="Menu"
              draggable="false"
              className="pointer-events-none select-none"
              style={{
                width: `${scale * 15}px`,
                height: `${scale * 11}px`,
              }}
            />
          </div>
        );

      case "switch":
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
              const nextState = !isOn;
              setIsOn(nextState);
              playSwitchSound(nextState);
            }}
            className={cn(
              "relative rounded-full transition-colors duration-200 cursor-pointer pointer-events-auto border border-[#D3D3D3] shadow-[1px_1px_4px_rgba(0,0,0,0.08)]",
              isOn ? "bg-[#1597F6]" : "bg-[#E5E5E5]"
            )}
            style={{
              width: `${scale * 88}px`,
              height: `${scale * 44}px`,
            }}
          >
            <div
              className="absolute bg-white rounded-full transition-all duration-200 shadow-sm"
              style={{
                width: `${scale * 40}px`,
                height: `${scale * 40}px`,
                top: `${scale * 1}px`,
                left: isOn ? `${scale * 45}px` : `${scale * 1}px`,
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        transform: `rotate(${element.rotation}deg) translateZ(0)`,
        backfaceVisibility: "hidden",
      }}
      className={cn(
        "absolute transition-shadow duration-200 pointer-events-auto select-none",
        isTextOnly ? "z-20" : "z-10",
        isDragged ? "z-40" : ""
      )}
      onPointerDown={isSwitch ? undefined : (e) => onPointerDown(e, element.id)}
      onPointerMove={isSwitch ? undefined : (e) => {
        handlePointerMove(e);
        onPointerMove(e, element.id);
      }}
      onPointerUp={isSwitch ? undefined : (e) => onPointerUp(e, element.id)}
      onMouseEnter={isSwitch ? undefined : onMouseEnter}
      onPointerLeave={isSwitch ? undefined : handlePointerLeave}
    >
      <div ref={floatRef} className="will-change-transform">
        <div
          ref={cardRef}
          className={cn(
            "relative rounded-lg will-change-transform",
            !isTextOnly && "shadow-sm border border-neutral-200/50 dark:border-neutral-800/40 bg-white/5 dark:bg-neutral-900/5 backdrop-blur-[1px] p-0.5"
          )}
          style={{ transformStyle: "preserve-3d", perspective: 1000 }}
        >
          {/* Bounding Bounding Selection outline overlays */}
          {!isTab && !isSwitch && (
            <SelectionBox
              label={element.label}
              isActive={isHovered || isSelected}
              isSelected={isSelected}
              color={collaboratorColor}
              collaboratorName={collaboratorName}
            />
          )}
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
export default React.memo(CanvasItem);
