import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * 从 git 历史中加载 19 条原始精品深挖内容
 * 这些是手工编写的带有数据分析与 AI 解读的高质量内容
 */
export function getOriginalDeepDives() {
  const jsonPath = path.join(__dirname, '..', 'scripts', 'original_deep_dives.json');
  try {
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
