"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Fuse from "fuse.js";
import Link from "next/link";

interface SearchItem {
  id: number;
  title: string;
  description: string;
  categories: string;
  slug: string;
}

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [fuse, setFuse] = useState<Fuse<SearchItem> | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load index on first open
  useEffect(() => {
    if (!open || fuse) return;
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/search-index.json`)
      .then((r) => r.json())
      .then((data: SearchItem[]) => {
        setFuse(
          new Fuse(data, {
            keys: ["title", "description", "categories"],
            threshold: 0.35,
            includeScore: true,
          })
        );
      })
      .catch(() => {});
  }, [open, fuse]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      dialog.close();
      setQuery("");
      setResults([]);
    }
  }, [open]);

  const handleSearch = useCallback(
    (q: string) => {
      setQuery(q);
      if (!fuse || !q.trim()) { setResults([]); return; }
      setResults(fuse.search(q.trim()).slice(0, 8).map((r) => r.item));
    },
    [fuse]
  );

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      className="w-full max-w-xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-0 mx-auto mt-24 backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      onClick={(e) => { if (e.target === dialogRef.current) handleClose(); }}
    >
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <svg className="text-slate-400 shrink-0" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search posts…"
          className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none text-sm"
        />
        <kbd className="hidden sm:flex h-5 items-center gap-0.5 rounded border border-slate-200 dark:border-slate-700 px-1.5 text-[10px] text-slate-500 font-mono">
          Esc
        </kbd>
      </div>

      {results.length > 0 ? (
        <ul className="py-2 max-h-96 overflow-y-auto">
          {results.map((item) => (
            <li key={item.id}>
              <Link
                href={`/posts/${item.slug}/`}
                onClick={handleClose}
                className="flex flex-col gap-0.5 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.title}</span>
                {item.description && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{item.description}</span>
                )}
                {item.categories && (
                  <span className="text-xs text-blue-500 dark:text-blue-400">{item.categories.replace(/,/g, " · ")}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      ) : query.trim() ? (
        <div className="px-4 py-8 text-center text-sm text-slate-400">No results for &ldquo;{query}&rdquo;</div>
      ) : (
        <div className="px-4 py-8 text-center text-sm text-slate-400">Type to search across all posts</div>
      )}
    </dialog>
  );
}
