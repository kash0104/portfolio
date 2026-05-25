"use client";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";

export function CalEmbed() {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) { setShouldLoad(true); obs.disconnect(); } },
      { rootMargin: "200px" }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="min-h-[480px] border border-border bg-surface rounded">
      {shouldLoad ? (
        <iframe
          src={`https://cal.com/${site.cal.username}?embed=true&theme=dark`}
          className="w-full h-[640px] rounded"
          loading="lazy"
          title="Schedule a call"
        />
      ) : (
        <div className="flex items-center justify-center h-[480px]">
          <a href={`https://cal.com/${site.cal.username}`} className="font-mono text-sm px-4 py-2 bg-accent text-black rounded">
            Open scheduler →
          </a>
        </div>
      )}
    </div>
  );
}
