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
        deepDive: `## AI 解读\n\n${item.sourceName || "AIHOT"}\n\n## 原文\n\n${summaryText.slice(0, 200)}`,
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
      deepDive: `## AI 解读\n\n${sourceLabel}\n\n## 原文\n\n${r.text ? r.text.slice(0, 400).replace(/登录|注册|关闭|广告|分享|微信|扫码|客户端|快速导航|安全退出|邮箱/gi, '').trim() : r.title || "暂无详细内容"}`,
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
          deepDive: `## AI 解读\n\n${label}\n\n## 原文\n\n来自 ${label} 的新闻：${title}`,
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

  // 8. 合并前先去重（保留新版本，丢弃旧版本相同标题）
  const allTitles = new Set(newItems.map(i => i.title.slice(0, 50).toLowerCase()));
  const filteredExisting = existingItems.filter(i => !allTitles.has(i.title.slice(0, 50).toLowerCase()));

  // 9. 生成 AI 解读
  if (process.env.DEEPSEEK_API_KEY) {
    // 9a. 为新文章生成 AI 解读
    const itemsToAnalyze = [];
    for (const item of newItems) {
      if (!item.deepDive?.includes('## AI 解读')) continue;
      // 检查 AI 解读是否为模板（内容很短即为模板）
      const aiIdx = item.deepDive.indexOf('## AI 解读');
      const after = item.deepDive.slice(aiIdx + 10).trim();
      const isTemplate = after.includes('\n## 原文') && after.indexOf('\n##') < 80;
      if (isTemplate) itemsToAnalyze.push(item);
    }
    // 9b. 旧文章中还没有 AI 解读的也补上
    for (const item of filteredExisting) {
      if (itemsToAnalyze.length >= 50) break;
      // 已经有 AI 分析的跳过（AI分析通常有几百字）
      if (item.deepDive?.includes('## AI 解读')) {
        const aiIdx = item.deepDive.indexOf('## AI 解读');
        const after = item.deepDive.slice(aiIdx + 10).trim();
        const hasAnalysis = after.length > 100 && after.includes('\n## 原文');
        if (hasAnalysis) continue;
      }
      itemsToAnalyze.push(item);
    }
    console.log(`\n[AI] 需要生成 AI 解读: ${itemsToAnalyze.length} 条`);
    for (let i = 0; i < itemsToAnalyze.length; i++) {
      const item = itemsToAnalyze[i];
      console.log(`[AI] (${i+1}/${itemsToAnalyze.length}) 正在分析: ${item.title.slice(0,40)}`);
      const sourceText = item.summary || item.title;
      const prompt = `请为以下新闻写一段深度分析解读（200-400字中文），包含：1. 核心要点提炼 2. 影响分析。格式要简洁有力，像专业分析师的口吻。\n\n标题：${item.title}\n内容：${sourceText}\n类别：${item.category}`;
      try {
        const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}` },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              { role: "system", content: "你是木子新闻的AI分析师，用专业、简洁的中文分析新闻。" },
              { role: "user", content: prompt }
            ],
            max_tokens: 800, temperature: 0.7,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const analysis = data.choices?.[0]?.message?.content || "";
          if (analysis) {
            item.deepDive = `## AI 解读\n\n${analysis}\n\n## 原文\n\n${(item.summary || item.title).slice(0, 200)}`;
            console.log(`[AI] ✅ 分析完成: ${item.title.slice(0,30)} (${analysis.length}字)`);
          } else {
            console.log(`[AI] ⚠️ 空返回: ${item.title.slice(0,30)}`);
          }
        } else {
          console.log(`[AI] ❌ API错误: ${item.title.slice(0,30)} ${res.status}`);
        }
        await new Promise(r => setTimeout(r, 500));
      } catch (err) {
        console.log(`[AI] 生成失败: ${err.message}`);
      }
      if ((i + 1) % 5 === 0) console.log(`[AI] 已处理 ${i+1}/${itemsToAnalyze.length}`);
    }
    console.log(`[AI] AI 解读生成完成`);
  }

  // 10. Merge with existing (keep 3 months of history)
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const cutoff = threeMonthsAgo.getTime();

  const merged = [...newItems, ...filteredExisting]
    .filter((item) => new Date(item.publishedAt).getTime() > cutoff)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // 验证 AI 解读
  const aiCheck = merged.filter(i => i.deepDive?.includes('## AI 解读') && !i.deepDive.includes('本条新闻由木子新闻收录'));
  console.log(`[验证] 合并后共 ${merged.length} 条，其中 ${aiCheck.length} 条含 AI 分析`);

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
