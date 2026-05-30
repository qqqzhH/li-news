/**
 * \u6728\u5b50\u65b0\u95fb - \u6bcf\u65e5\u65b0\u95fb\u91c7\u96c6\u811a\u672c
 * 
 * \u8fd0\u884c\u65b9\u5f0f: node scripts/fetch-news.js
 * \u5de5\u4f5c\u6d41\u7a0b:
 * 1. \u4ece AIHOT API \u83b7\u53d6 AI \u65b0\u95fb
 * 2. \u4ece Exa Search \u83b7\u53d6\u5730\u7f18\u653f\u6cbb\u548c\u91d1\u878d\u65b0\u95fb
 * 3. AI \u6574\u7406\u548c\u5206\u7c7b
 * 4. \u5199\u5165 news.json
 * 5. Git \u63d0\u4ea4 + \u63a8\u9001
 */

const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "src", "data", "news.json");
const EXA_API_KEY = process.env.EXA_API_KEY || "5b73f51e-accc-4879-bf2c-f33ef470f47f";

// ========== Fetch from AIHOT API ==========
async function fetchAIHOTNews() {
  console.log("[AIHOT] Fetching AI news...");
  const res = await fetch("https://aihot.virxact.com/api/public/daily", {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; LiNews/1.0)" },
  });
  if (!res.ok) throw new Error(`AIHOT API error: ${res.status}`);
  const data = await res.json();
  
  const items = [];
  for (const section of data.sections || []) {
    for (const item of section.items || []) {
      const summaryText = item.summary || item.title;
      const sectionName = section.name || "AI动态";
      items.push({
        id: `ai-${Date.now()}-${items.length}`,
        title: item.title,
        summary: summaryText,
        deepDive: `## 精简原文\n\n${summaryText}\n\n## AI解读\n\n本条新闻由木子新闻收录，来源：${item.sourceName || "AIHOT"}。\n\n栏目：${sectionName}。${item.sourceUrl ? `\n\n📎 原文链接：[查看详情](${item.sourceUrl})` : ""}`,
        category: "ai",
        source: item.sourceName || "AIHOT",
        sourceUrl: item.sourceUrl || "#",
          publishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          importance: "normal",
      });
    }
  }
  
  console.log(`[AIHOT] Got ${items.length} items`);
  return items;
}

// ========== Fetch from Exa Search ==========
async function searchExa(query, category, sourceLabel, days = 2) {
  console.log(`[Exa] Searching: ${query}`);
  try {
    const res = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": EXA_API_KEY,
      },
      body: JSON.stringify({
        query: query,
        type: "auto",
        numResults: 10,
        includeDomains: [],
        contents: {
          text: { maxLength: 500 }
        },
        startPublishedDate: getDaysAgo(days),
      }),
    });
    
    if (!res.ok) {
      console.log(`[Exa] Error ${res.status}, skipping...`);
      return [];
    }
    
    const data = await res.json();
    return (data.results || []).map((r, i) => ({
      id: `${category}-${Date.now()}-${i}`,
      title: r.title || "Untitled",
      summary: r.text ? r.text.slice(0, 300) : "No summary available",
      deepDive: `## 精简原文\n\n${r.text ? r.text.slice(0, 500) : `相关报道：${r.title || "暂无详细内容。"}\n\n💡 提示：点击下方"查看原文"获取完整内容。`}\n\n## AI解读\n\n本条新闻由木子新闻自动采集自 ${sourceLabel}，属于「${category}」类别。${r.url ? `\n\n📎 原始链接：[${r.title || "查看原文"}](${r.url})` : ""}`,
      category: category,
      source: sourceLabel,
      sourceUrl: r.url || "#",
          publishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          importance: "normal",
    }));
  } catch (err) {
    console.log(`[Exa] Error: ${err.message}`);
    return [];
  }
}

// ========== Browser-based news scraping ==========
async function scrapeNewsSource(url, category, label, selector) {
  console.log(`[Scrape] ${label}: ${url}`);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    });
    if (!res.ok) return [];
    const html = await res.text();
    
    // Simple extraction - look for headlines in common patterns
    const headlines = [];
    const titleRegex = /<h[2-3][^>]*>([^<]+)<\/h[2-3]>/g;
    let match;
    while ((match = titleRegex.exec(html)) !== null && headlines.length < 8) {
      const title = match[1].trim();
      if (title.length > 10 && title.length < 200) {
        headlines.push({
          id: `${category}-${Date.now()}-scrape-${headlines.length}`,
          title: title,
          summary: `From ${label}`,
          deepDive: `## 精简原文\n\n来自 ${label} 的新闻快讯。\n\n${title}\n\n## AI解读\n\n本条快讯采集自 ${label}。\n\n[查看原文](${url})`,
          category: category,
          source: label,
          sourceUrl: url,
          publishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          importance: "normal",
        });
      }
    }
    return headlines;
  } catch (err) {
    console.log(`[Scrape] Error: ${err.message}`);
    return [];
  }
}

