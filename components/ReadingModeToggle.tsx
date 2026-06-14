"use client";

import { useState, useCallback } from "react";

export default function ReadingModeToggle() {
  const [active, setActive] = useState(false);

  const toggle = useCallback(() => {
    setActive((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("reading-mode", next);
      return next;
    });
  }, []);

  return (
    <button
      onClick={toggle}
      aria-label={active ? "Exit focus mode" : "Enter focus mode"}
      title={active ? "Exit focus mode" : "Focus mode"}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 text-xs px-4 py-2 rounded-full border shadow-md transition-all duration-200 select-none ${
        active
          ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-700 dark:border-slate-200"
          : "bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
      }`}
    >
      {active ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        </svg>
      )}
      {active ? "Exit focus mode" : "Focus mode"}
    </button>
  );
}
