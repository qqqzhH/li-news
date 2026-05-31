// Re-summarize short summaries with unlimited length
const fs = require("fs");
const path = require("path");
const { summarize } = require("./summarize");

const JSON_PATH = path.join(__dirname, "..", "src", "data", "news.json");

async function main() {
  const data = JSON.parse(fs.readFileSync(JSON_PATH, "utf-8"));
  const items = data.items;

  const toRedo = [];
  for (let i = 0; i < items.length; i++) {
    const s = items[i].summary || "";
    if (s.length > 0 && s.length < 200) {
      toRedo.push({ idx: i, item: items[i] });
    }
  }

  console.log(`Re-summarizing ${toRedo.length} short summaries...\n`);

  let count = 0;
  for (let i = 0; i < toRedo.length; i++) {
    const { idx, item } = toRedo[i];
    const aiMatch = (item.deepDive || "").match(/## AI 解读\n+([\s\S]*?)$/);
    let source = aiMatch ? aiMatch[1].trim() : (item.summary || item.title);
    source = source.replace(/^No summary available\n*/, "").slice(0, 2000);
    if (source.length < 20) continue;

    try {
      const result = await summarize(source, { length: "long" });
      if (result && result.length > 100) {
        const oldLen = item.summary.length;
        item.summary = result;
        count++;
        console.log(`[${i+1}/${toRedo.length}] ${item.title.slice(0,35)} (${oldLen}→${result.length}字)`);
      }
    } catch (e) {
      console.log(`[${i+1}/${toRedo.length}] ❌ ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 200));
    if ((i + 1) % 15 === 0) {
      fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), "utf-8");
      console.log(`  💾 Saved (${i+1}/${toRedo.length})`);
    }
  }
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), "utf-8");
  console.log(`\n✅ Upgraded ${count}/${toRedo.length} summaries`);
}

main().catch(err => { console.error(err); process.exit(1); });
