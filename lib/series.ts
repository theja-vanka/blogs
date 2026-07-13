import fs from "fs";
import path from "path";
import { getAllPosts } from "./posts";

export interface Series {
  id: string;
  title: string;
  description?: string;
  posts: string[];
  coverImage?: string;
}

export interface PostSeriesContext {
  series: Series;
  partIndex: number;
  totalParts: number;
  titles: Record<string, string>;
  descriptions: Record<string, string>;
  readingTimes: Record<string, number>;
}

const SERIES_FILE = path.join(process.cwd(), "content/series.json");

let _series: Series[] | null = null;

function getSeries(): Series[] {
  if (_series) return _series;
  try {
    const raw = fs.readFileSync(SERIES_FILE, "utf-8");
    _series = JSON.parse(raw) as Series[];
  } catch {
    _series = [];
  }
  return _series;
}

export function getAllSeries(): Series[] {
  return getSeries();
}

export function getSeriesForPost(slugPath: string): PostSeriesContext | null {
  const series = getSeries();
  const found = series.find((s) => s.posts.includes(slugPath));
  if (!found) return null;

  const partIndex = found.posts.indexOf(slugPath);
  const allPosts = getAllPosts();
  const postMap = Object.fromEntries(allPosts.map((p) => [p.slugPath, p]));

  const titles: Record<string, string> = {};
  const descriptions: Record<string, string> = {};
  const readingTimes: Record<string, number> = {};

  found.posts.forEach((sp) => {
    const p = postMap[sp];
    titles[sp] = p?.title ?? sp;
    descriptions[sp] = p?.description ?? "";
    readingTimes[sp] = p?.readingTime ?? 0;
  });

  return {
    series: found,
    partIndex,
    totalParts: found.posts.length,
    titles,
    descriptions,
    readingTimes,
  };
}
