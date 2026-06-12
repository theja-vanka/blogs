"use client";

import { useRef, useState, useMemo } from "react";
import type { PostMeta } from "@/lib/types";
import PostCard from "./PostCard";

const POSTS_PER_PAGE = 9;

interface Props {
  posts: PostMeta[];
  categories: string[];
}

function pageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

export default function BlogListing({ posts, categories }: Props) {
  const [active, setActive] = useState("all");
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => (active === "all" ? posts : posts.filter((p) => p.categories.includes(active))),
    [posts, active]
  );

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  function goTo(p: number) {
    setPage(p);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function selectCategory(cat: string) {
    setActive(cat);
    setPage(1);
  }

  return (
    <div ref={topRef}>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {["all", ...categories].map((cat) => {
          const count = cat === "all" ? posts.length : posts.filter((p) => p.categories.includes(cat)).length;
          const isActive = active === cat;
          return (
            <button
              key={cat}
              onClick={() => selectCategory(cat)}
              className={`inline-flex items-center gap-1.5 text-sm rounded-full px-4 py-1.5 font-medium transition-all duration-150 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              {cat === "all" ? "All" : cat}
              <span className={`text-xs rounded-full px-1.5 py-0.5 font-mono leading-none ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400 py-16 text-center">No posts in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {paginated.map((post) => (
            <PostCard key={post.slugPath} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-12">
          {/* Prev */}
          <button
            onClick={() => goTo(page - 1)}
            disabled={page === 1}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Prev
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers(page, totalPages).map((p, i) =>
              p === "…" ? (
                <span key={`ellipsis-${i}`} className="w-9 text-center text-slate-400 dark:text-slate-600 text-sm select-none">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => goTo(p as number)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-150 ${
                    page === p
                      ? "bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-md shadow-blue-500/25"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {p}
                </button>
              )
            )}
          </div>

          {/* Next */}
          <button
            onClick={() => goTo(page + 1)}
            disabled={page === totalPages}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>
      )}

      {/* Page indicator */}
      {totalPages > 1 && (
        <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-3">
          Page {page} of {totalPages} · {filtered.length} articles
        </p>
      )}
    </div>
  );
}
