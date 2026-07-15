"use client";

import React, { useState, useEffect, useRef } from "react";
import { CanvasElement, CanvasItemType } from "./types";
import { CanvasItem } from "./CanvasItem";
import gsap from "gsap";

const initialElementsData = [
  { id: "el-tab", type: "tab", x: 36, y: 36, rotation: 0, content: "Main_Kairos", label: "Frame 133", depth: 0.02 },
  { id: "w-design", type: "word", x: 240, y: 160, rotation: 0, content: "Design.", label: "DESIGN", depth: 0.02 },
  { id: "w-develop", type: "word", x: 460, y: 370, rotation: 0, content: "Develop.", label: "Develop", depth: 0.02 },
  { id: "w-launch", type: "word", x: 350, y: 580, rotation: 0, content: "Launch.", label: "Launch", depth: 0.02 },
  { id: "el-subheading", type: "subheading", x: 437, y: 810, rotation: 0, content: "A digital product studio crafting brands, websites, and experiences that create impact.", label: "subheading", depth: 0.02 },
];

const initialCollaborators = [
  { id: "satyam", name: "Satyam", color: "#904EE1", cursorUrl: "/assets/herosection/purple-cursor.svg" },
  { id: "ankit", name: "Ankit", color: "#FFC700", cursorUrl: "/assets/herosection/yellow-cursor.svg" },
  { id: "cyril", name: "Cyril", color: "#F24E1E", cursorUrl: "/assets/herosection/red-cursor.svg" },
];

