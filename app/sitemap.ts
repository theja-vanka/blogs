import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { getAllPosts } from "@/lib/posts";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  `https://theja-vanka.github.io${process.env.NEXT_PUBLIC_BASE_PATH || ""}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/posts/${post.slugPath}/`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...postEntries,
  ];
}
