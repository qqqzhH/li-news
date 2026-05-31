/**
 * 将 news.json 同步到按分类拆分的 news-*.ts 文件
 * 解决 Cloudflare Worker 461KB 撑爆问题
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, '..', 'src', 'data', 'news.json');
const libDir = path.join(__dirname, '..', 'src', 'lib');

const raw = fs.readFileSync(jsonPath, 'utf-8');
const data = JSON.parse(raw);

// Ultra-lightweight item for homepage lists only
function lightItem(item) {
  return {
    id: item.id,
    title: item.title,
    summary: (item.summary || "").slice(0, 80),
    deepDive: "",
    category: item.category,
    source: item.source || "",
    sourceUrl: item.sourceUrl || "",
    publishedAt: item.publishedAt,
    updatedAt: item.updatedAt,
    importance: item.importance,
  };
}

function itemsToJS(items, full = false) {
  return items.map((item) => {
    const obj = full ? item : lightItem(item);
    const fields = [
      `id: ${JSON.stringify(obj.id)}`,
      `title: ${JSON.stringify(obj.title)}`,
      `summary: ${JSON.stringify(obj.summary || "")}`,
      `deepDive: ${JSON.stringify(obj.deepDive || "")}`,
      `category: ${JSON.stringify(obj.category)}`,
      `source: ${JSON.stringify(obj.source)}`,
      `sourceUrl: ${JSON.stringify(obj.sourceUrl)}`,
      `publishedAt: ${JSON.stringify(obj.publishedAt)}`,
      `updatedAt: ${JSON.stringify(obj.updatedAt)}`,
      `importance: ${JSON.stringify(obj.importance)}`,
    ].filter(Boolean);
    return `  {\n    ${fields.join(',\n    ')}\n  }`;
  }).join(',\n');
}

const categories = ['ai', 'robotics', 'geopolitics', 'finance', 'other'];

// 1. Generate lightweight news.ts for homepage
const lightItems = itemsToJS(data.items, false);
const mainTs = `// Lightweight news data for homepage — do not edit manually
import { NewsData, NewsItem, Category } from "@/types";

const hardcodedData: NewsData = {
  lastUpdated: ${JSON.stringify(data.lastUpdated)},
  items: [
${lightItems}
  ],
};

export function getAllNews(): NewsData { return hardcodedData; }
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
    .filter((item) =>
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q)
    )
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
`;
fs.writeFileSync(path.join(libDir, 'news.ts'), mainTs, 'utf-8');

// 2. Generate per-category full-data files
for (const cat of categories) {
  const catItems = data.items.filter(i => i.category === cat);
  const itemsCode = itemsToJS(catItems, true);
  
  // Get first item's fields for type reference
  const ts = `// ${cat} category full data — do not edit manually
import { NewsItem } from "@/types";

const items: NewsItem[] = [
${itemsCode}
];

export function get${cat.charAt(0).toUpperCase() + cat.slice(1)}News(): NewsItem[] {
  return items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
`;
  fs.writeFileSync(path.join(libDir, `news-${cat}.ts`), ts, 'utf-8');
  const stats = fs.statSync(path.join(libDir, `news-${cat}.ts`));
  console.log(`  news-${cat}.ts: ${catItems.length} items, ${(stats.size/1024).toFixed(0)}KB`);
}

const mainStats = fs.statSync(path.join(libDir, 'news.ts'));
console.log(`  news.ts (light): ${data.items.length} items, ${(mainStats.size/1024).toFixed(0)}KB`);
console.log(`\nSynced ${data.items.length} items → split files`);
