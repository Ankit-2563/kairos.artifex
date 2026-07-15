import { useEffect, useRef } from "react";
import gsap from "gsap";

export function useGsapFloat(
  enabled: boolean = true,
  options: {
    maxTranslation?: number;
    maxRotation?: number;
    minDuration?: number;
    maxDuration?: number;
  } = {}
) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const el = elementRef.current;
    
    const maxT = options.maxTranslation ?? 5;
    const maxR = options.maxRotation ?? 1.5;
    const minD = options.minDuration ?? 3.5;
    const maxD = options.maxDuration ?? 6.5;

    const durationX = gsap.utils.random(minD, maxD);
    const durationY = gsap.utils.random(minD, maxD);
    const durationR = gsap.utils.random(minD + 1, maxD + 1);

    const delayX = gsap.utils.random(0, 1.5);
    const delayY = gsap.utils.random(0, 1.5);
    const delayR = gsap.utils.random(0, 1.5);

    const tx = gsap.utils.random(-maxT, maxT);
    const ty = gsap.utils.random(-maxT, maxT);
    const tr = gsap.utils.random(-maxR, maxR);

    // GSAP context ensures all animations are scoped and clean up properly
    const ctx = gsap.context(() => {
      gsap.to(el, {
        x: tx,
        duration: durationX,
        delay: delayX,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap.to(el, {
        y: ty,
        duration: durationY,
        delay: delayY,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap.to(el, {
        rotate: tr,
        duration: durationR,
        delay: delayR,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, el);

    return () => ctx.revert();
  }, [
    enabled,
    options.maxTranslation,
    options.maxRotation,
    options.minDuration,
    options.maxDuration,
  ]);

  return elementRef;
}
