import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { getAllPosts } from "@/lib/posts";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  `https://theja-vanka.github.io${process.env.NEXT_PUBLIC_BASE_PATH || ""}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => {
    const isRecent = post.date && new Date(post.date).getTime() > thirtyDaysAgo;
    return {
      url: `${SITE_URL}/posts/${post.slugPath}/`,
      lastModified: post.date ? new Date(post.date) : new Date(),
      changeFrequency: isRecent ? "weekly" : "monthly",
      priority: isRecent ? 0.9 : 0.8,
    };
  });

  return [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...postEntries,
  ];
}
