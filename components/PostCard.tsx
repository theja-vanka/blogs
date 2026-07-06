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

export default function PostCard({ post }: { post: PostMeta }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const primaryCat = post.categories[0];
  const gradient = (primaryCat && categoryGradient[primaryCat]) ?? "from-blue-500 to-violet-500";

  return (
    <Link
      href={`/posts/${post.slugPath}/`}
      className="group flex flex-col h-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-slate-950/60 hover:-translate-y-1 transition-all duration-200"
    >
      {/* Cover image */}
      <div className="relative h-44 w-full shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800">
        {post.coverImage ? (
          <Image
            src={`${basePath}${post.coverImage}`}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        )}
        {isNew(post.date) && (
          <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-sm">
            New
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-2.5 p-5 flex-1">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
          {post.title}
        </h2>

        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.categories.slice(0, 3).map((c) => (
              <CategoryBadge key={c} category={c} small />
            ))}
          </div>
        )}

        {post.description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 flex-1">
            {post.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <span>{formatDate(post.date)}</span>
            <span>·</span>
            <span>{post.readingTime} min read</span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-300 dark:text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-200 shrink-0"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Category-colored bottom bar */}
      <div className={`h-0.5 w-full bg-gradient-to-r ${gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-200`} />
    </Link>
  );
}
