"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  readingTime?: number;
}

export default function ReadingProgress({ readingTime }: Props) {
  const barRef = useRef<HTMLDivElement>(null);
  const [minsLeft, setMinsLeft] = useState<number | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      bar.style.width = `${pct}%`;

      if (readingTime) {
        if (pct > 3) setStarted(true);
        setMinsLeft(Math.ceil(readingTime * (1 - pct / 100)));
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [readingTime]);

  return (
    <>
      <div ref={barRef} id="reading-progress" style={{ width: "0%" }} />
      {readingTime && started && minsLeft !== null && minsLeft > 0 && (
        <div className="fixed top-2 right-4 z-50 text-[11px] text-slate-400 dark:text-slate-500 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm select-none pointer-events-none">
          {minsLeft} min left
        </div>
      )}
    </>
  );
}
