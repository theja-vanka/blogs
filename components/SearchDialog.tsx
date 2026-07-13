"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";

interface SearchItem {
  id: number;
  title: string;
  description: string;
  categories: string;
  slug: string;
  body: string;
}

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchDialog({ open, onClose }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [allResults, setAllResults] = useState<SearchItem[]>([]);
  const [fuse, setFuse] = useState<Fuse<SearchItem> | null>(null);
  const [recentItems, setRecentItems] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/search-index.json`)
      .then((r) => r.json())
      .then((data: SearchItem[]) => {
        setRecentItems(data.slice(0, 5));
        setFuse(
          new Fuse(data, {
            keys: [
              { name: "title", weight: 2 },
              { name: "categories", weight: 1.5 },
              { name: "description", weight: 1 },
              { name: "body", weight: 0.5 },
            ],
            threshold: 0.4,
            ignoreLocation: true,
            minMatchCharLength: 2,
            includeScore: true,
          })
        );
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      dialog.close();
      setQuery("");
      setAllResults([]);
      setSelectedIndex(-1);
      setActiveCategory(null);
    }
  }, [open]);

  // Derive category filter pills from current results
  const categoryOptions = useMemo(() => {
    if (allResults.length === 0) return [];
    const counts = new Map<string, number>();
    allResults.forEach((item) => {
      item.categories.split(", ").forEach((c) => {
        if (c) counts.set(c, (counts.get(c) ?? 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([cat, count]) => ({ cat, count }));
  }, [allResults]);

  // Apply active category filter to results
  const results = useMemo(() => {
    if (!activeCategory) return allResults.slice(0, 8);
    return allResults
      .filter((r) => r.categories.split(", ").includes(activeCategory))
      .slice(0, 8);
  }, [allResults, activeCategory]);

  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      (listRef.current.children[selectedIndex] as HTMLElement)?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const handleSearch = useCallback(
    (q: string) => {
      setQuery(q);
      setSelectedIndex(-1);
      setActiveCategory(null);
      if (!fuse || !q.trim()) { setAllResults([]); return; }
      setAllResults(fuse.search(q.trim()).slice(0, 20).map((r) => r.item));
    },
    [fuse]
  );

  const navigate = useCallback(
    (item: SearchItem) => {
      router.push(`/posts/${item.slug}/`);
      onClose();
    },
    [router, onClose]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (results.length === 0) return;
        setSelectedIndex((i) => (i < results.length - 1 ? i + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (results.length === 0) return;
        setSelectedIndex((i) => (i > 0 ? i - 1 : results.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const target = selectedIndex >= 0 ? results[selectedIndex] : results[0];
        if (target) navigate(target);
      }
    },
    [results, selectedIndex, navigate]
  );

  const clearQuery = useCallback(() => {
    setQuery("");
    setAllResults([]);
    setSelectedIndex(-1);
    setActiveCategory(null);
    inputRef.current?.focus();
  }, []);

  const handleClose = useCallback(() => onClose(), [onClose]);

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      className="w-full max-w-xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-0 mx-auto mt-24 backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      onClick={(e) => { if (e.target === dialogRef.current) handleClose(); }}
    >
      {/* Input row */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <svg className="text-slate-400 shrink-0" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search posts…"
          className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none text-sm"
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-activedescendant={selectedIndex >= 0 ? `result-${selectedIndex}` : undefined}
        />
        {query ? (
          <button onClick={clearQuery} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-0.5 rounded" aria-label="Clear search">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        ) : (
          <kbd className="hidden sm:flex h-5 items-center rounded border border-slate-200 dark:border-slate-700 px-1.5 text-[10px] text-slate-500 font-mono">Esc</kbd>
        )}
      </div>

      {/* Category filter pills */}
      {categoryOptions.length > 1 && (
        <div className="flex flex-wrap gap-1.5 px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
          {categoryOptions.map(({ cat, count }) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all ${
                activeCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat} <span className="opacity-60">{count}</span>
            </button>
          ))}
        </div>
      )}

      {/* Results list */}
      {results.length > 0 ? (
        <ul id="search-results" ref={listRef} role="listbox" className="py-1.5 max-h-[22rem] overflow-y-auto">
          {results.map((item, i) => (
            <li key={item.id} id={`result-${i}`} role="option" aria-selected={i === selectedIndex}>
              <button
                onClick={() => navigate(item)}
                onMouseEnter={() => setSelectedIndex(i)}
                className={`w-full text-left flex items-start gap-3 px-4 py-3 transition-colors ${
                  i === selectedIndex ? "bg-blue-50 dark:bg-blue-950/50" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={`mt-0.5 shrink-0 transition-opacity ${i === selectedIndex ? "opacity-100 text-blue-500" : "opacity-0"}`}
                >
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className={`text-sm font-medium truncate ${i === selectedIndex ? "text-blue-700 dark:text-blue-300" : "text-slate-900 dark:text-slate-100"}`}>
                    {item.title}
                  </span>
                  {item.description && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{item.description}</span>
                  )}
                  {item.categories && (
                    <span className="text-xs text-blue-500 dark:text-blue-400">{item.categories.replace(/,\s*/g, " · ")}</span>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : query.trim() ? (
        <div className="px-4 py-10 text-center text-sm text-slate-400">
          No results for <span className="font-medium text-slate-600 dark:text-slate-300">&ldquo;{query}&rdquo;</span>
        </div>
      ) : recentItems.length > 0 ? (
        <>
          <p className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Recent posts</p>
          <ul className="py-1.5">
            {recentItems.map((item, i) => (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`w-full text-left flex items-start gap-3 px-4 py-2.5 transition-colors ${
                    i === selectedIndex ? "bg-blue-50 dark:bg-blue-950/50" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-slate-300 dark:text-slate-600">
                    <polyline points="12 8 12 12 14 14"/><circle cx="12" cy="12" r="10"/>
                  </svg>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{item.title}</span>
                    {item.categories && (
                      <span className="text-xs text-blue-500 dark:text-blue-400">{item.categories.replace(/,\s*/g, " · ")}</span>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="px-4 py-10 text-center text-sm text-slate-400">Type to search across all posts</div>
      )}

      {/* Keyboard hint footer */}
      {results.length > 0 && (
        <div className="flex items-center gap-4 px-4 py-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-600 select-none">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-slate-200 dark:border-slate-700 px-1 py-px font-mono leading-none">↑</kbd>
            <kbd className="rounded border border-slate-200 dark:border-slate-700 px-1 py-px font-mono leading-none">↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-slate-200 dark:border-slate-700 px-1 py-px font-mono leading-none">↵</kbd>
            open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-slate-200 dark:border-slate-700 px-1 py-px font-mono leading-none">Esc</kbd>
            close
          </span>
        </div>
      )}
    </dialog>
  );
}
