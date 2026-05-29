// Server-only news data module (uses fs)
import { NewsData, NewsItem, Category } from "@/types";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/news.json");

export function getAllNews(): NewsData {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw) as NewsData;
  } catch {
    return { lastUpdated: new Date().toISOString(), items: [] };
  }
}

export function getNewsByCategory(category: Category): NewsItem[] {
  const data = getAllNews();
  return data.items
    .filter((item) => item.category === category)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getHotNews(): NewsItem[] {
  const data = getAllNews();
  return data.items
    .filter((item) => item.importance === "hot")
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function searchNews(query: string): NewsItem[] {
  const data = getAllNews();
  const q = query.toLowerCase();
  return data.items
    .filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.deepDive.toLowerCase().includes(q)
    )
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getAllCategories(): { category: Category; count: number }[] {
  const data = getAllNews();
  const counts: Record<string, number> = {};
  data.items.forEach((item) => {
    counts[item.category] = (counts[item.category] || 0) + 1;
  });
  return (Object.keys(counts) as Category[]).map((key) => ({
    category: key,
    count: counts[key],
  }));
}
