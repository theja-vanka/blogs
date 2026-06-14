import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getPost, getAllSlugs, getRelatedPosts, getAdjacentPosts } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "@/components/CategoryBadge";
import TOC from "@/components/TOC";
import MobileTOC from "@/components/MobileTOC";
import ReadingProgress from "@/components/ReadingProgress";
import MermaidRenderer from "@/components/MermaidRenderer";
import MathJaxRenderer from "@/components/MathJaxRenderer";
import CodeCopyButtons from "@/components/CodeCopyButtons";
import TabsetRenderer from "@/components/TabsetRenderer";
import ShareButtons from "@/components/ShareButtons";
import BackToTop from "@/components/BackToTop";
import ImageLightbox from "@/components/ImageLightbox";
import HeadingAnchors from "@/components/HeadingAnchors";
import ReadingModeToggle from "@/components/ReadingModeToggle";
import SeriesBanner from "@/components/SeriesBanner";
import PostKeyboardNav from "@/components/PostKeyboardNav";
import { getSeriesForPost } from "@/lib/series";

interface Params { slug: string[] }

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const siteUrl = `https://theja-vanka.github.io${basePath}`;
  const postUrl = `${siteUrl}/posts/${post.slugPath}/`;
  const ogImage = post.coverImage
    ? `https://theja-vanka.github.io${post.coverImage}`
    : `${siteUrl}/profile.jpg`;

  return {
    title: post.title,
    description: post.description || undefined,
    authors: [{ name: post.author }],
    keywords: post.categories.length > 0 ? post.categories : undefined,
    alternates: { canonical: postUrl },
    openGraph: {
      title: post.title,
      description: post.description || undefined,
      type: "article",
      url: postUrl,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description || undefined,
      images: [ogImage],
    },
  };
}

