import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface SelectionBoxProps {
  label: string;
  isActive: boolean; // Hovered or clicked
  isSelected: boolean; // Locked selection
  color?: string; // Figma blue or collaborator color
  collaboratorName?: string; // If selected by someone else
}

export function SelectionBox({
  label,
  isActive,
  isSelected,
  color = "#0C8CE9",
  collaboratorName,
}: SelectionBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Instant display to prevent subpixel font rendering shifts and anti-aliasing jitter in browsers
    return;
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="absolute -inset-1.5 pointer-events-none z-30 rounded-xs select-none will-change-transform"
      style={{
        outline: `${isSelected ? "2px" : "1.5px"} solid ${color}`,
      }}
    >
      <div
        className="absolute bottom-full left-0 mb-1.5 flex items-center gap-1.5 rounded-[3px] px-1.5 py-0.5 text-[9px] font-semibold text-white shadow-md select-none pointer-events-none tracking-wider"
        style={{ backgroundColor: color }}
      >
        <span>{label}</span>
        {collaboratorName && (
          <span className="border-l border-white/30 pl-1.5 font-bold normal-case">
            {collaboratorName}
          </span>
        )}
      </div>

      {/* Corner Resize Handles */}
      {/* Top Left */}
      <div
        className="resize-handle absolute -top-1.5 -left-1.5 w-2.5 h-2.5 bg-white border-2 rounded-xs shadow-sm pointer-events-none"
        style={{ borderColor: color }}
      />
      {/* Top Right */}
      <div
        className="resize-handle absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-white border-2 rounded-xs shadow-sm pointer-events-none"
        style={{ borderColor: color }}
      />
      {/* Bottom Left */}
      <div
        className="resize-handle absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 bg-white border-2 rounded-xs shadow-sm pointer-events-none"
        style={{ borderColor: color }}
      />
      {/* Bottom Right */}
      <div
        className="resize-handle absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 bg-white border-2 rounded-xs shadow-sm pointer-events-none"
        style={{ borderColor: color }}
      />

      {/* Edge Pill Handles */}
      {/* Top Mid */}
      <div
        className="resize-handle absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4.5 h-1.5 bg-white border rounded-full shadow-sm pointer-events-none"
        style={{ borderColor: color }}
      />
      {/* Bottom Mid */}
      <div
        className="resize-handle absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4.5 h-1.5 bg-white border rounded-full shadow-sm pointer-events-none"
        style={{ borderColor: color }}
      />
      {/* Left Mid */}
      <div
        className="resize-handle absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-1.5 h-4.5 bg-white border rounded-full shadow-sm pointer-events-none"
        style={{ borderColor: color }}
      />
      {/* Right Mid */}
      <div
        className="resize-handle absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-1.5 h-4.5 bg-white border rounded-full shadow-sm pointer-events-none"
        style={{ borderColor: color }}
      />
    </div>
  );
}
export default SelectionBox;
