import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllCategories } from "@/lib/posts";
import PostCard from "@/components/PostCard";

interface Params { name: string }

export function generateStaticParams() {
  return getAllCategories().map((cat) => ({ name: cat }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { name } = await params;
  const label = name.charAt(0).toUpperCase() + name.slice(1);
  return {
    title: label,
    description: `All posts tagged "${name}" — Krishnatheja Vanka`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { name } = await params;
  const all = getAllPosts();
  const posts = all.filter((p) => p.categories.includes(name));
  const label = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</Link>
        <span>/</span>
        <span className="text-slate-600 dark:text-slate-300">{label}</span>
      </nav>

      {/* Header */}
      <div className="mb-10 flex items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">{label}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {posts.length} {posts.length === 1 ? "article" : "articles"}
          </p>
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="text-slate-400 py-16 text-center">No posts in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <PostCard key={post.slugPath} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
