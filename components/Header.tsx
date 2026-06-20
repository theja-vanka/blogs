"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import SearchDialog from "./SearchDialog";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }
      const tag = (e.target as HTMLElement).tagName;
      const editable = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable;
      if (e.key === "/" && !editable && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <>
      <header className="site-header fixed top-4 left-1/2 -translate-x-1/2 z-40 w-max max-w-[calc(100vw-1rem)]">
        <div className="flex items-center gap-1 px-2 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full border border-slate-200/80 dark:border-slate-700/60 shadow-[0_4px_24px_rgba(0,0,0,0.07)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
          {/* Logo avatar */}
          <Link
            href="/"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shrink-0 mr-1"
          >
            KV
          </Link>

          {/* Nav links */}
          <nav className="flex items-center text-sm text-slate-600 dark:text-slate-300">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              Blog
            </Link>
          </nav>

          {/* Divider */}
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1 shrink-0" />

          {/* Search bar — icon-only on mobile, full pill on sm+ */}
          <button
            onClick={openSearch}
            className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-full text-slate-400 dark:text-slate-500 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-colors text-sm sm:min-w-[160px]"
            aria-label="Search (⌘K)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <span className="hidden sm:block flex-1 text-left">Search…</span>
            <kbd className="hidden sm:flex items-center rounded border border-slate-300 dark:border-slate-600 px-1 text-[10px] font-mono leading-none h-4">⌘K</kbd>
          </button>

          {/* RSS subscribe */}
          <a
            href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/feed.xml`}
            target="_blank"
            rel="noreferrer"
            aria-label="Subscribe via RSS"
            title="Subscribe via RSS"
            className="flex items-center justify-center w-8 h-8 rounded-full text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/>
            </svg>
          </a>

          {/* GitHub icon */}
          <a
            href="https://github.com/theja-vanka"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center w-8 h-8 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="GitHub"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"/>
            </svg>
          </a>

          <ThemeToggle />
        </div>
      </header>

      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </>
  );
}