function absolutifyImages(content: string, basePath: string, slugPath: string): string {
  return content.replace(
    /(<img[^>]*\ssrc=")(?!https?:|\/|data:)([^"]+)"/g,
    `$1${basePath}/posts/${slugPath}/$2"`
  );
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const siteUrl = `https://theja-vanka.github.io${basePath}`;
  const postUrl = `${siteUrl}/posts/${post.slugPath}/`;
  const content = absolutifyImages(post.content, basePath, post.slugPath);

  const related = getRelatedPosts(post.slugPath);
  const { prev, next } = getAdjacentPosts(post.slugPath);
  const seriesCtx = getSeriesForPost(post.slugPath);

  const ogImage = post.coverImage
    ? `https://theja-vanka.github.io${post.coverImage}`
    : `${siteUrl}/profile.jpg`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description || undefined,
    url: postUrl,
    datePublished: post.date,
    image: ogImage,
    author: {
      "@type": "Person",
      name: post.author,
      url: siteUrl,
      sameAs: [
        "https://github.com/theja-vanka",
        "https://www.linkedin.com/in/krishnatheja-vanka/",
      ],
    },
    publisher: { "@type": "Person", name: post.author, url: siteUrl },
    keywords: post.categories.join(", ") || undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ReadingProgress readingTime={post.readingTime} />
      <PostKeyboardNav prevSlug={prev?.slugPath} nextSlug={next?.slugPath} />
      <CodeCopyButtons />
      <HeadingAnchors />
      <TabsetRenderer />
      <BackToTop />
      <ImageLightbox />
      <ReadingModeToggle />
      {post.hasMermaid && <MermaidRenderer />}
      {post.hasMath && <MathJaxRenderer />}

      {/* Desktop TOC — left sidebar, 2xl+ only */}
      {post.headings.length > 0 && (
        <aside className="hidden 2xl:block fixed top-24 left-0 max-h-[calc(100vh-6rem)] overflow-y-auto z-10 toc-sidebar">
          <TOC headings={post.headings} />
        </aside>
      )}

      {/* Metadata sidebar — right, 2xl+ only */}
      <aside className="hidden 2xl:block fixed top-24 right-0 max-h-[calc(100vh-6rem)] overflow-y-auto z-10 meta-sidebar">
        <div className="space-y-5 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Author</p>
            <p className="text-slate-700 dark:text-slate-300">{post.author}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Published</p>
            <p className="text-slate-700 dark:text-slate-300">{formatDate(post.date)}</p>
          </div>
          {post.categories.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Categories</p>
              <div className="flex flex-wrap gap-1.5">
                {post.categories.map((c) => (
                  <CategoryBadge key={c} category={c} href={`/?category=${encodeURIComponent(c)}`} />
                ))}
              </div>
            </div>
          )}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Share</p>
            <ShareButtons title={post.title} url={postUrl} />
          </div>
        </div>
      </aside>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">

        {/* Post header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-4">
            {post.title}
          </h1>

          {post.description && (
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              {post.description}
            </p>
          )}

          <div className="flex items-center gap-3 text-sm text-slate-400 dark:text-slate-500">
            <span>{post.author}</span>
            <span>·</span>
            <span>{formatDate(post.date)}</span>
            <span>·</span>
            <span>{post.readingTime} min read</span>
          </div>
        </header>

        {/* Series banner */}
        {seriesCtx && <SeriesBanner ctx={seriesCtx} />}

        {/* Mobile TOC */}
        {post.headings.length > 0 && <MobileTOC headings={post.headings} />}

        {/* Article */}
        <article>
          <div
            className="post-content prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-code:before:content-none prose-code:after:content-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </article>

        {/* Back link + share */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            All posts
          </Link>
          <ShareButtons title={post.title} url={postUrl} />
        </div>

        {/* Subscribe CTA */}
        <div className="mt-10 rounded-xl border border-orange-200/70 dark:border-orange-800/40 bg-orange-50/50 dark:bg-orange-950/20 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-0.5">Enjoyed this article?</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Subscribe via RSS to get every new post delivered straight to your reader.</p>
          </div>
          <a
            href={`${basePath}/feed.xml`}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-orange-300 dark:border-orange-700 bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/>
            </svg>
            Subscribe via RSS
          </a>
        </div>

        {/* Author card */}
        <div className="mt-8 flex items-start gap-4 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
          <Image
            src={`${basePath}/profile.jpg`}
            alt="Krishnatheja Vanka"
            width={56}
            height={56}
            className="rounded-full ring-2 ring-white dark:ring-slate-800 shadow-md shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Krishnatheja Vanka</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Applied Scientist · Machine Learning Engineer</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              Working at the intersection of ML research and production — training models, building systems, and writing practical guides on applied ML.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com/theja-vanka" target="_blank" rel="noreferrer" className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors inline-flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"/>
                </svg>
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/krishnatheja-vanka/" target="_blank" rel="noreferrer" className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        </div>{/* end max-w-3xl reading zone */}

        {/* Prev / Next navigation */}
        {(prev || next) && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prev ? (
              <Link
                href={`/posts/${prev.slugPath}/`}
                className="group flex flex-col gap-1 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all"
              >
                <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  Newer
                </span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">{prev.title}</span>
              </Link>
            ) : <div />}

            {next ? (
              <Link
                href={`/posts/${next.slugPath}/`}
                className="group flex flex-col gap-1 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all sm:text-right"
              >
                <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 sm:justify-end">
                  Older
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">{next.title}</span>
              </Link>
            ) : <div />}
          </div>
        )}

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 shrink-0">Related posts</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-200 via-slate-200/50 to-transparent dark:from-slate-700 dark:via-slate-700/50" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slugPath}
                  href={`/posts/${r.slugPath}/`}
                  className="group flex flex-col gap-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all"
                >
                  {r.coverImage && (
                    <div className="relative h-28 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 mb-1">
                      <Image src={r.coverImage} alt={r.title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                    {r.title}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mt-auto">
                    <span>{formatDate(r.date)}</span>
                    <span>·</span>
                    <span>{r.readingTime} min</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
