import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

interface Series {
  id: string;
  title: string;
  description?: string;
  posts: string[];
  coverImage?: string;
}

interface PostMeta {
  slugPath: string;
  title: string;
  description: string;
  readingTime: number;
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  `https://theja-vanka.github.io${process.env.NEXT_PUBLIC_BASE_PATH || ""}`;

function readSeries(): Series[] {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "content/series.json"), "utf-8")
  );
}

function readPosts(): PostMeta[] {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "content/posts/_index.json"), "utf-8")
  );
}

export async function generateStaticParams() {
  return readSeries().map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const series = readSeries().find((s) => s.id === id);
  if (!series) return {};
  const url = `${SITE_URL}/series/${id}/`;
  const ogImage = series.coverImage
    ? `https://theja-vanka.github.io${series.coverImage}`
    : `${SITE_URL}/profile.jpg`;
  return {
    title: series.title,
    description: series.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${series.title} — Krishnatheja Vanka`,
      description: series.description,
      url,
      type: "website",
      images: [{ url: ogImage, alt: series.title }],
    },
    twitter: {
      title: `${series.title} — Krishnatheja Vanka`,
      description: series.description,
      images: [ogImage],
    },
  };
}

export default async function SeriesDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const series = readSeries().find((s) => s.id === id);
  if (!series) notFound();

  const postMap = Object.fromEntries(readPosts().map((p) => [p.slugPath, p]));

  const parts = series.posts.map((slugPath, i) => {
    const p = postMap[slugPath];
    return {
      index: i,
      slugPath,
      title: p?.title ?? slugPath,
      description: p?.description ?? "",
      readingTime: p?.readingTime ?? 0,
    };
  });

  const totalMinutes = parts.reduce((s, p) => s + p.readingTime, 0);
  const firstSlug = series.posts[0];

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: series.title,
    description: series.description,
    url: `${SITE_URL}/series/${id}/`,
    author: { "@type": "Person", name: "Krishnatheja Vanka", url: SITE_URL },
    numberOfItems: parts.length,
    itemListElement: parts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      url: `${SITE_URL}/posts/${p.slugPath}/`,
    })),
  };

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-slate-950">
        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(148,163,184,0.12) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        {/* Gradient orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        {/* Bottom fade into page */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />

        {/* Content — normal flow so the container gets height from content */}
        <div className="relative max-w-4xl mx-auto w-full px-6 pt-10 pb-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[0.73rem] text-white/50 mb-6">
            <Link href="/series/" className="hover:text-white/80 transition-colors">Series</Link>
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
            <span className="text-white/70 truncate">{series.title}</span>
          </nav>

          <p className="text-[0.65rem] font-bold tracking-[0.14em] uppercase text-blue-400 mb-2">
            Series Path · {parts.length} parts
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-3">
            {series.title}
          </h1>
          {series.description && (
            <p className="text-[0.9rem] text-white/65 leading-relaxed max-w-[54ch] mb-6">
              {series.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 mb-7">
            <span className="inline-flex items-center gap-1.5 text-[0.8rem] text-white/60 font-mono">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              ~{totalMinutes} min total
            </span>
            <span className="text-white/25">·</span>
            <span className="inline-flex items-center gap-1.5 text-[0.8rem] text-white/60 font-mono">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
              {parts.length} articles
            </span>
          </div>

          {firstSlug && (
            <Link
              href={`/posts/${firstSlug}/`}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-blue-900/40"
            >
              Start from Part 1
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* ── Curriculum ───────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-10 pb-20">
        <p className="text-[0.7rem] font-bold tracking-[0.12em] uppercase text-slate-400 dark:text-slate-600 mb-5">
          Curriculum — {parts.length} parts
        </p>

        <ol className="flex flex-col gap-2">
          {parts.map((part, i) => (
            <li key={part.slugPath}>
              <Link
                href={`/posts/${part.slugPath}/`}
                className="group flex items-start gap-4 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-800 hover:shadow-md dark:hover:shadow-xl dark:hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Number badge */}
                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[0.75rem] font-bold font-mono flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[0.9rem] font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-300 leading-snug mb-1 transition-colors duration-150">
                    {part.title}
                  </h3>
                  {part.description && (
                    <p className="text-[0.75rem] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-1.5">
                      {part.description}
                    </p>
                  )}
                  {part.readingTime > 0 && (
                    <span className="inline-flex items-center gap-1 text-[0.65rem] font-mono text-slate-400 dark:text-slate-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {part.readingTime} min read
                    </span>
                  )}
                </div>

                {/* Arrow */}
                <svg
                  xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="text-slate-300 dark:text-slate-700 group-hover:text-blue-500 dark:group-hover:text-blue-400 shrink-0 mt-1 group-hover:translate-x-0.5 transition-all duration-150"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </li>
          ))}
        </ol>

        {/* Footer */}
        {firstSlug && (
          <div className="flex items-center gap-4 mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
            <Link
              href={`/posts/${firstSlug}/`}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Start from Part 1
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link
              href="/series/"
              className="text-[0.82rem] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 underline underline-offset-2 transition-colors"
            >
              Browse all series
            </Link>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
