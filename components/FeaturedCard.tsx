import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "./CategoryBadge";

const categoryGradient: Record<string, string> = {
  advanced:     "from-violet-500 to-purple-600",
  beginner:     "from-green-400 to-emerald-500",
  code:         "from-emerald-400 to-teal-500",
  intermediate: "from-amber-400 to-orange-500",
  mlops:        "from-rose-500 to-pink-500",
  news:         "from-teal-400 to-cyan-500",
  research:     "from-indigo-500 to-violet-500",
  tutorial:     "from-cyan-400 to-blue-500",
};

function isNew(date: string) {
  if (!date) return false;
  return Date.now() - new Date(date).getTime() < 30 * 24 * 60 * 60 * 1000;
}

export default function FeaturedCard({ post }: { post: PostMeta }) {
  const primaryCat = post.categories[0];
  const gradient = (primaryCat && categoryGradient[primaryCat]) ?? "from-blue-500 to-violet-500";

  return (
    <Link
      href={`/posts/${post.slugPath}/`}
      className="group flex flex-col sm:flex-row rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-2xl hover:shadow-slate-200/60 dark:hover:shadow-slate-950/60 hover:-translate-y-0.5 transition-all duration-300 mb-4"
    >
      {/* Cover */}
      <div className="relative h-52 sm:h-auto sm:w-2/5 shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, 40vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col justify-between p-6 sm:p-8 flex-1 min-w-0">
        <div className="flex flex-col gap-3">
          {/* Labels */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Latest
            </span>
            {isNew(post.date) && (
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                New
              </span>
            )}
            {post.categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.categories.slice(0, 3).map((c) => (
                  <CategoryBadge key={c} category={c} small />
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
            {post.title}
          </h2>

          {/* Description */}
          {post.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
              {post.description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <span>{formatDate(post.date)}</span>
            <span>·</span>
            <span>{post.readingTime} min read</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2.5 transition-all duration-200">
            Read article
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
