import fs from "fs";
import path from "path";
import type { PostMeta, Post } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content/posts");

let _posts: PostMeta[] | null = null;

export function getAllPosts(): PostMeta[] {
  if (_posts) return _posts;
  const raw = fs.readFileSync(path.join(CONTENT_DIR, "_index.json"), "utf-8");
  _posts = JSON.parse(raw) as PostMeta[];
  return _posts;
}

export function getAllCategories(): string[] {
  const set = new Set<string>();
  getAllPosts().forEach((p) => p.categories.forEach((c) => set.add(c)));
  return Array.from(set).sort();
}

export function getAllSlugs(): string[][] {
  return getAllPosts().map((p) => p.slug);
}

export function getPost(slug: string[]): Post | null {
  const file = slug.join("__") + ".json";
  try {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    return JSON.parse(raw) as Post;
  } catch {
    return null;
  }
}

export function getRelatedPosts(slugPath: string, limit = 3): PostMeta[] {
  const posts = getAllPosts();
  const current = posts.find((p) => p.slugPath === slugPath);
  if (!current) return [];
  const currentCats = new Set(current.categories);
  return posts
    .filter((p) => p.slugPath !== slugPath && p.categories.some((c) => currentCats.has(c)))
    .slice(0, limit);
}

export function getAdjacentPosts(slugPath: string): {
  prev: PostMeta | null;
  next: PostMeta | null;
} {
  const posts = getAllPosts();
  const idx = posts.findIndex((p) => p.slugPath === slugPath);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? posts[idx - 1] : null,
    next: idx < posts.length - 1 ? posts[idx + 1] : null,
  };
}
