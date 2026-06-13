"use client";

import { useEffect, useState, useCallback } from "react";

interface LightboxState { src: string; alt: string }

export default function ImageLightbox() {
  const [lb, setLb] = useState<LightboxState | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.tagName === "IMG" && el.closest(".post-content")) {
        const img = el as HTMLImageElement;
        setLb({ src: img.src, alt: img.alt || "" });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!lb) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLb(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lb]);

  useEffect(() => {
    document.body.style.overflow = lb ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lb]);

  const close = useCallback(() => setLb(null), []);

  if (!lb) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={close}
    >
      <button
        onClick={close}
        aria-label="Close"
        className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
      {lb.alt && (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm max-w-lg text-center px-4">{lb.alt}</p>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={lb.src}
        alt={lb.alt}
        onClick={(e) => e.stopPropagation()}
        className="max-w-[90vw] max-h-[85vh] rounded-lg shadow-2xl object-contain cursor-default"
      />
    </div>
  );
}
