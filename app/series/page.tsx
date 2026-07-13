import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Series",
  description: "Multi-part guides grouped by topic — from theory to implementation.",
};

interface Series {
  id: string;
  title: string;
  description?: string;
  posts: string[];
}

interface PostMeta {
  slugPath: string;
  title: string;
  readingTime: number;
}

export default function SeriesPage() {
  const series: Series[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "content/series.json"), "utf-8")
  );
  const posts: PostMeta[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "content/posts/_index.json"), "utf-8")
  );
  const postMap = Object.fromEntries(posts.map((p) => [p.slugPath, p]));

  const sorted = [...series].sort((a, b) => b.posts.length - a.posts.length);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Series</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {series.length} multi-part guides — each series takes you from concept to implementation.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sorted.map((s) => {
          const totalMinutes = s.posts.reduce((sum, slug) => sum + (postMap[slug]?.readingTime ?? 0), 0);
          return (
            <div
              key={s.id}
              className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all"
            >
              {/* Card header */}
              <div className="p-5 flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[11px] font-bold">
                    {s.posts.length}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                    {s.posts.length === 1 ? "part" : "parts"} · ~{totalMinutes} min
                  </span>
                </div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug mb-1.5">
                  {s.title}
                </h2>
                {s.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {s.description}
                  </p>
                )}
              </div>

              {/* Post list */}
              <ol className="border-t border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                {s.posts.map((slug, i) => {
                  const post = postMap[slug];
                  return (
                    <li key={slug}>
                      <Link
                        href={`/posts/${slug}/`}
                        className="flex items-start gap-3 px-5 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
                      >
                        <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 leading-relaxed pt-0.5">
                          {post?.title ?? slug}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>
          );
        })}
      </div>
    </div>
  );
}
