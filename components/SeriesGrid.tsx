"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export interface SeriesItem {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  partsCount: number;
  totalMinutes: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  topic: string;
  topicColor: string;
}

const DIFFICULTY_META = {
  beginner:     { label: "Beginner",     dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-400/60" },
  intermediate: { label: "Intermediate", dot: "bg-amber-500",   text: "text-amber-600 dark:text-amber-400",     ring: "ring-amber-400/60"   },
  advanced:     { label: "Advanced",     dot: "bg-rose-500",    text: "text-rose-600 dark:text-rose-400",       ring: "ring-rose-400/60"    },
};

export default function SeriesGrid({
  items,
  topics,
  basePath,
}: {
  items: SeriesItem[];
  topics: string[];
  basePath: string;
}) {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<SeriesItem["difficulty"] | null>(null);

  const filtered = items.filter((s) => {
    if (activeTopic && s.topic !== activeTopic) return false;
    if (activeDifficulty && s.difficulty !== activeDifficulty) return false;
    return true;
  });

  const hasFilter = activeTopic !== null || activeDifficulty !== null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 pb-20">

      {/* ── Filter bar ─────────────────────────────────────── */}
      <div className="flex flex-col gap-3 mb-8 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">

        {/* Topic row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-slate-400 dark:text-slate-500 w-14 shrink-0">
            Topic
          </span>
          <button
            onClick={() => setActiveTopic(null)}
            className={`px-3 py-1 rounded-full text-[0.72rem] font-semibold border transition-all duration-150 ${
              activeTopic === null
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-transparent"
                : "bg-transparent text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
            }`}
          >
            All
          </button>
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTopic(activeTopic === t ? null : t)}
              className={`px-3 py-1 rounded-full text-[0.72rem] font-semibold border transition-all duration-150 ${
                activeTopic === t
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-transparent"
                  : "bg-transparent text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 dark:bg-slate-800" />

        {/* Difficulty row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-slate-400 dark:text-slate-500 w-14 shrink-0">
            Level
          </span>
          <button
            onClick={() => setActiveDifficulty(null)}
            className={`px-3 py-1 rounded-full text-[0.72rem] font-semibold border transition-all duration-150 ${
              activeDifficulty === null
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-transparent"
                : "bg-transparent text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
            }`}
          >
            All
          </button>
          {(["beginner", "intermediate", "advanced"] as const).map((d) => {
            const meta = DIFFICULTY_META[d];
            const isActive = activeDifficulty === d;
            return (
              <button
                key={d}
                onClick={() => setActiveDifficulty(isActive ? null : d)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.72rem] font-semibold border transition-all duration-150 ${
                  isActive
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-transparent"
                    : "bg-transparent text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${meta.dot} shrink-0`} />
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Result count + clear ───────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-[0.75rem] text-slate-400 dark:text-slate-500 font-mono">
          {filtered.length} {filtered.length === 1 ? "series" : "series"} found
        </p>
        {hasFilter && (
          <button
            onClick={() => { setActiveTopic(null); setActiveDifficulty(null); }}
            className="text-[0.72rem] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline underline-offset-2 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Card grid ─────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-40">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <p className="text-sm">No series match these filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => {
            const diffMeta = DIFFICULTY_META[s.difficulty];
            return (
              <article
                key={s.id}
                className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/50 transition-all duration-200"
              >
                <Link href={`/series/${s.id}/`} className="flex flex-col h-full">

                  {/* Cover */}
                  <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                    {s.coverImage ? (
                      <Image
                        src={`${basePath}${s.coverImage}`}
                        alt={s.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${s.topicColor}`} />
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
                    {/* Parts badge — top right */}
                    <span className="absolute top-2.5 right-2.5 bg-black/55 backdrop-blur-sm text-white text-[0.65rem] font-bold tracking-[0.06em] uppercase px-2 py-1 rounded-full">
                      {s.partsCount} {s.partsCount === 1 ? "part" : "parts"}
                    </span>
                    {/* Difficulty badge — bottom left */}
                    <span className={`absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 bg-black/55 backdrop-blur-sm text-white text-[0.62rem] font-semibold px-2 py-1 rounded-full ring-1 ${diffMeta.ring}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${diffMeta.dot}`} />
                      {diffMeta.label}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-1 px-5 pt-4 pb-3 gap-2">
                    <h3 className="font-sans text-base font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
                      {s.title}
                    </h3>
                    {s.description && (
                      <p className="text-[0.75rem] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 flex-1">
                        {s.description}
                      </p>
                    )}
                    <span className="font-mono text-[0.68rem] text-slate-400 dark:text-slate-600 tabular-nums mt-auto">
                      ~{s.totalMinutes} min total
                    </span>
                  </div>

                  {/* Footer CTA */}
                  <div className={`px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-gradient-to-r ${s.topicColor} bg-[length:0%_2px] bg-no-repeat bg-bottom group-hover:bg-[length:100%_2px] transition-all duration-300`}>
                    <span className="inline-flex items-center gap-1.5 text-[0.75rem] font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-2.5 transition-all duration-150">
                      View series
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
