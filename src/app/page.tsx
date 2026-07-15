import { cn } from "@/lib/utils";
import React from "react";
import { HeroCanvas } from "@/components/figma-canvas/HeroCanvas";

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#F7F7F7] overflow-hidden text-neutral-900">
      {/* Dotted Grid Background */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          "bg-[radial-gradient(#D3D3D3_1.5px,transparent_1.5px)]"
        )}
        style={{ backgroundSize: "24px 24px" }}
      />

      <HeroCanvas />
    </div>
  );
}
