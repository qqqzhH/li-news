// 冻结副本防回归测试（node --test tests/no-frozen-copies.test.mjs）
// 背景：public/moji_daily.html 与 public/archive.html 曾是 9/4 时代冻结副本（数据停在
// 8 月/9 月初），没有任何管线更新它们，2026-09-26 用户实测发现显示旧数据后退役——
// 实时版唯一来源 = 主站攀攀.xyz（主仓 panpan.xyz，GenMojiDaily 每日 10:27 更新），
// 由 public/_redirects 302 过去。若本测试红灯，说明冻结副本又被放回了 public/。
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = (f) => join(root, "public", f);

test("no frozen copies of live pages in public/ (realtime versions live in panpan.xyz)", () => {
  assert.equal(existsSync(pub("moji_daily.html")), false, "moji_daily.html frozen copy must stay deleted; realtime version is served by 攀攀.xyz via _redirects");
  assert.equal(existsSync(pub("archive.html")), false, "archive.html frozen copy must stay deleted; realtime version is served by 攀攀.xyz via _redirects");
});

test("_redirects points moji_daily/archive to the realtime site", () => {
  const rules = readFileSync(pub("_redirects"), "utf-8");
  assert.match(rules, /\/moji_daily\.html\s+https:\/\/xn--d9ua\.xyz\/moji_daily\.html\s+302/);
  assert.match(rules, /\/archive\.html\s+https:\/\/xn--d9ua\.xyz\/archive\.html\s+302/);
});

test("August full-record snapshots (sole copies on the internet) are kept", () => {
  for (const d of ["20260821", "20260825", "20260827"]) {
    assert.equal(existsSync(pub(`墨极·${d}.html`)), true, `墨极·${d}.html must be kept: panpan.xyz has no August snapshots, these are the only copies`);
  }
});

test("homepage buttons link directly to the realtime site (no extra hop)", () => {
  const page = readFileSync(join(root, "src", "app", "page.tsx"), "utf-8");
  assert.match(page, /href="https:\/\/攀攀\.xyz\/archive\.html"/);
  assert.match(page, /href="https:\/\/攀攀\.xyz\/moji_daily\.html"/);
  assert.ok(!page.includes("li-news.pages.dev/archive"), "stale self-referencing links should not reappear");
  assert.ok(!page.includes("li-news.pages.dev/moji_daily"), "stale self-referencing links should not reappear");
});
