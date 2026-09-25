// NewsCard 分类色板覆盖测试（node --test tests/cat-colors.test.mjs）
// 背景：catColors 从初版就漏了 robotics 键，标签回退灰色（Record<string,...>
// 宽类型让 TS 编译期无法发现）。本测试锁定：色板必须覆盖 Category 联合类型的全部键。
// 2026-09-25 修复：补 robotics: { bg: "#dcfce7", text: "#15803d" }（与首页第二屏
// robotics 用的 green-600 同色族）。
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const typesSrc = readFileSync(join(root, "src", "types", "index.ts"), "utf-8");
const cardSrc = readFileSync(join(root, "src", "components", "NewsCard.tsx"), "utf-8");

// 从 NewsItem 接口的 category 字段提取联合类型的全部键
const categoryLine = typesSrc.match(/category:\s*([^;]+);/);
assert.ok(categoryLine, "Category union type not found in types/index.ts");
const categories = [...categoryLine[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
assert.ok(categories.length >= 5, `expected at least 5 categories, got: ${categories.join(", ")}`);

// 从 NewsCard.tsx 提取 catColors 对象块
const block = cardSrc.match(/const catColors[^=]*= \{([\s\S]*?)\n  \};/);
assert.ok(block, "catColors block not found in NewsCard.tsx");

test("catColors palette covers every Category key", () => {
  for (const key of categories) {
    assert.match(block[1], new RegExp(`\\b${key}:\\s*\\{`), `catColors is missing key: ${key}`);
  }
});

test("every catColors entry has valid bg/text hex colors", () => {
  const entries = [...block[1].matchAll(/(\w+):\s*\{\s*bg:\s*"(#[0-9a-fA-F]{6})"\s*,\s*text:\s*"(#[0-9a-fA-F]{6})"/g)];
  assert.equal(entries.length, categories.length, "palette entry count should match category count");
  for (const [, key, bg, text] of entries) {
    assert.match(bg, /^#[0-9a-fA-F]{6}$/, `${key}.bg must be a 6-digit hex`);
    assert.match(text, /^#[0-9a-fA-F]{6}$/, `${key}.text must be a 6-digit hex`);
  }
});

test("robotics uses green palette consistent with homepage (green family)", () => {
  const robotics = block[1].match(/robotics:\s*\{\s*bg:\s*"([^"]+)"\s*,\s*text:\s*"([^"]+)"/);
  assert.ok(robotics, "robotics entry must exist");
  // green-100 背景 + green-700 文字，与首页 CatSection 的 #16a34a (green-600) 同族
  assert.equal(robotics[1].toLowerCase(), "#dcfce7", "robotics bg should be green-100");
  assert.equal(robotics[2].toLowerCase(), "#15803d", "robotics text should be green-700");
});
