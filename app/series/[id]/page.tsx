import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

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
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

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

      {/* ── Breadcrumb ───────────────────────────────────────── */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <nav className="max-w-2xl mx-auto px-6 py-3 flex items-center gap-2 text-[0.78rem] text-slate-400 dark:text-slate-600">
          <Link href="/series/" className="text-blue-600 dark:text-blue-400 hover:underline">
            Series
          </Link>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
          <span className="text-slate-500 dark:text-slate-400 truncate">{series.title}</span>
        </nav>
      </div>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        {series.coverImage && (
          <div className="absolute inset-0">
            <Image
              src={`${basePath}${series.coverImage}`}
              alt={series.title}
              fill
              sizes="100vw"
              className="object-cover opacity-10 dark:opacity-[0.07] saturate-50"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900/50" />
          </div>
        )}
        <div className="relative max-w-2xl mx-auto px-6 py-14">
          <p className="text-[0.68rem] font-bold tracking-[0.12em] uppercase text-blue-600 dark:text-blue-400 mb-3">
            Learning Path · {parts.length} parts
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-slate-900 dark:text-slate-100 mb-3">
            {series.title}
          </h1>
          {series.description && (
            <p className="text-[1rem] text-slate-500 dark:text-slate-400 leading-relaxed mb-6 max-w-[52ch]">
              {series.description}
            </p>
          )}
          <div className="flex items-center gap-4 mb-7 text-[0.8rem] text-slate-500 dark:text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="12 8 12 12 14 14"/><circle cx="12" cy="12" r="10"/>
              </svg>
              ~{totalMinutes} min total
            </span>
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
              {parts.length} articles
            </span>
          </div>
          {firstSlug && (
            <Link
              href={`/posts/${firstSlug}/`}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
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
      <div className="max-w-2xl mx-auto px-6 py-10 pb-20">
        <p className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-slate-400 dark:text-slate-600 mb-6">
          Curriculum
        </p>

        <ol className="flex flex-col">
          {parts.map((part, i) => (
            <li key={part.slugPath} className="flex">
              <Link href={`/posts/${part.slugPath}/`} className="group flex w-full">

                {/* Number + connector column */}
                <div className="flex flex-col items-center w-10 shrink-0 pt-3.5">
                  <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[0.7rem] font-bold font-mono flex items-center justify-center shrink-0 group-hover:bg-blue-600 dark:group-hover:bg-blue-500 group-hover:text-white transition-colors duration-150">
                    {i + 1}
                  </div>
                  {i < parts.length - 1 && (
                    <div className="w-px flex-1 bg-slate-200 dark:bg-slate-800 my-1.5 min-h-4" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4 pl-3 min-w-0">
                  <div className="flex items-start justify-between gap-3 px-4 py-3 rounded-lg border border-transparent group-hover:bg-blue-50/60 dark:group-hover:bg-blue-950/20 group-hover:border-slate-200 dark:group-hover:border-slate-700 transition-all duration-150">
                    <div className="flex flex-col gap-1 min-w-0">
                      <h3 className="text-[0.9rem] font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-300 leading-snug transition-colors duration-150">
                        {part.title}
                      </h3>
                      {part.description && (
                        <p className="text-[0.75rem] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                          {part.description}
                        </p>
                      )}
                      {part.readingTime > 0 && (
                        <span className="text-[0.68rem] text-slate-400 dark:text-slate-600 font-mono mt-0.5">
                          {part.readingTime} min read
                        </span>
                      )}
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="text-slate-300 dark:text-slate-700 group-hover:text-blue-500 dark:group-hover:text-blue-400 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>

        {/* Footer */}
        {firstSlug && (
          <div className="flex items-center gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
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
