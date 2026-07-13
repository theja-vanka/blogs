import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  `https://theja-vanka.github.io${process.env.NEXT_PUBLIC_BASE_PATH || ""}`;

export const metadata: Metadata = {
  title: "Series",
  description: "30 multi-part learning paths covering ML architectures, PyTorch training, MLOps, and deployment — from theory to working code.",
  alternates: { canonical: `${SITE_URL}/series/` },
  openGraph: {
    title: "Learning Paths — Krishnatheja Vanka",
    description: "30 multi-part learning paths covering ML architectures, PyTorch training, MLOps, and deployment — from theory to working code.",
    url: `${SITE_URL}/series/`,
    type: "website",
    images: [{ url: `${SITE_URL}/profile.jpg`, width: 400, height: 400, alt: "Krishnatheja Vanka" }],
  },
  twitter: {
    title: "Learning Paths — Krishnatheja Vanka",
    description: "30 multi-part learning paths covering ML architectures, PyTorch training, MLOps, and deployment.",
    images: [`${SITE_URL}/profile.jpg`],
  },
};

interface Series {
  id: string;
  title: string;
  description?: string;
  posts: string[];
  coverImage?: string;
}

interface PostMeta {
  slugPath: string;
  readingTime: number;
}

const TOPIC_GROUPS: { label: string; ids: string[] }[] = [
  {
    label: "Vision Models",
    ids: ["dino", "grounding-dino", "yolo", "matryoshka", "densenet", "mobilenet", "vit", "classic-cnn", "self-supervised"],
  },
  {
    label: "Foundation & Generative",
    ids: ["mamba", "nas", "kan", "convkan", "vlm", "clip", "stable-diffusion", "attention", "moe"],
  },
  {
    label: "Training & Optimization",
    ids: ["distributed", "pytorch-lightning", "pytorch-optimization", "mlflow"],
  },
  {
    label: "Deployment & Serving",
    ids: ["kubeflow", "onnx", "litserve", "milvus", "inference-optimization"],
  },
  {
    label: "Python & Tools",
    ids: ["rust-python", "python314", "python-ml"],
  },
];

export default function SeriesPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  const series: Series[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "content/series.json"), "utf-8")
  );
  const posts: PostMeta[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "content/posts/_index.json"), "utf-8")
  );
  const postMap = Object.fromEntries(posts.map((p) => [p.slugPath, p]));
  const seriesMap = Object.fromEntries(series.map((s) => [s.id, s]));

  const totalPosts = series.reduce((s, r) => s + r.posts.length, 0);
  const totalHours = Math.round(
    series.reduce((s, r) =>
      s + r.posts.reduce((m, slug) => m + (postMap[slug]?.readingTime ?? 0), 0), 0
    ) / 60
  );

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Learning Paths",
    description: "Multi-part guides on ML architectures, training, and deployment.",
    url: `${SITE_URL}/series/`,
    author: { "@type": "Person", name: "Krishnatheja Vanka", url: SITE_URL },
    hasPart: series.map((s) => ({
      "@type": "ItemList",
      name: s.title,
      url: `${SITE_URL}/series/${s.id}/`,
      numberOfItems: s.posts.length,
    })),
  };

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-12">
          <p className="text-[0.7rem] font-bold tracking-[0.12em] uppercase text-blue-600 dark:text-blue-400 mb-4">
            Learning Paths
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-tight text-slate-900 dark:text-slate-100 mb-4">
            Every series,<br />start to finish.
          </h1>
          <p className="text-[0.95rem] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[48ch] mb-8">
            {series.length} curated sequences taking you from first principles to working code —
            no context-switching, no half-finished tutorials.
          </p>
          <div className="flex items-center gap-5">
            {[
              { num: series.length, label: "series" },
              { num: totalPosts, label: "articles" },
              { num: `~${totalHours}h`, label: "of content" },
            ].map((stat, i, arr) => (
              <>
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <span className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums leading-none">
                    {stat.num}
                  </span>
                  <span className="text-[0.7rem] text-slate-400 dark:text-slate-600 uppercase tracking-[0.08em] font-medium">
                    {stat.label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div key={`div-${i}`} className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                )}
              </>
            ))}
          </div>
        </div>
      </div>

      {/* ── Topic sections ───────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-14">
        {TOPIC_GROUPS.map((group) => {
          const groupSeries = group.ids
            .map((id) => seriesMap[id])
            .filter(Boolean) as Series[];
          if (groupSeries.length === 0) return null;

          return (
            <section key={group.label}>
              {/* Section header */}
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-[0.7rem] font-bold tracking-[0.1em] uppercase text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {group.label}
                </h2>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                <span className="font-mono text-[0.65rem] font-bold text-slate-400 dark:text-slate-600 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-2 py-0.5 leading-5">
                  {groupSeries.length}
                </span>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {groupSeries.map((s) => {
                  const totalMinutes = s.posts.reduce(
                    (sum, slug) => sum + (postMap[slug]?.readingTime ?? 0), 0
                  );

                  return (
                    <article
                      key={s.id}
                      className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5 hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-black/40 transition-all duration-200"
                    >
                      <Link href={`/series/${s.id}/`} className="flex flex-col h-full">

                        {/* Cover */}
                        <div className="relative h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                          {s.coverImage ? (
                            <Image
                              src={`${basePath}${s.coverImage}`}
                              alt={s.title}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-blue-600" />
                          )}
                          <span className="absolute top-2.5 right-2.5 bg-black/55 backdrop-blur-sm text-white text-[0.65rem] font-bold tracking-[0.06em] uppercase px-2 py-1 rounded-full">
                            {s.posts.length} {s.posts.length === 1 ? "part" : "parts"}
                          </span>
                        </div>

                        {/* Body */}
                        <div className="flex flex-col flex-1 px-5 pt-4 pb-3 gap-1.5">
                          <span className="font-mono text-[0.68rem] text-slate-400 dark:text-slate-600 tabular-nums">
                            ~{totalMinutes} min total
                          </span>
                          <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                            {s.title}
                          </h3>
                          {s.description && (
                            <p className="text-[0.75rem] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                              {s.description}
                            </p>
                          )}
                        </div>

                        {/* Footer CTA */}
                        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800">
                          <span className="inline-flex items-center gap-1.5 text-[0.75rem] font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-2.5 transition-all duration-150">
                            View curriculum
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
            </section>
          );
        })}
      </div>
    </div>
    </>
  );
}
