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
  description: "30 multi-part series paths covering ML architectures, PyTorch training, MLOps, and deployment — from theory to working code.",
  alternates: { canonical: `${SITE_URL}/series/` },
  openGraph: {
    title: "Series Paths — Krishnatheja Vanka",
    description: "30 multi-part series paths covering ML architectures, PyTorch training, MLOps, and deployment — from theory to working code.",
    url: `${SITE_URL}/series/`,
    type: "website",
    images: [{ url: `${SITE_URL}/profile.jpg`, width: 400, height: 400, alt: "Krishnatheja Vanka" }],
  },
  twitter: {
    title: "Series Paths — Krishnatheja Vanka",
    description: "30 multi-part series paths covering ML architectures, PyTorch training, MLOps, and deployment.",
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

const TOPIC_GROUPS: { label: string; ids: string[]; color: string }[] = [
  {
    label: "Vision Models",
    color: "from-violet-500 to-purple-600",
    ids: ["dino", "grounding-dino", "yolo", "matryoshka", "densenet", "mobilenet", "vit", "classic-cnn", "self-supervised"],
  },
  {
    label: "Foundation & Generative",
    color: "from-blue-500 to-cyan-500",
    ids: ["mamba", "nas", "kan", "convkan", "vlm", "clip", "diffusion-models", "stable-diffusion", "attention", "moe"],
  },
  {
    label: "Training & Optimization",
    color: "from-amber-500 to-orange-500",
    ids: ["distributed", "pytorch-lightning", "pytorch-optimization", "mlflow"],
  },
  {
    label: "Deployment & Serving",
    color: "from-emerald-500 to-teal-500",
    ids: ["kubeflow", "onnx", "litserve", "milvus", "inference-optimization"],
  },
  {
    label: "Python & Tools",
    color: "from-rose-500 to-pink-500",
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
    name: "Series Paths",
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
      <div className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-700/50 bg-gradient-to-br from-white via-blue-50/40 to-violet-50/30 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900">
        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(148,163,184,0.2) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        {/* Orbs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-400/10 dark:bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-violet-400/10 dark:bg-violet-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 pt-14 pb-12">
          <p className="text-[0.7rem] font-bold tracking-[0.14em] uppercase text-blue-600 dark:text-blue-400 mb-3">
            Series Paths
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-slate-900 dark:text-slate-100 mb-4">
            Every series,<br className="hidden sm:block" /> start to finish.
          </h1>
          <p className="text-[0.95rem] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[46ch] mb-8">
            {series.length} curated sequences — from first principles to working code,
            no context-switching, no half-finished tutorials.
          </p>

          {/* Stat chips */}
          <div className="flex flex-wrap gap-2.5">
            {[
              { icon: "M9 17V7m0 10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 10a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 10V7m0 10a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2", num: series.length, label: "series", color: "text-blue-500" },
              { icon: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z", num: totalPosts, label: "articles", color: "text-violet-500" },
              { icon: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z", num: `~${totalHours}h`, label: "of content", color: "text-emerald-500" },
            ].map((stat) => (
              <div key={stat.label} className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-sm text-slate-700 dark:text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${stat.color} shrink-0`}>
                  <path d={stat.icon}/>
                </svg>
                <span className="font-bold font-mono tabular-nums">{stat.num}</span>
                <span className="text-slate-400 dark:text-slate-500 text-xs">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Topic sections ───────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {TOPIC_GROUPS.map((group) => {
          const groupSeries = group.ids
            .map((id) => seriesMap[id])
            .filter(Boolean) as Series[];
          if (groupSeries.length === 0) return null;

          return (
            <section key={group.label}>
              {/* Section header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`h-5 w-1 rounded-full bg-gradient-to-b ${group.color} shrink-0`} />
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                  {group.label}
                </h2>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                <span className={`text-[0.65rem] font-bold bg-gradient-to-r ${group.color} bg-clip-text text-transparent border border-slate-200 dark:border-slate-700 rounded-full px-2.5 py-0.5 leading-5`}>
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
                            <div className={`absolute inset-0 bg-gradient-to-br ${group.color}`} />
                          )}
                          {/* Subtle bottom gradient for text readability */}
                          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
                          <span className="absolute top-2.5 right-2.5 bg-black/55 backdrop-blur-sm text-white text-[0.65rem] font-bold tracking-[0.06em] uppercase px-2 py-1 rounded-full">
                            {s.posts.length} {s.posts.length === 1 ? "part" : "parts"}
                          </span>
                        </div>

                        {/* Body */}
                        <div className="flex flex-col flex-1 px-5 pt-4 pb-3 gap-2">
                          <h3 className="font-sans text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                            {s.title}
                          </h3>
                          {s.description && (
                            <p className="text-[0.75rem] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 flex-1">
                              {s.description}
                            </p>
                          )}
                          <span className="font-mono text-[0.68rem] text-slate-400 dark:text-slate-600 tabular-nums mt-auto">
                            ~{totalMinutes} min total
                          </span>
                        </div>

                        {/* Footer CTA */}
                        <div className={`px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-gradient-to-r ${group.color} bg-[length:0%_2px] bg-no-repeat bg-bottom group-hover:bg-[length:100%_2px] transition-all duration-300`}>
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
            </section>
          );
        })}
      </div>
    </div>
    </>
  );
}
