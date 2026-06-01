/**
 * 修复 AIHOT 文章：从 Exa 查询每篇文章的真实发布时间
 */
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'news.json');
const EXA_API_KEY = '5b73f51e-accc-4879-bf2c-f33ef470f47f';

const raw = fs.readFileSync(DATA_PATH, 'utf-8');
const data = JSON.parse(raw);

// 找出所有 AIHOT 来源的文章（source 包含 X：或 RSS）
const aihotItems = data.items.filter(i => 
  i.source?.startsWith('X：') || 
  i.source?.includes('RSS') || 
  i.source?.includes('Hacker News')
);

// 去掉重复 URL
const uniqueUrls = [...new Set(aihotItems.map(i => i.sourceUrl))];
console.log(`AIHOT 文章: ${aihotItems.length} 篇, 去重URL: ${uniqueUrls.length} 个`);

// 从 Twitter/X URL 解码 snowflake ID 获取时间
function getTweetTime(url) {
  const m = url.match(/\/status\/(\d+)/);
  if (!m) return null;
  const snowflakeId = BigInt(m[1]);
  // Twitter epoch: 1288834974657ms (2010-11-04)
  const timestamp = Number((snowflakeId >> 22n) + 1288834974657n);
  return new Date(timestamp).toISOString();
}

async function queryExa(title) {
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
        numResults: 2,
        contents: { text: { maxLength: 10 } },
      }),
    });
    if (!res.ok) return null;
    const d = await res.json();
    for (const r of (d.results || [])) {
      if (r.publishedDate) return r.publishedDate;
    }
    return null;
  } catch {
    return null;
  }
}

async function main() {
  let fixed = 0;
  
  for (const item of aihotItems) {
    // 1. 先尝试从 Twitter snowflake ID 获取时间
    const tweetTime = getTweetTime(item.sourceUrl);
    if (tweetTime) {
      item.publishedAt = tweetTime;
      fixed++;
      continue;
    }
    
    // 2. 否则查 Exa API
    const exaDate = await queryExa(item.title);
    if (exaDate) {
      item.publishedAt = exaDate;
      fixed++;
    }
    
    await new Promise(r => setTimeout(r, 300));
  }
  
  console.log(`Fixed: ${fixed}/${aihotItems.length}`);
  
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
  console.log('Written to', DATA_PATH);
}

main().catch(console.error);
