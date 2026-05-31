/**
 * Batch summarize all articles needing better summaries
 * Usage: node scripts/batch-summarize.js
 */
const fs = require("fs");
const path = require("path");
const { summarize } = require("./summarize");

const JSON_PATH = path.join(__dirname, "..", "src", "data", "news.json");

async function main() {
  const data = JSON.parse(fs.readFileSync(JSON_PATH, "utf-8"));
  const items = data.items;

  // Find items needing summarization
  const needSummary = [];
  for (let i = 0; i < items.length; i++) {
    const s = items[i].summary || "";
    const needs =
      s.length < 120 ||
      /^#\s|新华社|快速导航|登录|From |Exa 搜索|移动客户端|安全退出|媒体品牌/.test(s);
    if (needs) {
      // Score: worst first
      let score = s.length > 30 ? s.length : 0;
      if (/快速导航|登录|From /.test(s)) score -= 100;
      needSummary.push({ idx: i, score, item: items[i] });
    }
  }
  needSummary.sort((a, b) => a.score - b.score);

  console.log(`Processing ${needSummary.length}/${items.length} items...\n`);

  let count = 0;
  for (let i = 0; i < needSummary.length; i++) {
    const { idx, item } = needSummary[i];
    const dd = item.deepDive || "";
    
    // Extract source text from AI解读 or summary
    const aiMatch = dd.match(/## AI 解读\n+([\s\S]*?)$/);
    let source = aiMatch ? aiMatch[1].trim() : (item.summary || item.title);
    source = source.slice(0, 2000);

    if (source.length < 30) {
      console.log(`[${i+1}/${needSummary.length}] ⏭️ 无源文本: ${item.title.slice(0,40)}`);
      continue;
    }

    try {
      const result = await summarize(source, { length: "long" });
      if (result && result.length > 50) {
        item.summary = result;
        count++;
        console.log(`[${i+1}/${needSummary.length}] ✅ ${item.title.slice(0,40)} (${result.length}字)`);
      } else {
        console.log(`[${i+1}/${needSummary.length}] ⚠️ 太短: ${item.title.slice(0,40)}`);
      }
    } catch (err) {
      console.log(`[${i+1}/${needSummary.length}] ❌ ${err.message}`);
    }

    // Save every 15
    if ((i + 1) % 15 === 0) {
      fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), "utf-8");
      console.log(`  💾 Saved (${i+1}/${needSummary.length})`);
    }

    await new Promise(r => setTimeout(r, 200));
  }

  // Final save
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), "utf-8");
  console.log(`\n✅ Done! Updated ${count}/${needSummary.length} summaries`);
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