export function HeroCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [userPointer, setUserPointer] = useState<{ x: number; y: number } | null>(null);
  
  // Selection / Hover states (no selection by default)
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Dragging coordinates caching refs
  const dragStartRef = useRef({ x: 0, y: 0 });
  const elementStartRef = useRef({ x: 0, y: 0 });

  // Update canvas bounds on resize
  useEffect(() => {
    const updateBounds = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };
    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, []);

  // Map elements relative to centered 1440x1024 Figma frame
  useEffect(() => {
    if (dimensions.width === 0 || isInitialized) return;

    const baseWidth = 1440;
    const baseHeight = 1024;
    const currentScale = Math.min(1, dimensions.width / baseWidth);
    
    const offsetX = Math.max(0, (dimensions.width - baseWidth) / 2);
    const offsetY = Math.max(0, (dimensions.height - baseHeight * currentScale) / 2);

    const absoluteElements = initialElementsData.map((el) => {
      const isTab = el.type === "tab";
      return {
        id: el.id,
        type: el.type as CanvasItemType,
        x: isTab ? el.x : el.x * currentScale + offsetX,
        y: isTab ? el.y : el.y * currentScale + offsetY,
        rotation: el.rotation,
        content: el.content,
        label: el.label,
        depth: el.depth,
      };
    });

    setElements(absoluteElements);
    setIsInitialized(true);
  }, [dimensions.width, dimensions.height, isInitialized]);

  // Entrance Animations
  useEffect(() => {
    if (!isInitialized) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".canvas-word-wrapper",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.12,
        }
      );
    }, canvasRef);

    return () => ctx.revert();
  }, [isInitialized]);

  // Simulating organic collaborator cursors
  useEffect(() => {
    if (!isInitialized) return;

    const startCollaboratorAnimation = (className: string) => {
      const moveCursor = () => {
        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const randomX = Math.random() * (rect.width - 200) + 100;
        const randomY = Math.random() * (rect.height - 150) + 100;

        const duration = Math.random() * 1.8 + 1.2; 
        const delay = Math.random() * 3 + 0.5; 

        gsap.to(className, {
          x: randomX,
          y: randomY,
          duration: duration,
          ease: "power3.inOut",
          delay: delay,
          onComplete: moveCursor,
        });
      };

      moveCursor();
    };

    initialCollaborators.forEach((col) => {
      // Set initial random position once to prevent re-render jumps
      gsap.set(`.col-cursor-${col.id}`, {
        x: Math.random() * 800 + 100,
        y: Math.random() * 600 + 100,
      });
      startCollaboratorAnimation(`.col-cursor-${col.id}`);
    });

    return () => {
      initialCollaborators.forEach((col) => {
        gsap.killTweensOf(`.col-cursor-${col.id}`);
      });
    };
  }, [isInitialized]);

  // Dragging event handlers
  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();

    setSelectedId(id);

    const el = elements.find((item) => item.id === id);
    if (!el) return;

    // Tab components are static and not draggable
    if (el.type === "tab") return;

    setDraggedId(id);

    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    dragStartRef.current = { x: e.clientX, y: e.clientY };
    elementStartRef.current = { x: el.x, y: el.y };
  };

  const handlePointerMove = (e: React.PointerEvent, id: string) => {
    if (draggedId !== id) return;

    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    const newX = elementStartRef.current.x + dx;
    const newY = elementStartRef.current.y + dy;

    const updatedElements = elements.map((item) => {
      if (item.id === id) {
        return { ...item, x: newX, y: newY };
      }
      return item;
    });

    setElements(updatedElements);
  };

  const handlePointerUp = (e: React.PointerEvent, id: string) => {
    if (draggedId !== id) return;
    setDraggedId(null);

    const target = e.currentTarget as HTMLElement;
    target.releasePointerCapture(e.pointerId);
  };

  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setUserPointer({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleCanvasPointerLeave = () => {
    setUserPointer(null);
  };

  const handleCanvasClick = () => {
    setSelectedId(null);
  };

  return (
    <div
      ref={canvasRef}
      onClick={handleCanvasClick}
      onPointerMove={handleCanvasPointerMove}
      onPointerLeave={handleCanvasPointerLeave}
      className="relative w-full min-h-screen overflow-hidden"
      style={{ touchAction: "none", cursor: "url('/assets/herosection/black-cursor.svg') 2 2, auto" }}
    >
      {isInitialized && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Typography Layer */}
          {elements.map((el) => {
            return (
              <div
                key={el.id}
                data-depth={el.depth}
                className="canvas-word-wrapper absolute pointer-events-none transition-transform duration-75 ease-out will-change-transform"
                style={{
                  left: 0,
                  top: 0,
                }}
              >
                <CanvasItem
                  element={el}
                  isSelected={selectedId === el.id}
                  isHovered={hoveredId === el.id}
                  isDragged={draggedId === el.id}
                  scale={dimensions.width > 0 ? Math.min(1, dimensions.width / 1440) : 1}
                  onPointerDown={(e) => handlePointerDown(e, el.id)}
                  onMouseEnter={() => setHoveredId(el.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onPointerMove={(e) => handlePointerMove(e, el.id)}
                  onPointerUp={(e) => handlePointerUp(e, el.id)}
                />
              </div>
            );
          })}


          {/* Collaborator Cursors Layer */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {initialCollaborators.map((col) => (
              <div
                key={col.id}
                className={`collaborator-cursor col-cursor-${col.id} absolute top-0 left-0 flex items-start pointer-events-none will-change-transform z-50`}
                style={{
                  transform: 'translate3d(100px, 100px, 0)',
                }}
              >
                <img
                  src={col.cursorUrl}
                  alt={col.name}
                  className="w-[28px] h-[27px] select-none"
                  draggable="false"
                />
                <div
                  className="px-2 py-0.5 rounded-sm text-[11px] font-semibold text-white ml-2 mt-4 shadow-sm select-none font-sans"
                  style={{ backgroundColor: col.color }}
                >
                  {col.name}
                </div>
              </div>
            ))}
          </div>

          {/* Current User Pointer Tag */}
          {userPointer && (
            <div
              className="absolute pointer-events-none select-none z-50 will-change-transform font-sans"
              style={{
                transform: `translate3d(${userPointer.x}px, ${userPointer.y}px, 0)`,
                left: 0,
                top: 0,
              }}
            >
              <div className="px-2 py-0.5 rounded-sm text-[11px] font-semibold text-white ml-3 mt-4 bg-black shadow-sm">
                You
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HeroCanvas;
