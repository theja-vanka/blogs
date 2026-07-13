import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  `https://theja-vanka.github.io${process.env.NEXT_PUBLIC_BASE_PATH || ""}`;

export const metadata: Metadata = {
  title: "About",
  description: "Applied Scientist and ML Engineer specialising in computer vision, PyTorch, and production ML systems — Krishnatheja Vanka.",
  alternates: { canonical: `${SITE_URL}/about/` },
  openGraph: {
    title: "About — Krishnatheja Vanka",
    description: "Applied Scientist and ML Engineer specialising in computer vision, PyTorch, and production ML systems.",
    url: `${SITE_URL}/about/`,
    type: "profile",
    images: [{ url: `${SITE_URL}/profile.jpg`, width: 400, height: 400, alt: "Krishnatheja Vanka" }],
  },
  twitter: {
    title: "About — Krishnatheja Vanka",
    description: "Applied Scientist and ML Engineer specialising in computer vision, PyTorch, and production ML systems.",
    images: [`${SITE_URL}/profile.jpg`],
  },
};

const SKILLS = [
  "Python", "PyTorch", "Computer Vision", "MLOps",
  "CUDA", "ONNX", "AWS", "Distributed Training",
];

const WRITING_TOPICS = [
  { label: "Model Architectures", desc: "ViT, Mamba, KAN, DenseNet, YOLO and more" },
  { label: "Training at Scale", desc: "Distributed training, AMP, quantization, CUDA" },
  { label: "MLOps & Deployment", desc: "MLflow, Kubeflow, LitServe, ONNX, edge devices" },
  { label: "Foundational Models", desc: "CLIP, BLIP-2, VLMs, stable diffusion, DINO" },
  { label: "Python for ML", desc: "Functional tools, concurrency, Rust extensions" },
];

export default function AboutPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Krishnatheja Vanka",
    jobTitle: "Applied Scientist & Machine Learning Engineer",
    url: SITE_URL,
    image: `${SITE_URL}/profile.jpg`,
    sameAs: [
      "https://github.com/theja-vanka",
      "https://www.linkedin.com/in/krishnatheja-vanka/",
    ],
    knowsAbout: [
      "Machine Learning", "Computer Vision", "PyTorch", "MLOps",
      "Distributed Training", "ONNX", "CUDA", "Python",
    ],
  };

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
    <div className="max-w-3xl mx-auto px-6 py-16">

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start gap-8 mb-12">
        <div className="shrink-0 relative">
          <div className="absolute -inset-1.5 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full opacity-50 blur-sm" />
          <Image
            src={`${basePath}/profile.jpg`}
            alt="Krishnatheja Vanka"
            width={100}
            height={100}
            className="relative rounded-full ring-2 ring-white dark:ring-slate-900 shadow-2xl"
            priority
          />
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
            Krishnatheja Vanka
          </h1>
          <p className="text-sm font-semibold uppercase tracking-widest mb-3 bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">
            Applied Scientist · Machine Learning Engineer
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="https://github.com/theja-vanka"
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"/>
              </svg>
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/krishnatheja-vanka/"
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
            <a
              href={`${basePath}/feed.xml`}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-orange-200 dark:border-orange-800 bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/>
              </svg>
              RSS
            </a>
          </div>
        </div>
      </div>

      {/* ── Bio ──────────────────────────────────────────────────── */}
      <section className="mb-12 prose prose-slate dark:prose-invert max-w-none">
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          I work at the intersection of research and production — training models, building ML systems,
          and closing the gap between experiment and deployment. My focus is applied computer vision:
          getting research ideas to actually ship in production environments.
        </p>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          This blog is where I write down what I learn — practical guides on model architectures,
          training at scale, deployment pipelines, and the engineering decisions that make research usable.
          I try to write the articles I wish had existed when I was figuring something out.
        </p>
      </section>

      {/* ── Skills ───────────────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Stack</h2>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((s) => (
            <span key={s} className="text-sm px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 font-mono">
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* ── Writing topics ───────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">What I write about</h2>
        <div className="flex flex-col gap-3">
          {WRITING_TOPICS.map((t) => (
            <div key={t.label} className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 transition-opacity shadow-md"
        >
          Browse all posts
        </Link>
        <Link
          href="/series/"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Browse series
        </Link>
      </div>
    </div>
    </>
  );
}
