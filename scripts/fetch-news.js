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
const { summarize } = require("./summarize");

const DATA_PATH = path.join(__dirname, "..", "src", "data", "news.json");
const EXA_API_KEY = process.env.EXA_API_KEY || "5b73f51e-accc-4879-bf2c-f33ef470f47f";

// 从 Twitter/X snowflake ID 提取发布时间
function getTweetTime(url) {
  const m = url?.match(/\/status\/(\d+)/);
  if (!m) return null;
  const snowflakeId = BigInt(m[1]);
  const timestamp = Number((snowflakeId >> 22n) + 1288834974657n);
  return new Date(timestamp).toISOString();
}

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
      // 优先从 Twitter snowflake ID 提取时间，否则用 windowStart
      const tweetTime = getTweetTime(item.sourceUrl);
      const publishTime = tweetTime || data.windowStart || `${data.date}T08:00:00.000Z`;
      items.push({
        id: `ai-${Date.now()}-${items.length}`,
        title: item.title,
        summary: smartTruncate(cleanText(summaryText), 2000),
        deepDive: `## AI 解读\n\n${item.sourceName || "AIHOT"}`,
        category: "ai",
        source: item.sourceName || "AIHOT",
        sourceUrl: item.sourceUrl || "#",
          publishedAt: publishTime,
          updatedAt: new Date().toISOString(),
          importance: "normal",
      });
    }
  }
  
  console.log(`[AIHOT] Got ${items.length} items`);
  return items;
}

// ========== Fetch from Exa Search ==========
// 从 URL 中提取日期
function extractDateFromUrl(url) {
  if (!url) return null;
  // /2025-05-13/ or 2025-05-13T
  let m = url.match(/\/(\d{4})-(\d{2})-(\d{2})[\/T\s]/);
  if (m) return new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00.000Z`).toISOString();
  // /20250513 (QQ News, Sina)
  m = url.match(/\/(\d{4})(\d{2})(\d{2})(?=[^0-9]|$)/);
  if (m) return new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00.000Z`).toISOString();
  return null;
}

// 检测繁体中文
function isTraditional(text) {
  // 繁体特有的常用字
  const tradChars = '戰東會關國際邊飛發雲臺稱圍從業與當畫時經門開後機來過對頭點將簡稱無應這個進見只萬數匯盡麵確龍雙歸歷樂書廣寫義貨賣讀聽輕轉輪連選遠還隨爾語際風飯飲飽養驚讓護顧爾區曆準麼裏麵爲當檔鏈儘匯瀏擊導猶薩雙餘監領標協選錄優購餘積護環優擠響鍾驅繞';
  let count = 0;
  for (const ch of text) {
    if (tradChars.includes(ch)) count++;
    if (count >= 3) return true;
  }
  return false;
}

