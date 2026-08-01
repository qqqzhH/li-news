/**
 * 木子新闻 - 重新生成 src/lib/daily-summary.ts
 *
 * 从 src/data/news.json 读取最新新闻（按热度+最新排序），
 * 调用 DeepSeek 生成结构化日报总结，写入 daily-summary.ts。
 *
 * 运行: DEEPSEEK_API_KEY=sk-xxx node scripts/gen-daily-summary.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "..", "src", "data", "news.json");
const OUT_PATH = path.join(__dirname, "..", "src", "lib", "daily-summary.ts");
const API_KEY = process.env.DEEPSEEK_API_KEY;

if (!API_KEY) {
  console.error("缺少 DEEPSEEK_API_KEY");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
const items = data.items || [];

// 取最新一天（含当天）作为日报窗口
const dates = items.map((i) => (i.publishedAt || "").slice(0, 10)).filter(Boolean).sort();
const latestDate = dates[dates.length - 1];
const windowStart = latestDate; // 最新新闻日期
// 窗口：最新日期往前推 2 天
const start = new Date(windowStart);
start.setDate(start.getDate() - 2);
const startStr = start.toISOString().slice(0, 10);

const recent = items.filter((i) => (i.publishedAt || "").slice(0, 10) >= startStr);
console.log(`日报窗口: ${startStr} ~ ${latestDate}，共 ${recent.length} 条`);

const byCat = {};
for (const it of recent) {
  (byCat[it.category] = byCat[it.category] || []).push(it);
}
for (const cat of Object.keys(byCat)) {
  byCat[cat].sort((a, b) => {
    const hot = (x) => (x.importance === "hot" ? 0 : 1);
    return hot(a) - hot(b) || new Date(b.publishedAt) - new Date(a.publishedAt);
  });
}

function digest(list, max = 8) {
  return (list || []).slice(0, max).map((it, i) =>
    `${i + 1}. [${it.importance}] ${it.title}\n   摘要: ${(it.summary || "").slice(0, 160)}`
  ).join("\n");
}

const prompt = `你是「木子新闻」的首席编辑，负责生成每日新闻总结。

今天是 ${latestDate}。请基于以下最新新闻（${startStr} 至 ${latestDate}）生成一份专业的中文日报总结。

各分类新闻摘要：
【AI 模型/产品】
${digest(byCat.ai)}
【机器人】
${digest(byCat.robotics)}
【地缘政治】
${digest(byCat.geopolitics)}
【金融】
${digest(byCat.finance)}
【其他】
${digest(byCat.other) || "今日暂无"}

请直接输出合法 JSON（不要用 markdown 代码块包裹，不要输出任何其他文字），结构如下：
{
  "coreEvents": "3-4 段全景概述，覆盖当日最重要的 AI、地缘、金融、机器人事件（纯文本，可用 ** 加粗）",
  "categoryHighlights": {
    "ai": "AI 分类要点段落",
    "robotics": "机器人分类要点段落",
    "geopolitics": "地缘政治分类要点段落",
    "finance": "金融分类要点段落",
    "other": "其他分类要点段落（没有就用：今日暂无其他要闻分类中的重要新闻条目。）"
  },
  "aiAnalysis": {
    "geopolitics": "深度分析，用 **一、标题** 分段，2-3 个部分，每部分 100-200 字",
    "finance": "深度分析，用 **一、标题** 分段，2-3 个部分，每部分 100-200 字"
  },
  "todayJudgment": ["4 条精炼判断，每条 20-40 字，犀利有洞察"]
}

要求：
1. 全部简体中文
2. 内容必须基于提供的新闻，不得编造
3. 不要使用反引号（\`），不要使用 \${} 语法
4. JSON 必须是合法 JSON（字符串内引号需正确转义）`;

console.log("调用 DeepSeek 生成日报总结...");
const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
  body: JSON.stringify({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: "你是木子新闻的首席编辑，输出严格合法的 JSON，不输出任何多余内容。" },
      { role: "user", content: prompt },
    ],
    max_tokens: 4000,
    temperature: 0.7,
  }),
});
if (!res.ok) {
  console.error(`DeepSeek API 错误: ${res.status} ${await res.text()}`);
  process.exit(1);
}
const respData = await res.json();
const content = respData.choices?.[0]?.message?.content || "";
if (!content) {
  console.error("DeepSeek 返回为空");
  process.exit(1);
}

// 解析 JSON（容错：剥离可能的 ```json ... ``` 围栏）
let jsonText = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
let summary;
try {
  summary = JSON.parse(jsonText);
} catch {
  console.error("JSON 解析失败，尝试截取第一个 { ... }");
  const start = jsonText.indexOf("{");
  const end = jsonText.lastIndexOf("}");
  if (start === -1 || end === -1) {
    console.error("无法解析 LLM 输出:", content.slice(0, 500));
    process.exit(1);
  }
  summary = JSON.parse(jsonText.slice(start, end + 1));
}

// 校验结构
const required = ["coreEvents", "categoryHighlights", "aiAnalysis", "todayJudgment"];
for (const k of required) {
  if (!(k in summary)) {
    console.error(`缺少字段: ${k}`);
    process.exit(1);
  }
}
for (const cat of ["ai", "robotics", "geopolitics", "finance", "other"]) {
  if (!summary.categoryHighlights[cat]) summary.categoryHighlights[cat] = "今日暂无其他要闻分类中的重要新闻条目。";
}

// 转义：嵌入模板字符串（反引号）与 ${} 语法
function escBacktick(s) {
  return String(s)
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
}


const ts = `// Daily news summary — generated once per day, do not edit manually
import { DailySummary } from "@/types";

const summary: DailySummary = {
  date: ${JSON.stringify(latestDate)},
  lastUpdated: ${JSON.stringify(new Date().toISOString())},

  coreEvents: \`${escBacktick(summary.coreEvents)}\`,

  categoryHighlights: {
    ai: \`${escBacktick(summary.categoryHighlights.ai)}\`,

    robotics: \`${escBacktick(summary.categoryHighlights.robotics)}\`,

    geopolitics: \`${escBacktick(summary.categoryHighlights.geopolitics)}\`,

    finance: \`${escBacktick(summary.categoryHighlights.finance)}\`,

    other: \`${escBacktick(summary.categoryHighlights.other)}\`,
  },

  aiAnalysis: {
    geopolitics: \`${escBacktick(summary.aiAnalysis.geopolitics)}\`,

    finance: \`${escBacktick(summary.aiAnalysis.finance)}\`,
  },

  todayJudgment: [
${summary.todayJudgment.map((j) => `    ${JSON.stringify(String(j).replace(/\n/g, " "))}`).join(",\n")},
  ],
};

export function getDailySummary(): DailySummary {
  return summary;
}
`;

fs.writeFileSync(OUT_PATH, ts, "utf-8");
console.log(`已写入: ${OUT_PATH} (date=${latestDate})`);
console.log(`todayJudgment: ${summary.todayJudgment.length} 条`);
