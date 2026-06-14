"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const SHORTCUTS = [
  { keys: ["/"], label: "Open search" },
  { keys: ["⌘", "K"], label: "Open search" },
  { keys: ["j"], label: "Go to older post" },
  { keys: ["k"], label: "Go to newer post" },
  { keys: ["g", "h"], label: "Go home" },
  { keys: ["?"], label: "Show shortcuts" },
  { keys: ["Esc"], label: "Close overlays" },
];

export default function KeyboardShortcutsHelp() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const pendingG = useRef(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const editable =
        tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable;
      if (editable) return;

      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }

      if (e.key === "Escape") {
        setOpen(false);
        pendingG.current = false;
        return;
      }

      if (e.key === "g" && !e.metaKey && !e.ctrlKey) {
        pendingG.current = true;
        setTimeout(() => { pendingG.current = false; }, 800);
        return;
      }

      if (e.key === "h" && pendingG.current) {
        e.preventDefault();
        pendingG.current = false;
        router.push("/");
        return;
      }

      pendingG.current = false;
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [router]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) dialog.showModal();
    else if (dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={() => setOpen(false)}
      onClick={(e) => { if (e.target === dialogRef.current) setOpen(false); }}
      className="w-full max-w-sm rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-0 mx-auto mt-32 backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Keyboard Shortcuts</span>
        <button
          onClick={() => setOpen(false)}
          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <ul className="py-3 px-2">
        {SHORTCUTS.map(({ keys, label }) => (
          <li key={label} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
            <div className="flex items-center gap-1">
              {keys.map((k, i) => (
                <span key={i} className="flex items-center gap-1">
                  <kbd className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                    {k}
                  </kbd>
                  {i < keys.length - 1 && <span className="text-[10px] text-slate-400">then</span>}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 text-center">
        <span className="text-[11px] text-slate-400 dark:text-slate-600">Press <kbd className="px-1 py-px rounded border border-slate-200 dark:border-slate-700 font-mono text-[10px]">?</kbd> to close</span>
      </div>
    </dialog>
  );
}
