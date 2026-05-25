"use client";

import { useEffect, useRef, useState } from "react";

type ParsedValue = { prefix: string; target: number; suffix: string; raw: string };

function parseStatValue(value: string): ParsedValue {
  // Pull the first numeric chunk (allowing commas), with optional prefix + suffix.
  const match = value.match(/^(\D*)([\d,]+)(.*)$/);
  if (!match) return { prefix: "", target: 0, suffix: value, raw: value };
  const [, prefix = "", numStr = "0", suffix = ""] = match;
  return {
    prefix,
    target: Number.parseInt(numStr.replace(/,/g, ""), 10) || 0,
    suffix,
    raw: value,
  };
}

function formatNumber(n: number, target: number) {
  // Use thousand separators only when the target is >= 1000 (so "30%" stays "30", not "30").
  return target >= 1000 ? n.toLocaleString("en-US") : n.toString();
}

export function StatCard({ value, label }: { value: string; label: string }) {
  const parsed = parseStatValue(value);
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // One-time jump to target for reduced-motion users; intentional setState in effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCount(parsed.target);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const duration = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(1, elapsed / duration);
          // ease-out cubic for a smooth deceleration
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(parsed.target * eased));
          if (progress < 1) requestAnimationFrame(tick);
          else setCount(parsed.target);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [parsed.target]);

  return (
    <div
      ref={ref}
      className="group border border-border bg-surface/50 backdrop-blur px-5 py-5 rounded-lg hover:border-accent/60 hover:-translate-y-0.5 hover:bg-surface transition-all duration-200"
    >
      <div className="font-mono text-3xl md:text-4xl text-accent-2 font-semibold tracking-tight tabular-nums">
        {parsed.prefix}
        {formatNumber(count, parsed.target)}
        {parsed.suffix}
      </div>
      <div className="text-xs uppercase tracking-wider text-text-dim mt-2">{label}</div>
    </div>
  );
}
