// fetch-news.js 纯函数单测（node --test tests/fetch-news-utils.test.mjs）
// fetch-news.js 顶部 require 即可拿到导出的纯函数（主流程有 require.main 守卫，不会触发采集）
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const {
  getTweetTime,
  extractDateFromUrl,
  isTraditional,
  smartTruncate,
  cleanText,
  deduplicate,
  addHotTags,
  getDaysAgo,
} = require(join(root, "scripts", "fetch-news.js"));

test("getTweetTime: 从 snowflake ID 恢复发布时间", () => {
  // snowflake = (unix_ms - 1288834974657) << 22，取一个已知的晚近时间反推
  const unixMs = Date.parse("2026-09-20T12:00:00.000Z");
  const snowflake = (BigInt(unixMs) - 1288834974657n) << 22n;
  const iso = getTweetTime(`https://x.com/someone/status/${snowflake}`);
  assert.equal(new Date(iso).getTime(), unixMs);
  assert.equal(getTweetTime("https://example.com/no-status"), null);
  assert.equal(getTweetTime(undefined), null);
});

test("extractDateFromUrl: 支持两种日期格式，无日期返回 null", () => {
  assert.equal(extractDateFromUrl("https://site.com/2026-05-30/article.html"), "2026-05-30T00:00:00.000Z");
  assert.equal(extractDateFromUrl("https://site.com/20260530/abc.shtml"), "2026-05-30T00:00:00.000Z");
  assert.equal(extractDateFromUrl("https://site.com/no-date-here"), null);
  assert.equal(extractDateFromUrl(""), null);
});

test("isTraditional: 繁体判定", () => {
  assert.equal(isTraditional("國際邊飛發雲"), true);
  assert.equal(isTraditional("国际新闻：金融市场最新动态"), false);
});

test("smartTruncate: 短文原样返回；长文优先句子边界；无断点加省略号", () => {
  assert.equal(smartTruncate("短文本", 100), "短文本");
  const long = "第一句话。".repeat(50); // 250 字
  const cut = smartTruncate(long, 100);
  assert.ok(cut.length <= 100, "截断结果不应超过 maxLen 太多");
  assert.ok(cut.endsWith("。") || cut.endsWith("…"), "应在句子边界或省略号处结束");
  const noBreak = "字".repeat(300);
  assert.ok(smartTruncate(noBreak, 100).endsWith("…"));
});

test("cleanText: 去导航噪声行并压缩空行（正文需足够长，短于30字会走原文回退路径）", () => {
  const para1 = "正文第一段包含足够多的信息量，用来超过三十个字符的最短正文阈值要求。";
  const para2 = "正文第二段同样包含足够多的信息量，确保清洗后的内容不会被回退逻辑覆盖。";
  const raw = "# 标题\n登录\n" + para1 + "\n\n\n\n" + para2;
  const out = cleanText(raw);
  assert.ok(!out.includes("登录"), "应过滤导航行");
  assert.ok(out.includes("正文第一段"));
  assert.ok(!/\n{3,}/.test(out), "不应有 3 个以上连续换行");
});

test("cleanText: 清洗后短于 30 字符时回退为拼接原文（现状行为，含噪声）", () => {
  const out = cleanText("# 标题\n登录\n短正文。");
  assert.ok(out.includes("登录"), "回退路径不做噪声过滤，保留原文拼接");
  assert.ok(!out.startsWith("#"), "回退时会剥掉 # 前缀");
});

test("deduplicate: 按标题前 50 字符小写去重", () => {
  const items = [
    { title: "X".repeat(50) + "尾缀甲" },   // 前 50 字符相同（长标题截断后同键）
    { title: "x".repeat(50) + "尾缀乙" },   // 同键（大小写折叠），应被去重
    { title: "完全不同的另一条新闻标题" },
  ];
  const out = deduplicate(items);
  assert.equal(out.length, 2);
});

test("addHotTags: 命中关键词标记 hot，否则 normal", () => {
  const [hot, normal] = addHotTags([
    { title: "重大突破", summary: "某机构发布重磅成果" },
    { title: "普通消息", summary: "常规内容" },
  ]);
  assert.equal(hot.importance, "hot");
  assert.equal(normal.importance, "normal");
});

test("getDaysAgo: 返回 n 天前的日期串", () => {
  const expected = new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0];
  assert.equal(getDaysAgo(3), expected);
});
