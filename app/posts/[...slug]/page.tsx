import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPost, getAllSlugs } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "@/components/CategoryBadge";
import TOC from "@/components/TOC";
import ReadingProgress from "@/components/ReadingProgress";
import MermaidRenderer from "@/components/MermaidRenderer";
import MathJaxRenderer from "@/components/MathJaxRenderer";
import CodeCopyButtons from "@/components/CodeCopyButtons";
import TabsetRenderer from "@/components/TabsetRenderer";

interface Params {
  slug: string[];
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description || undefined,
    authors: [{ name: post.author }],
  };
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <ReadingProgress />
      <CodeCopyButtons />
      <TabsetRenderer />
      {post.hasMermaid && <MermaidRenderer />}
      {post.hasMath && <MathJaxRenderer />}

      {/* TOC — fixed outside the container, visible only on 2xl+ where there is room */}
      {post.headings.length > 0 && (
        <aside className="hidden 2xl:block fixed top-24 left-0 max-h-[calc(100vh-6rem)] overflow-y-auto z-10 toc-sidebar">
          <TOC headings={post.headings} />
        </aside>
      )}

      {/* Metadata sidebar — right margin, visible only on 2xl+ */}
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
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Reading time</p>
            <p className="text-slate-700 dark:text-slate-300">{post.readingTime} min</p>
          </div>
          {post.categories.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Categories</p>
              <div className="flex flex-wrap gap-1.5">
                {post.categories.map((c) => (
                  <CategoryBadge key={c} category={c} />
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Post header */}
        <header className="mb-10">
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

        {/* Article — full container width, no flex sibling */}
        <article>
          <div
            className="post-content prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-code:before:content-none prose-code:after:content-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
          <a
            href="/"
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            All posts
          </a>
        </div>
      </div>
    </>
  );
}