// ========== Aggregate "other" news items - low value items ==========
function aggregateOthers(allItems) {
  // If an item doesn't have enough content, move to "other"
  return allItems.map(item => ({
    ...item,
    // Already categorized by source
  }));
}

// ========== Helpers ==========
function getDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

function deduplicate(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = item.title.slice(0, 50).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function addHotTags(items) {
  // Mark items with important keywords as "hot"
  const hotKeywords = ["release", "launch", "breakthrough", "crisis", "crash", "surge",
    "\u53d1\u5e03", "\u91cd\u5927", "\u7a81\u7834", "\u5371\u673a", "\u6c47\u7387", "\u767e\u4ebf"];
  return items.map((item) => {
    const text = (item.title + item.summary).toLowerCase();
    const isHot = hotKeywords.some((k) => text.includes(k.toLowerCase()));
    return { ...item, importance: isHot ? "hot" : "normal" };
  });
}

// ========== Main ==========
async function main() {
  console.log("=".repeat(50));
  console.log("\u6728\u5b50\u65b0\u95fb - News Fetcher");
  console.log(new Date().toLocaleString("zh-CN"));
  console.log("=".repeat(50));

  // 1. Load existing data to preserve history
  let existingItems = [];
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const existing = JSON.parse(raw);
    existingItems = existing.items || [];
    console.log(`Loaded ${existingItems.length} existing items`);
  } catch {
    console.log("No existing data, starting fresh");
  }

  // 2. Fetch AI news from AIHOT
  const aiItems = await fetchAIHOTNews();

  // 3. Fetch geopolitics news (中文搜索)
  const geoItems = await searchExa(
    "地缘政治 国际新闻 外交 冲突 最新动态 中国 美国 欧洲 中东",
    "geopolitics",
    "Exa 搜索"
  ).then(items => items.filter(i => /[\u4e00-\u9fff]/.test(i.title || i.summary)));

  // 4. Fetch finance news (中文搜索)
  const finItems = await searchExa(
    "金融市场 A股 美股 股票 经济 政策 利率 汇率 比特币 最新新闻",
    "finance",
    "Exa 搜索"
  ).then(items => items.filter(i => /[\u4e00-\u9fff]/.test(i.title || i.summary)));

  // 5. Fetch robotics news (7-day window - less frequent)
  const robItems = await searchExa(
    "机器人 人形机器人 人工智能 自动化 最新进展",
    "robotics",
    "Exa 搜索",
    7
  ).then(items => items.filter(i => /[\u4e00-\u9fff]/.test(i.title || i.summary)));

  // 5. Also scrape some Chinese news sites
  const [geoScrape, finScrape, robScrape] = await Promise.allSettled([
    scrapeNewsSource(
      "https://news.sina.com.cn/world/",
      "geopolitics",
      "新浪国际新闻"
    ),
    scrapeNewsSource(
      "https://finance.sina.com.cn/",
      "finance",
      "新浪财经"
    ),
    scrapeNewsSource(
      "https://www.leiphone.com/category/robot",
      "robotics",
      "雷锋网机器人"
    ),
  ]);
  const geoScrapeVal = geoScrape.status === "fulfilled" ? geoScrape.value : [];
  const finScrapeVal = finScrape.status === "fulfilled" ? finScrape.value : [];
  const robScrapeVal = robScrape.status === "fulfilled" ? robScrape.value : [];

  // 6. Combine all new items
  const allNewItems = [...aiItems, ...geoItems, ...finItems, ...robItems, ...geoScrapeVal, ...finScrapeVal, ...robScrapeVal];

  // 7. Deduplicate and tag
  const newItems = addHotTags(deduplicate(allNewItems));
  console.log(`New items: ${newItems.length}`);

  // 8. Merge with existing (keep 3 months of history)
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const cutoff = threeMonthsAgo.getTime();

  const merged = [...newItems, ...existingItems]
    .filter((item) => new Date(item.publishedAt).getTime() > cutoff)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  console.log(`Total items after merge + 3-month filter: ${merged.length}`);

  // 9. Write to file
  const output = {
    lastUpdated: new Date().toISOString(),
    items: merged,
  };

  fs.writeFileSync(DATA_PATH, JSON.stringify(output, null, 2), "utf-8");
  console.log(`Written to: ${DATA_PATH}`);

  // 10. Count by category
  const counts = {};
  merged.forEach((i) => {
    counts[i.category] = (counts[i.category] || 0) + 1;
  });
  console.log("Category counts:", counts);

  console.log("Done!");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
