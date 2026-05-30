/**
 * 将 news.json 同步到 news.ts（内联数据）
 * 用法: node scripts/sync-news.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, '..', 'src', 'data', 'news.json');
const tsPath = path.join(__dirname, '..', 'src', 'lib', 'news.ts');

const raw = fs.readFileSync(jsonPath, 'utf-8');
const data = JSON.parse(raw);

// 生成内联数据字符串
function itemsToJS(items) {
  return items.map((item, i) => `  {
    id: "${item.id}",
    title: ${JSON.stringify(item.title)},
    summary: ${JSON.stringify(item.summary)},
    deepDive: ${JSON.stringify(item.deepDive)},
    category: "${item.category}",
    source: ${JSON.stringify(item.source)},
    sourceUrl: ${JSON.stringify(item.sourceUrl)},
    publishedAt: "${item.publishedAt}",
    importance: "${item.importance}",
  }`).join(',\n');
}

const itemsCode = itemsToJS(data.items);

const tsContent = `// News data module - embedded inline (works in Vercel build)
// Auto-generated from news.json — do not edit manually
import { NewsData, NewsItem, Category } from "@/types";

const hardcodedData: NewsData = {
  lastUpdated: "${data.lastUpdated}",
  items: [
${itemsCode}
  ],
};

export function getAllNews(): NewsData {
  return hardcodedData;
}

export function getNewsByCategory(category: Category): NewsItem[] {
  return hardcodedData.items
    .filter((item) => item.category === category)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getHotNews(): NewsItem[] {
  return hardcodedData.items
    .filter((item) => item.importance === "hot")
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function searchNews(query: string): NewsItem[] {
  const q = query.toLowerCase();
  return hardcodedData.items
    .filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.deepDive.toLowerCase().includes(q)
    )
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
`;

fs.writeFileSync(tsPath, tsContent, 'utf-8');
console.log(`Synced ${data.items.length} items from news.json → news.ts`);
console.log('Last updated:', data.lastUpdated);
