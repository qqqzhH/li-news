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

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "\u521a\u521a";
  if (diffMins < 60) return `${diffMins} \u5206\u949f\u524d`;
  if (diffHours < 24) return `${diffHours} \u5c0f\u65f6\u524d`;
  if (diffDays < 7) return `${diffDays} \u5929\u524d`;

  return date.toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}
