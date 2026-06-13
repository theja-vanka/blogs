import Image from "next/image";
import { getAllPosts, getAllCategories } from "@/lib/posts";
import BlogListing from "@/components/BlogListing";

export const metadata = {
  title: "Blog",
  description: "Applied Scientist and Machine Learning Engineer writing about ML research, model deployment, and production systems.",
};

const SKILLS = ["Python", "PyTorch", "Computer Vision", "MLOps", "CUDA", "ONNX", "AWS"];

export default function HomePage() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const totalMinutes = posts.reduce((sum, p) => sum + p.readingTime, 0);
  const totalHours = Math.round(totalMinutes / 60);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative mb-16 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700/50 bg-gradient-to-br from-white via-blue-50/50 to-violet-50/40 dark:from-slate-900 dark:via-blue-950/30 dark:to-slate-900 shadow-sm">
        {/* Decorative orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/15 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-violet-400/15 dark:bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.04)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative px-8 py-12">
          <div className="flex flex-col sm:flex-row items-start gap-8">

            {/* Avatar with glowing gradient ring */}
            <div className="shrink-0 relative">
              <div className="absolute -inset-1.5 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full opacity-50 blur-sm" />
              <Image
                src={`${basePath}/profile.jpg`}
                alt="Krishnatheja Vanka"
                width={88}
                height={88}
                className="relative rounded-full ring-2 ring-white dark:ring-slate-900 shadow-2xl"
                priority
              />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-1.5">
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                  Krishnatheja Vanka
                </span>
              </h1>

              <p className="text-[13px] font-semibold uppercase tracking-widest mb-4 bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">
                Applied Scientist · Machine Learning Engineer
              </p>

              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xl mb-4">
                Working at the intersection of research and production — training models, building ML systems,
                and closing the gap between experiment and deployment. Writing practical guides on applied ML,
                scientific computing, and the engineering decisions that make research actually ship.
              </p>

              {/* Tech stack tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {SKILLS.map((skill) => (
                  <span key={skill} className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/80 font-mono">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Stats + links */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-xs text-slate-600 dark:text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 shrink-0">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span className="font-semibold">{posts.length}</span> articles
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-xs text-slate-600 dark:text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-500 shrink-0">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
                  </svg>
                  <span className="font-semibold">{categories.length}</span> topics
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-xs text-slate-600 dark:text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 shrink-0">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  ~<span className="font-semibold">{totalHours}h</span> of content
                </span>
                <a
                  href="https://github.com/theja-vanka"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-xs text-slate-600 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"/>
                  </svg>
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/krishnatheja-vanka/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-xs text-slate-600 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Articles ─────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 shrink-0">Articles</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-slate-200 via-slate-200/50 to-transparent dark:from-slate-700 dark:via-slate-700/50" />
          <a
            href={`${basePath}/feed.xml`}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
            title="Subscribe via RSS"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/>
            </svg>
            RSS
          </a>
        </div>

        {posts.length === 0 ? (
          <div className="py-24 text-center text-slate-400">
            <p className="text-lg mb-2">No posts yet.</p>
            <p className="text-sm">
              Run{" "}
              <code className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                npm run import
              </code>{" "}
              to import your Quarto posts.
            </p>
          </div>
        ) : (
          <BlogListing posts={posts} categories={categories} />
        )}
      </section>
    </div>
  );
}
