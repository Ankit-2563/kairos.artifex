import { cn } from "@/lib/utils";
import React from "react";

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#F7F7F7] overflow-hidden text-neutral-900">
      {/* Dotted Grid Background */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          "bg-size-[24px_24px]",
          "bg-[radial-gradient(#c5c5c5_1.5px,transparent_1.5px)]",
          "dark:bg-[radial-gradient(#404040_1.5px,transparent_1.5px)]"
        )}
      />

      <main className="relative z-20 flex flex-col items-center justify-center px-6 text-center max-w-3xl">
        <h1 className="bg-linear-to-b from-neutral-950 to-neutral-500 bg-clip-text py-4 text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl">
          Kairos Portfolio
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-neutral-600 max-w-xl leading-relaxed">
          A minimalist, high-performance digital portfolio. Clean design, dotted backgrounds, and smooth interactions.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 transition duration-200"
          >
            Get Started
          </a>
          <a
            href="mailto:contact@example.com"
            className="rounded-full border border-neutral-300 bg-white/80 backdrop-blur px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition duration-200"
          >
            Learn More
          </a>
        </div>
      </main>
    </div>
  );
}
