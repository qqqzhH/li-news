// feed.xml 构建产物测试（node --test tests/feed.test.mjs）
// 依赖：先 npm run build 生成 out/feed.xml；out/ 不存在时跳过并提示。
// 背景：siteUrl 曾是占位符 https://li-news.vercel.app（从未部署的域名），
// 2026-09-25 修正为 https://li-news.pages.dev。本测试锁定该修正，防回潮。
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const feedPath = join(root, "out", "feed.xml");

test("feed.xml exists (run `npm run build` first)", { skip: !existsSync(feedPath) && "out/feed.xml not built yet" }, () => {
  assert.ok(existsSync(feedPath));
});

test("feed.xml uses the real site domain, not the old placeholder", () => {
  const xml = readFileSync(feedPath, "utf-8");
  assert.ok(!xml.includes("li-news.vercel.app"), "placeholder domain li-news.vercel.app must not reappear");
  assert.ok(xml.includes('<link href="https://li-news.pages.dev/feed.xml" rel="self"/>'), "self link must point to li-news.pages.dev");
  assert.ok(xml.includes('<link href="https://li-news.pages.dev" rel="alternate"/>'), "alternate link must point to li-news.pages.dev");
  assert.ok(xml.includes("<id>https://li-news.pages.dev</id>"), "feed id must be li-news.pages.dev");
});

test("feed.xml entry links are original source URLs (unaffected by siteUrl)", () => {
  const xml = readFileSync(feedPath, "utf-8");
  const entryLinks = [...xml.matchAll(/<entry>[\s\S]*?<link href="([^"]+)" rel="alternate"\/>/g)].map((m) => m[1]);
  assert.ok(entryLinks.length > 0, "feed must contain entries");
  const siteLinks = entryLinks.filter((u) => u.includes("li-news.pages.dev"));
  assert.equal(siteLinks.length, 0, "entry <link> must be original article URLs, not feed site URLs");
});

test("feed.xml is structurally complete", () => {
  const xml = readFileSync(feedPath, "utf-8");
  assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
  assert.ok(xml.trimEnd().endsWith("</feed>"));
  const entries = (xml.match(/<entry>/g) || []).length;
  const closed = (xml.match(/<\/entry>/g) || []).length;
  assert.equal(entries, closed, "every <entry> must be closed");
  // feed 上限 100 条（2026-09-26 起，防无限膨胀）；数据充足时应恰为 100
  assert.ok(entries <= 100, `feed must be capped at 100 entries, got ${entries}`);
  assert.ok(entries >= 50, "feed unexpectedly small (data layer problem?)");
});
