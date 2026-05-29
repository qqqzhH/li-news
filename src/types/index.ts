export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  deepDive: string;
  category: "ai" | "geopolitics" | "finance" | "other";
  source: string;
  sourceUrl: string;
  publishedAt: string;
  importance: "hot" | "normal";
}

export interface NewsData {
  lastUpdated: string;
  items: NewsItem[];
}

export type Category = NewsItem["category"];

export const CATEGORIES: { key: Category; label: string; icon: string }[] = [
  { key: "ai", label: "AI \u52a8\u6001", icon: "\ud83e\udd16" },
  { key: "geopolitics", label: "\u5730\u7f18\u653f\u6cbb", icon: "\ud83c\udf0d" },
  { key: "finance", label: "\u91d1\u878d\u5e02\u573a", icon: "\ud83d\udcb0" },
  { key: "other", label: "\u5176\u4ed6\u8981\u95fb", icon: "\ud83d\udce6" },
];

export const CATEGORY_LABEL: Record<Category, string> = {
  ai: "AI",
  geopolitics: "\u5730\u7f18\u653f\u6cbb",
  finance: "\u91d1\u878d\u5e02\u573a",
  other: "\u5176\u4ed6\u8981\u95fb",
};
