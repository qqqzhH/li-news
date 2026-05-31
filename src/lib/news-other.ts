// other category full data — do not edit manually
import { NewsItem } from "@/types";

const items: NewsItem[] = [
  {
    id: "test-1",
    title: "Test Item",
    summary: "抱歉，您提供的原文内容为“Test Item”和“Testing JSON validity”，并非一篇完整的新闻稿件。请提供完整的新闻原文，以便我为您撰写符合要求的精炼摘要。",
    deepDive: "This is a test with embedded quotes: \"hello\" and “world”",
    category: "other",
    source: "Test",
    sourceUrl: "#",
    publishedAt: "2026-05-29T04:06:58.439Z",
    updatedAt: "2026-05-29T04:06:58.439Z",
    importance: "normal"
  }
];

export function getOtherNews(): NewsItem[] {
  return items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
