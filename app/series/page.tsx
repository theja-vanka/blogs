import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import SeriesGrid, { type SeriesItem } from "@/components/SeriesGrid";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  `https://theja-vanka.github.io${process.env.NEXT_PUBLIC_BASE_PATH || ""}`;

export const metadata: Metadata = {
  title: "Series",
  description: "31 multi-part series paths covering ML architectures, PyTorch training, MLOps, and deployment — from theory to working code.",
  alternates: { canonical: `${SITE_URL}/series/` },
  openGraph: {
    title: "Series Paths — Krishnatheja Vanka",
    description: "31 multi-part series paths covering ML architectures, PyTorch training, MLOps, and deployment — from theory to working code.",
    url: `${SITE_URL}/series/`,
    type: "website",
    images: [{ url: `${SITE_URL}/profile.jpg`, width: 400, height: 400, alt: "Krishnatheja Vanka" }],
  },
  twitter: {
    title: "Series Paths — Krishnatheja Vanka",
    description: "31 multi-part series paths covering ML architectures, PyTorch training, MLOps, and deployment.",
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
  categories?: string[];
}

const DIFFICULTY_LEVELS = ["beginner", "intermediate", "advanced"] as const;
type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

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

function computeDifficulty(s: Series, postMap: Record<string, PostMeta>): DifficultyLevel {
  const votes: Partial<Record<DifficultyLevel, number>> = {};
  for (const slug of s.posts) {
    const cats = postMap[slug]?.categories ?? [];
    const level = cats.find((c): c is DifficultyLevel => (DIFFICULTY_LEVELS as readonly string[]).includes(c));
    if (level) votes[level] = (votes[level] ?? 0) + 1;
  }
  const sorted = (Object.entries(votes) as [DifficultyLevel, number][]).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] ?? "intermediate";
}

export default function SeriesPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  const series: Series[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "content/series.json"), "utf-8")
  );
  const posts: PostMeta[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "content/posts/_index.json"), "utf-8")
  );
  const postMap: Record<string, PostMeta> = Object.fromEntries(posts.map((p) => [p.slugPath, p]));

  // Build topic lookup
  const topicById: Record<string, { label: string; color: string }> = {};
  for (const group of TOPIC_GROUPS) {
    for (const id of group.ids) {
      topicById[id] = { label: group.label, color: group.color };
    }
  }

  const totalPosts = series.reduce((s, r) => s + r.posts.length, 0);
  const totalHours = Math.round(
    series.reduce((s, r) =>
      s + r.posts.reduce((m, slug) => m + (postMap[slug]?.readingTime ?? 0), 0), 0
    ) / 60
  );

  // Enrich each series into a flat SeriesItem for the client grid
  const items: SeriesItem[] = series.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    coverImage: s.coverImage,
    partsCount: s.posts.length,
    totalMinutes: s.posts.reduce((sum, slug) => sum + (postMap[slug]?.readingTime ?? 0), 0),
    difficulty: computeDifficulty(s, postMap),
    topic: topicById[s.id]?.label ?? "Other",
    topicColor: topicById[s.id]?.color ?? "from-blue-500 to-violet-500",
  }));

  const topics = TOPIC_GROUPS.map((g) => g.label);

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
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(148,163,184,0.2) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
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

      {/* ── Filterable grid ──────────────────────────────────── */}
      <SeriesGrid items={items} topics={topics} basePath={basePath} />

    </div>
    </>
  );
}
