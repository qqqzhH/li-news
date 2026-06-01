/**
 * 批量从 Exa API 查询缺失日期的文章
 */
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'news.json');
const EXA_API_KEY = '5b73f51e-accc-4879-bf2c-f33ef470f47f';

const raw = fs.readFileSync(DATA_PATH, 'utf-8');
const data = JSON.parse(raw);

// 找出 publishedAt == updatedAt 的文章
const itemsToFix = data.items.filter(i => {
  const pa = new Date(i.publishedAt).getTime();
  const ua = new Date(i.updatedAt).getTime();
  return Math.abs(pa - ua) < 1000;
});

console.log(`需要查询的文章: ${itemsToFix.length}`);

async function queryExa(title, url) {
  try {
    const res = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": EXA_API_KEY,
      },
      body: JSON.stringify({
        query: title,
        type: "auto",
        numResults: 3,
        contents: { text: { maxLength: 10 } },
      }),
    });
    if (!res.ok) return null;
    const d = await res.json();
    // 找 URL 匹配的结果
    for (const r of (d.results || [])) {
      if (r.url === url && r.publishedDate) {
        return r.publishedDate;
      }
    }
    // 找第一个有 publishedDate 的
    for (const r of (d.results || [])) {
      if (r.publishedDate) {
        return r.publishedDate;
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function main() {
  let fixed = 0;
  const batchSize = 5;
  
  for (let i = 0; i < itemsToFix.length; i += batchSize) {
    const batch = itemsToFix.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(item => queryExa(item.title, item.sourceUrl))
    );
    
    batch.forEach((item, idx) => {
      if (results[idx]) {
        item.publishedAt = results[idx];
        fixed++;
      }
    });
    
    console.log(`Progress: ${Math.min(i + batchSize, itemsToFix.length)}/${itemsToFix.length}, Fixed so far: ${fixed}`);
    
    // Rate limit: 500ms between batches
    if (i + batchSize < itemsToFix.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  
  console.log(`\nTotal fixed: ${fixed}/${itemsToFix.length}`);
  
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
  console.log('Written to', DATA_PATH);
}

main().catch(console.error);
