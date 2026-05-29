// News data module - reads from JSON at build time
import { NewsData, NewsItem, Category } from "@/types";
import fs from "fs";
import path from "path";

function loadData(): NewsData {
  // During build (static generation), process.cwd() is the project root
  const jsonPath = path.join(process.cwd(), "src", "data", "news.json");
  try {
    const raw = fs.readFileSync(jsonPath, "utf-8");
    return JSON.parse(raw) as NewsData;
  } catch (e) {
    console.error("Failed to load news data:", jsonPath, e);
    return { lastUpdated: new Date().toISOString(), items: [] };
  }
}

const cachedData: NewsData = loadData();

export function getAllNews(): NewsData {
  return cachedData;
}

export function getNewsByCategory(category: Category): NewsItem[] {
  return cachedData.items
    .filter((item) => item.category === category)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getHotNews(): NewsItem[] {
  return cachedData.items
    .filter((item) => item.importance === "hot")
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function searchNews(query: string): NewsItem[] {
  const q = query.toLowerCase();
  return cachedData.items
    .filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.deepDive.toLowerCase().includes(q)
    )
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "刚刚";
  if (diffMins < 60) return `${diffMins} 分钟前`;
  if (diffHours < 24) return `${diffHours} 小时前`;
  if (diffDays < 7) return `${diffDays} 天前`;

  return date.toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}
