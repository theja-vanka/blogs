import Link from "next/link";
import type { PostSeriesContext } from "@/lib/series";

export default function SeriesBanner({ ctx }: { ctx: PostSeriesContext }) {
  const { series, partIndex, totalParts, titles } = ctx;

  return (
    <div className="mb-8 rounded-xl border border-blue-200/60 dark:border-blue-800/40 bg-blue-50/40 dark:bg-blue-950/20 p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-1">
            Series · Part {partIndex + 1} of {totalParts}
          </p>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">{series.title}</p>
          {series.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{series.description}</p>
          )}
        </div>
      </div>

      {/* Part list */}
      <ol className="flex flex-col gap-2">
        {series.posts.map((slugPath, i) => {
          const isCurrent = i === partIndex;
          const title = titles[slugPath] ?? slugPath;
          return (
            <li key={slugPath} className="flex items-start gap-2.5">
              <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold leading-none ${
                isCurrent
                  ? "bg-blue-600 text-white"
                  : i < partIndex
                    ? "bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
              }`}>
                {i + 1}
              </span>
              {isCurrent ? (
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-relaxed pt-0.5">
                  {title}
                </span>
              ) : (
                <Link
                  href={`/posts/${slugPath}/`}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-relaxed pt-0.5 line-clamp-1"
                >
                  {title}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
