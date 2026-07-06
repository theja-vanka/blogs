import fs from "fs";
import path from "path";
import { getAllPosts } from "./posts";

interface Series {
  id: string;
  title: string;
  description?: string;
  posts: string[];
}

export interface PostSeriesContext {
  series: Series;
  partIndex: number;
  totalParts: number;
  titles: Record<string, string>;
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

export function getSeriesForPost(slugPath: string): PostSeriesContext | null {
  const series = getSeries();
  const found = series.find((s) => s.posts.includes(slugPath));
  if (!found) return null;

  const partIndex = found.posts.indexOf(slugPath);
  const postMap = Object.fromEntries(getAllPosts().map((p) => [p.slugPath, p.title]));
  const titles: Record<string, string> = {};
  found.posts.forEach((sp) => {
    titles[sp] = postMap[sp] ?? sp;
  });

  return {
    series: found,
    partIndex,
    totalParts: found.posts.length,
    titles,
  };
}
