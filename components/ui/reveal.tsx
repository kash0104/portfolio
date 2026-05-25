"use client";

import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  /** Render a stagger container — direct children animate in sequence */
  stagger?: boolean;
  /** Override the default 0.1 viewport threshold */
  threshold?: number;
  className?: string;
};

/**
 * Reveals children when they scroll into view by toggling an `.in-view` class.
 * Pairs with the `.reveal` + `.reveal-stagger` CSS in globals.css.
 * Animation runs once per element (observer disconnects after first trigger).
 */
export function Reveal({ children, stagger = false, threshold = 0.1, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion: show immediately, skip animation.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in-view");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add("in-view");
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const cls = ["reveal", stagger && "reveal-stagger", className].filter(Boolean).join(" ");
  return (
    <div ref={ref} className={cls}>
      {children}
    </div>
  );
}
