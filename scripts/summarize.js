/**
 * Summarize — news article summarization via DeepSeek API
 * Usage: node scripts/summarize.mjs --length long < input.txt
 *        Or require('./summarize.mjs') and call summarize(text, opts)
 */

const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY || "";
const API_URL = "https://api.deepseek.com/v1/chat/completions";

const PROMPTS = {
  short: `你是专业新闻编辑。请将以下新闻浓缩为一段150字以内的精炼摘要，只保留最核心的事实。不要出现"本文""据报道"等元描述。`,
  medium: `你是专业新闻编辑。请为以下新闻写一段300字左右的摘要，保留关键数据和背景信息，2-3段，语言精炼流畅。不要出现"本文""据报道"等元描述。`,
  long: `你是专业新闻编辑。请为以下新闻写一段精炼的摘要，字数不限，充分展开。要求：
1. 完整保留所有核心数据、具体数字、人名、机构名、时间节点
2. 按原文逻辑组织内容，覆盖所有关键信息点，不遗漏重要细节
3. 语言精炼流畅，适合直接作为文章简介发布
4. 不要出现"本文""据报道""据悉"等元描述
5. 不要重复文章标题
6. 根据内容量自然分段，充分覆盖原文要点`,
};

/**
 * Summarize text via DeepSeek API
 * @param {string} text - Article text to summarize
 * @param {{ length?: 'short'|'medium'|'long' }} opts
 * @returns {Promise<string>}
 */
const summarize = async (text, opts = {}) => {
  const length = opts.length || "long";
  const prompt = (PROMPTS[length] || PROMPTS.long) + `\n\n原文：\n${text.slice(0, 3000)}`;

  if (!DEEPSEEK_KEY) {
    console.error("[Summarize] DEEPSEEK_API_KEY not set, falling back to truncation");
    return text.slice(0, length === "short" ? 150 : 500);
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: prompt.split("\n")[0] },
          { role: "user", content: prompt },
        ],
        max_tokens: 2048,
        temperature: 0.5,
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!res.ok) {
      console.error(`[Summarize] API error ${res.status}`);
      return text.slice(0, 500);
    }

    const data = await res.json();
    const result = data.choices?.[0]?.message?.content || "";
    return result.trim();
  } catch (err) {
    console.error(`[Summarize] Error: ${err.message}`);
    return text.slice(0, 500);
  }
};

// CLI mode
if (require.main === module) {
  const args = process.argv.slice(2);
  const lengthIdx = args.indexOf("--length");
  const length = lengthIdx >= 0 ? args[lengthIdx + 1] : "long";

  let input = "";
  process.stdin.setEncoding("utf-8");
  process.stdin.on("data", (chunk) => { input += chunk; });
  process.stdin.on("end", async () => {
    const result = await summarize(input.trim(), { length });
    process.stdout.write(result);
  });
}

module.exports = { summarize };
