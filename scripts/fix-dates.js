/**
 * 一次性修复：从 sourceUrl 提取真实发布日期
 */
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'news.json');

function extractDateFromUrl(url) {
  if (!url || url === '#') return null;
  
  // 模式1: /2026-05-30/ 或 /2026-05-30T
  let m = url.match(/\/(\d{4})-(\d{2})-(\d{2})[\/T\s]/);
  if (m) return formatDate(m);
  
  // 模式2: /20260530 后面跟非数字
  m = url.match(/\/(\d{4})(\d{2})(\d{2})(?=[^0-9]|$)/);
  if (m) return formatDate(m);
  
  // 模式3: 2026_05_30
  m = url.match(/\/(\d{4})_(\d{2})_(\d{2})/);
  if (m) return formatDate(m);
  
  return null;
}

function formatDate(match) {
  const [, year, month, day] = match;
  const y = parseInt(year);
  const m = parseInt(month);
  const d = parseInt(day);
  if (y >= 2020 && y <= 2030 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T08:00:00.000Z`;
  }
  return null;
}

const raw = fs.readFileSync(DATA_PATH, 'utf-8');
const data = JSON.parse(raw);

let fixed = 0;
let already = 0;
let noDate = 0;
const noDateUrls = [];

for (const item of data.items) {
  const pa = new Date(item.publishedAt).getTime();
  const ua = new Date(item.updatedAt).getTime();
  
  // 已经有不同时间的 → 跳过
  if (Math.abs(pa - ua) > 1000) {
    already++;
    continue;
  }
  
  // 尝试从 URL 提取日期
  const extracted = extractDateFromUrl(item.sourceUrl);
  if (extracted) {
    item.publishedAt = extracted;
    fixed++;
  } else {
    noDate++;
    noDateUrls.push(item.sourceUrl);
  }
}

console.log(`Fixed: ${fixed}, Already correct: ${already}, No date found: ${noDate}`);
console.log('\nSample URLs without date:');
noDateUrls.slice(0, 10).forEach(u => console.log(' ', u));

fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
console.log('\nWritten to', DATA_PATH);
