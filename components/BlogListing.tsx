"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import type { PostMeta } from "@/lib/types";
import PostCard from "./PostCard";
import FeaturedCard from "./FeaturedCard";

const POSTS_PER_PAGE = 9;
type SortKey = "newest" | "oldest" | "shortest";

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
  const [sort, setSort] = useState<SortKey>("newest");
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  // Sync state from URL after every render so that navigating to "/" (Blog/KV links)
  // resets page and category even when the component doesn't remount.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const cat = params.get("category") ?? "all";
    const validCat = (cat === "all" || posts.some((p) => p.categories.includes(cat))) ? cat : "all";
    if (validCat !== active) setActive(validCat);

    const p = parseInt(params.get("page") ?? "1", 10);
    const safePage = isNaN(p) || p < 1 ? 1 : p;
    if (safePage !== page) setPage(safePage);
  });

  const featuredPosts = useMemo(() => posts.filter((p) => p.featured), [posts]);

  const visibleFeatured = useMemo(
    () => active === "all" ? featuredPosts : featuredPosts.filter((p) => p.categories.includes(active)),
    [featuredPosts, active]
  );

  const filtered = useMemo(() => {
    const base = active === "all" ? posts : posts.filter((p) => p.categories.includes(active));
    return base.filter((p) => !p.featured);
  }, [posts, active]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === "oldest") arr.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    else if (sort === "shortest") arr.sort((a, b) => a.readingTime - b.readingTime);
    else arr.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return arr;
  }, [filtered, sort]);

  const totalCount = visibleFeatured.length + sorted.length;
  const totalPages = Math.ceil(sorted.length / POSTS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  function goTo(p: number) {
    setPage(p);
    const url = new URL(window.location.href);
    if (p === 1) url.searchParams.delete("page");
    else url.searchParams.set("page", String(p));
    window.history.replaceState({}, "", url.toString());
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function selectCategory(cat: string) {
    setActive(cat);
    setPage(1);
    const url = new URL(window.location.href);
    if (cat === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", cat);
    url.searchParams.delete("page");
    window.history.replaceState({}, "", url.toString());
  }

  function selectSort(s: SortKey) {
    setSort(s);
    setPage(1);
    const url = new URL(window.location.href);
    url.searchParams.delete("page");
    window.history.replaceState({}, "", url.toString());
  }

  return (
    <div ref={topRef}>

      {/* ── Featured section ─────────────────────────────────────────── */}
      {visibleFeatured.length > 0 && (
        <div className="mb-10">
          <div className="flex flex-col gap-4">
            {visibleFeatured.map((post) => (
              <FeaturedCard key={post.slugPath} post={post} />
            ))}
          </div>
        </div>
      )}

      {/* ── Category pills ───────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["all", ...categories].map((cat) => {
          const count = cat === "all" ? posts.length : posts.filter((p) => p.categories.includes(cat)).length;
          const isActive = active === cat;
          const label = cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1);
          return (
            <button
              key={cat}
              onClick={() => selectCategory(cat)}
              className={`inline-flex items-center gap-1.5 text-sm rounded-full px-3.5 py-1.5 font-medium transition-all duration-150 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              {label}
              <span className={`text-[11px] font-mono leading-none rounded-full px-1.5 py-0.5 ${
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

      {/* ── Toolbar ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          <span className="font-semibold text-slate-600 dark:text-slate-300">{totalCount}</span>{" "}
          {totalCount === 1 ? "article" : "articles"}
          {active !== "all" && (
            <> in <span className="text-slate-500 dark:text-slate-400">{active.charAt(0).toUpperCase() + active.slice(1)}</span></>
          )}
        </p>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 rounded-full p-1">
          {(["newest", "oldest", "shortest"] as SortKey[]).map((s) => (
            <button
              key={s}
              onClick={() => selectSort(s)}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-all duration-150 ${
                sort === s
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              {s === "newest" ? "Newest" : s === "oldest" ? "Oldest" : "Shortest"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Posts grid ───────────────────────────────────────────────── */}
      {sorted.length === 0 && visibleFeatured.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400 py-16 text-center">No posts in this category.</p>
      ) : sorted.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {paginated.map((post) => (
            <PostCard key={post.slugPath} post={post} />
          ))}
        </div>
      ) : null}

      {/* ── Pagination ───────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-12">
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

          <div className="flex items-center gap-1">
            {pageNumbers(page, totalPages).map((p, i) =>
              p === "…" ? (
                <span key={`ellipsis-${i}`} className="w-9 text-center text-slate-400 dark:text-slate-600 text-sm select-none">…</span>
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

      {totalPages > 1 && (
        <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-3">
          Page {page} of {totalPages}
        </p>
      )}
    </div>
  );
}