// 智能截断：在句子边界切断，不腰斩
function smartTruncate(text, maxLen) {
  if (!text || text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  // 从后往前找最近的句号、问号、感叹号
  const lastPeriod = Math.max(
    cut.lastIndexOf("。"),
    cut.lastIndexOf("！"),
    cut.lastIndexOf("？"),
    cut.lastIndexOf("\n")
  );
  if (lastPeriod > maxLen * 0.35) {
    return cut.slice(0, lastPeriod + 1).trim();
  }
  // 没有合适断点，找最后一个空格或逗号
  const lastBreak = Math.max(cut.lastIndexOf("，"), cut.lastIndexOf(" "), cut.lastIndexOf("\n"));
  if (lastBreak > maxLen * 0.5) {
    return cut.slice(0, lastBreak).trim() + "…";
  }
  return cut.trim() + "…";
}

function cleanText(text) {
  if (!text) return "";
  
  // 1. 切行，逐行清洗
  let lines = text.split("\n");
  
  // 2. 删除明显的导航/广告/元数据行
  const noisePatterns = [
    /^登录$/, /^注册$/, /^搜索$/, /^关闭$/, /^广告$/,
    /^媒体品牌$/, /^企业服务$/, /^政府服务$/, /^投资人服务$/,
    /^创业者服务$/, /^创投平台$/, /^AI测评网$/, /^我要入驻$/,
    /^快速导航$/, /^安全退出$/, /^邮箱$/,
    /^移动客户端$/, /^客户端$/,
    /^分享至$/, /^微信$/, /^扫码$/, /^用微信扫码/, /^微信扫一扫$/,
    /^手机/, /^掌上/, /^APP/, /^扫码下载/,
    /^服务时间/, /^资讯公告/,
    /^今日有色$/,
    /^全球数字财富/,
    /^字体：/, /^分享到：/,
    /^\d{4}\s+\d{2}\/\d{2}\s+\d{2}:\d{2}/,  // "2026 05/30 11:56:13"
    /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/,     // "2026-05-30 11:56:13"
    /^来源[：:]\s*\S/,                         // "来源：新华网"
    /^[>\s]*(正文|资讯)[>\s]*$/,                // "正文" "> 正文"
    /^[>\s]*\S+[>\s]+正文/,                     // "新华网> > 正文"
    /FX168|英为财情|新浪|网易|腾讯|搜狐/,
    /^免责声明/, /^版权/, /^请联系/, /^转载/, /^投稿/,
    /^业务合作/, /^滚动新闻/, /^推荐阅读/, /^相关新闻/, /^热点新闻/,
    /^文章$/, /^来源$/, /^作者$/,
    /^#\d+$/,  // "#1" style markers
  ];
  
  lines = lines.filter(line => {
    const trimmed = line.trim();
    if (!trimmed) return true; // keep empty lines for structure
    for (const p of noisePatterns) {
      if (p.test(trimmed)) return false;
    }
    return true;
  });
  
  // 3. 找 # 标题行——从这里开始才是正文
  let contentStart = 0;
  for (let i = 0; i < lines.length; i++) {
    if (/^#\s/.test(lines[i].trim())) {
      contentStart = i + 1; // 从标题下一行开始
      break;
    }
  }
  
  // 4. 提取正文：跳过开头的空行，取实质性内容
  let content = lines.slice(contentStart).join("\n");
  
  // 5. 去重重标题（第二行常常是重复的标题文本）
  content = content.replace(/^.{10,80}\n\1/, '');  // 连续两行相同=重复标题
  
  // 6. 压缩多余空行
  content = content.replace(/\n{3,}/g, '\n\n').trim();
  
  // 7. 删新闻电头：新华社xx月xx日电（记者xxx）、据xxx报道
  content = content.replace(/^(新华社|中新社|央视|人民日报).*?电[（(][^)）]*[)）]/g, '');
  content = content.replace(/^据\S{2,8}报道[：:]?\s*/g, '');
  content = content.replace(/^\S{2,8}讯\s*/g, '');
  content = content.trim();
  
  // 8. 删开头残留的记者署名、来源标注
  content = content.replace(/^[（(]记者[^)）]+[)）]\s*/g, '');
  
  // 9. 如果清洗后太短，回退用原标题
  if (content.length < 30) {
    content = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
    content = content.replace(/^.*?[#]\s*/, '').trim();
  }
  
  return content;
}

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
          text: { maxLength: 3000 }
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
      summary: r.text ? smartTruncate(cleanText(r.text), 2000) : (r.title || "No summary available"),
      deepDive: `## AI 解读\n\n${sourceLabel}`,
      category: category,
      source: sourceLabel,
      sourceUrl: r.url || "#",
          publishedAt: r.publishedDate || r.published_at || extractDateFromUrl(r.url) || new Date().toISOString(),
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
          summary: cleanText(title).slice(0, 200) || title.slice(0, 200),
          deepDive: `## AI 解读\n\n${label}`,
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
  ).then(items => items.filter(i => /[\u4e00-\u9fff]/.test(i.title || i.summary) && !isTraditional(i.title + ' ' + (i.summary||''))));

  // 4. Fetch finance news (中文搜索)
  const finItems = await searchExa(
    "金融市场 A股 美股 股票 经济 政策 利率 汇率 比特币 最新新闻",
    "finance",
    "Exa 搜索"
  ).then(items => items.filter(i => /[\u4e00-\u9fff]/.test(i.title || i.summary) && !isTraditional(i.title + ' ' + (i.summary||''))));

  // 5. Fetch robotics news (7-day window - less frequent)
  const robItems = await searchExa(
    "机器人 人形机器人 人工智能 自动化 最新进展",
    "robotics",
    "Exa 搜索",
    7
  ).then(items => items.filter(i => /[\u4e00-\u9fff]/.test(i.title || i.summary) && !isTraditional(i.title + ' ' + (i.summary||''))));

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

  // 8. 合并前先去重
  const allTitles = new Set(newItems.map(i => i.title.slice(0, 50).toLowerCase()));
  const filteredExisting = existingItems.filter(i => !allTitles.has(i.title.slice(0, 50).toLowerCase()));

  // 8b. Summarize 生成文章摘要 --length long
  if (process.env.DEEPSEEK_API_KEY) {
    const itemsToSummarize = [];
    // 新文章：摘要太短或含噪声的重新生成
    for (const item of newItems) {
      const s = item.summary || "";
      const needsSummarize = s.length < 100 || /^#\s|新华社|快速导航|登录|No summary/.test(s);
      if (needsSummarize) itemsToSummarize.push(item);
    }
    // 旧文章：批量补摘要（每次最多20条）
    for (const item of filteredExisting) {
      if (itemsToSummarize.length >= newItems.length + 20) break;
      const s = item.summary || "";
      const needsSummarize = s.length < 100 || /^#\s|新华社|快速导航|登录|From /.test(s);
      if (needsSummarize) itemsToSummarize.push(item);
    }
    console.log(`\n[Summarize] 需要生成摘要: ${itemsToSummarize.length} 条`);
    for (let i = 0; i < itemsToSummarize.length; i++) {
      const item = itemsToSummarize[i];
      const sourceText = item.deepDive?.replace(/## AI 解读\n?/, '').replace(/\n##.*/s, '').trim() 
        || item.summary || item.title;
      console.log(`[Summarize] (${i+1}/${itemsToSummarize.length}) ${item.title.slice(0,40)}`);
      try {
        const result = await summarize(sourceText, { length: "long" });
        if (result && result.length > 50) {
          item.summary = result;
          console.log(`[Summarize] ✅ ${result.length}字`);
        }
      } catch (err) {
        console.log(`[Summarize] ⚠️ ${err.message}`);
      }
      await new Promise(r => setTimeout(r, 300));
      if ((i + 1) % 10 === 0) console.log(`[Summarize] 已处理 ${i+1}/${itemsToSummarize.length}`);
    }
    console.log(`[Summarize] 摘要生成完成`);
  }

  // 9. 生成 AI 解读
  if (process.env.DEEPSEEK_API_KEY) {
    // 9a. 为新文章生成 AI 解读
    const itemsToAnalyze = [];
    for (const item of newItems) {
      if (!item.deepDive?.includes('## AI 解读')) continue;
      // 检查 AI 解读是否为模板（内容很短即为模板）
      const aiIdx = item.deepDive.indexOf('## AI 解读');
      const after = item.deepDive.slice(aiIdx + 10).trim();
      // 模板判断：AI解读内容很短（源名称）或直接就是占位符
      const aiContent = after.includes('\n## ') ? after.slice(0, after.indexOf('\n## ')).trim() : after.trim();
      const isTemplate = aiContent.length < 50;
      if (isTemplate) itemsToAnalyze.push(item);
    }
    // 9b. 旧文章中还没有 AI 解读的也补上
    for (const item of filteredExisting) {
      if (itemsToAnalyze.length >= 50) break;
      // 已经有真实 AI 分析的跳过（AI分析通常有几百字）
      if (item.deepDive?.includes('## AI 解读')) {
        const aiIdx = item.deepDive.indexOf('## AI 解读');
        const after = item.deepDive.slice(aiIdx + 10).trim();
        const nextHeading = after.indexOf('\n## ');
        const aiContent = nextHeading > 0 ? after.slice(0, nextHeading).trim() : after.trim();
        const hasAnalysis = aiContent.length > 100;
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
            item.deepDive = `## AI 解读\n\n${analysis.replace(/\*\*/g, '').replace(/\*/g, '')}`;
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
