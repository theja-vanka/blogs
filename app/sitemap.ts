import type { MetadataRoute } from "next";
import { getAllPosts, getAllCategories } from "@/lib/posts";
import { getAllSeries } from "@/lib/series";

export const dynamic = "force-static";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  `https://theja-vanka.github.io${process.env.NEXT_PUBLIC_BASE_PATH || ""}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const series = getAllSeries();

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

  const seriesDetailEntries: MetadataRoute.Sitemap = series.map((s) => ({
    url: `${SITE_URL}/series/${s.id}/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/category/${encodeURIComponent(cat)}/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    { url: `${SITE_URL}/`,        lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/series/`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/about/`,  lastModified: new Date(), changeFrequency: "yearly",  priority: 0.5 },
    ...seriesDetailEntries,
    ...categoryEntries,
    ...postEntries,
  ];
}
