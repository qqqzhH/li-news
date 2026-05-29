// News data module - embedded inline for Vercel compatibility
import { NewsData, NewsItem, Category } from "@/types";

export function getAllNews(): NewsData {
  return embeddedData;
}

export function getNewsByCategory(category: Category): NewsItem[] {
  return embeddedData.items
    .filter((item) => item.category === category)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getHotNews(): NewsItem[] {
  return embeddedData.items
    .filter((item) => item.importance === "hot")
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function searchNews(query: string): NewsItem[] {
  const q = query.toLowerCase();
  return embeddedData.items
    .filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.deepDive.toLowerCase().includes(q)
    )
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "刚刚";
  if (diffMins < 60) return `${diffMins} 分钟前`;
  if (diffHours < 24) return `${diffHours} 小时前`;
  if (diffDays < 7) return `${diffDays} 天前`;

  return date.toLocaleDateString("zh-CN", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

const embeddedData: NewsData = {
  "lastUpdated": "2026-05-29T09:00:00.000Z",
  "items": [
    {
      "id": "ai-001",
      "title": "Claude Opus 4.8 发布：在编码、智能体技能与推理方面实现全面升级",
      "summary": "Anthropic 发布了新一代模型 Claude Opus 4.8，在编码、智能体技能、推理等各项基准测试中均取得进步，价格与前代相同。",
      "deepDive": "## 一、精简原文\n\nAnthropic 发布 Claude Opus 4.8，在编码(错误漏检率降低约75%)、智能体(Online-Mind2Web得分84%，超越Opus 4.7和GPT-5.5)、推理三个方面提升。同步推出动态工作流功能，2.5倍速模式降价至原来的1/3。\n\n## 二、AI解读\n\nOpus 4.8 最耐人寻味的地方不是又强了多少，而是Anthropic选择在哪里发力。编码能力提升的针对性非常明确，这是在跟Claude Code生态打配合。头部模型的竞争已经从benchmark数字军备竞赛进入场景化的精细优化阶段。降价的意义被低估了：2.5倍速模式降价到1/3，本质上是在打token价格战。对中小开发者和创业公司来说，这个变化比任何benchmark数字都更重要。",
      "category": "ai",
      "source": "Anthropic Newsroom",
      "sourceUrl": "https://www.anthropic.com/news/claude-opus-4-8",
      "publishedAt": "2026-05-29T08:00:00.000Z",
      "importance": "hot"
    },
    {
      "id": "ai-002",
      "title": "Grok Build 0.1 on API：xAI发布专为编码训练的新模型",
      "summary": "xAI的最新编码模型 Grok Build 0.1 已通过API进入公开测试阶段，推理速度超过100 tokens/秒。",
      "deepDive": "## 一、精简原文\n\nxAI推出Grok Build 0.1，专为智能体编码任务训练，支持网页开发、调试和MCP协议。定价输入$1/M tokens、输出$2/M tokens。\n\n## 二、AI解读\n\nGrok系列之前以聊天助手形象出现，现在出纯编码模型说明xAI想切开发者市场。定价比GPT-5.5便宜7.5倍，比Claude Opus 4.8也便宜一大截，策略明显是低价抢市场。如果Grok Build的API使用量在三个月内快速增长，说明开发者对够用且便宜的编码模型有巨大需求。",
      "category": "ai",
      "source": "xAI News",
      "sourceUrl": "https://x.ai/news/grok-build-0-1",
      "publishedAt": "2026-05-29T06:30:00.000Z",
      "importance": "normal"
    },
    {
      "id": "ai-003",
      "title": "Nano Banana Pro与Nano Banana 2正式发布",
      "summary": "Google发布Nano Banana Pro和Nano Banana 2图像生成模型，可通过Gemini API使用。",
      "deepDive": "## 一、精简原文\n\nGoogle发布Nano Banana Pro(Gemini 3 Pro Image)和Nano Banana 2(Gemini 3.1 Flash Image)两个图像生成模型。\n\n## 二、AI解读\n\nNano这个名字透露出策略定位：Google在走小模型路线来打图像生成市场。不从最强切入，而是从最便宜够用切入。这延续了Google在文本模型上的策略(Gemini Nano系列)，说明Google判断AI应用落地的瓶颈不是能力上限，而是成本下限。",
      "category": "ai",
      "source": "Google AI",
      "sourceUrl": "https://x.com/googleaidevs/status/2060049962356916377",
      "publishedAt": "2026-05-29T05:30:00.000Z",
      "importance": "hot"
    },
    {
      "id": "ai-004",
      "title": "商汤发布信息图生成模型升级，增强多项核心能力",
      "summary": "商汤科技发布升级版信息图生成模型，在文本准确性、布局一致性等方面优化。",
      "deepDive": "## 一、精简原文\n\n商汤发布升级版信息图生成模型，在文本准确性、布局一致性、图表质量、学术内容渲染四个维度优化。\n\n## 二、AI解读\n\n这个方向选得非常精准。在中国ToB市场，信息图生成是刚需。商汤这个模型瞄准了科研论文配图这个垂直市场，这是海外模型很少关注的细分领域。",
      "category": "ai",
      "source": "商汤SenseTime",
      "sourceUrl": "https://x.com/SenseTime_AI/status/2060015749826240724",
      "publishedAt": "2026-05-29T05:00:00.000Z",
      "importance": "hot"
    },
    {
      "id": "ai-005",
      "title": "Claude Code引入动态工作流功能",
      "summary": "Claude Code推出动态工作流功能，可端到端处理复杂任务，在单个会话中并行运行数十到数百个子智能体。",
      "deepDive": "## 一、精简原文\n\nClaude Code推出动态工作流：在单个会话中并行运行数百个子智能体完成复杂任务。适用于跨代码库Bug查找、大规模迁移等场景。\n\n## 二、AI解读\n\n这是Anthropic对AI编码到了瓶颈的回应。目前AI编码助手本质上是单线程的，但真实软件开发需要同时理解多个文件的上下文。动态工作流不是让一个Agent做所有事，而是像人类团队一样让多个子智能体各负责一个模块。这个方向比模型更强更重要。",
      "category": "ai",
      "source": "Claude Blog",
      "sourceUrl": "https://claude.com/blog/introducing-dynamic-workflows-in-claude-code",
      "publishedAt": "2026-05-29T04:30:00.000Z",
      "importance": "normal"
    },
    {
      "id": "ai-006",
      "title": "Perplexity Computer现已集成微软Office套件",
      "summary": "Perplexity Computer登陆Excel、Word、PowerPoint和Outlook，可在侧边栏直接使用。",
      "deepDive": "## 一、精简原文\n\nPerplexity Computer集成微软Office套件，用户可在应用侧边栏使用AI能力进行文档起草、建模和邮件处理。\n\n## 二、AI解读\n\n这是Perplexity去搜索化战略的最新一步。集成Office意味着定位不是搜索引擎而是工作助手。Office用户基数巨大，但微软Copilot需要额外付费。Perplexity作为第三方集成提供了一个低门槛替代。关键是执行质量：AI是真能操作数据还是只能给建议？如果是前者就找到了更有商业价值的场景。",
      "category": "ai",
      "source": "Perplexity",
      "sourceUrl": "https://x.com/perplexity_ai/status/2060013442720010598",
      "publishedAt": "2026-05-29T04:00:00.000Z",
      "importance": "normal"
    },
    {
      "id": "ai-007",
      "title": "Mistral AI发布Search Toolkit",
      "summary": "Mistral AI发布Search Toolkit公共预览版，一个用于构建AI应用搜索管道的可组合框架。",
      "deepDive": "## 一、精简原文\n\nMistral AI发布Search Toolkit，整合数据摄取、检索和评估到单一框架中。开源，可部署在云端、本地或边缘环境。\n\n## 二、AI解读\n\nMistral在打欧洲开源这张牌。对企业客户来说有一个隐形吸引力：数据主权。用OpenAI的RAG数据要经过OpenAI API，用Mistral的开源方案可完全部署在自己的基础设施里。这是Mistral差异化竞争的核心策略：不做最强模型，做最能保护数据隐私的企业级AI方案。",
      "category": "ai",
      "source": "Mistral AI",
      "sourceUrl": "https://mistral.ai/news/search-toolkit",
      "publishedAt": "2026-05-29T03:30:00.000Z",
      "importance": "hot"
    },
    {
      "id": "ai-008",
      "title": "Anthropic完成650亿美元H轮融资",
      "summary": "Anthropic宣布完成650亿美元H轮融资，投后估值达9650亿美元，年化收入突破470亿美元。",
      "deepDive": "## 一、精简原文\n\nAnthropic完成650亿美元H轮融资，投后估值9650亿美元，年化收入470亿美元。Claude已登陆AWS、Google Cloud和Azure三大云平台。\n\n## 二、AI解读\n\n650亿美元H轮超过了全球95%的独角兽估值。但有一个值得警惕的信号：9650亿/470亿=20倍PS，对于AI公司偏高。投资人赌的是Claude会在企业市场持续增长而不是Anthropic目前的盈利能力值这个价。如果明年年化收入没有翻倍到1000亿级别，估值压力就会显现。",
      "category": "ai",
      "source": "Anthropic Newsroom",
      "sourceUrl": "https://www.anthropic.com/news/series-h",
      "publishedAt": "2026-05-29T03:00:00.000Z",
      "importance": "hot"
    },
    {
      "id": "geo-001",
      "title": "台海局势最新动态：多方呼吁保持对话稳定",
      "summary": "近期台海局势受到国际广泛关注。多方呼吁各方保持克制，通过外交对话解决分歧。",
      "deepDive": "## 一、精简原文\n\n台海地区近期出现新的紧张态势，美国重申一个中国政策，欧盟呼吁和平解决，日本关注地区稳定。\n\n## 二、AI解读\n\n台海局势的紧张-缓和周期已形成可预测的节奏。双方都在利用紧张本身作为筹码。下半年APEC、G20等国际峰会是领导人会晤窗口。如果局势在会议前明显升温，往往是为了降温而加压的策略性操作。\n\n## 三、后续发展预测\n\n- 短期(1-3月)：紧张但不失控\n- 中期(3-6月)：可能出现经济层面的小交易\n- 长期：美国大选周期影响政策连续性",
      "category": "geopolitics",
      "source": "综合报道",
      "sourceUrl": "#",
      "publishedAt": "2026-05-28T08:00:00.000Z",
      "importance": "hot"
    },
    {
      "id": "geo-002",
      "title": "中美贸易关系新动向：双方工作层面接触频繁",
      "summary": "中美近期保持经贸领域工作层面接触，市场对关系改善抱有期待。",
      "deepDive": "## 一、精简原文\n\n中美近期保持技术级别官员频繁接触，就关税、市场准入等议题举行多轮视频会议。\n\n## 二、AI解读\n\n接触频繁要么是正在谈成协议要么是双方在摸底。后者可能性更大。这种小事上推进、大事上僵持的模式可能会是未来两年的常态。\n\n## 三、后续发展预测\n\n- 最可能(60%)：2-3月内达成小范围关税减免协议\n- 较可能(25%)：无实质成果，人民币短期承压\n- 小概率(15%)：关系转冷，贸易摩擦升级",
      "category": "geopolitics",
      "source": "综合财经",
      "sourceUrl": "#",
      "publishedAt": "2026-05-28T06:00:00.000Z",
      "importance": "normal"
    },
    {
      "id": "geo-003",
      "title": "俄乌冲突最新：和谈前景仍不明朗",
      "summary": "俄乌冲突持续，国际社会推动和谈努力仍在继续。双方立场差距较大。",
      "deepDive": "## 一、精简原文\n\n俄乌冲突整体烈度下降，但和谈无进展。联合国呼吁停火，欧盟继续援助。\n\n## 二、AI解读\n\n战场烈度下降不意味着走向和平，而是进入消耗战新阶段。对于市场来说，俄乌冲突影响已从突发冲击转化为背景噪音。值得跟踪的信号：欧洲天然气库存水平和价格。\n\n## 三、后续发展预测\n\n- 短期(1-3月)：战线僵持\n- 中期：可能出现短暂停火和有限对话\n- 最大不确定性：美国政策变化",
      "category": "geopolitics",
      "source": "综合国际新闻",
      "sourceUrl": "#",
      "publishedAt": "2026-05-27T10:00:00.000Z",
      "importance": "hot"
    },
    {
      "id": "geo-004",
      "title": "中东局势：伊朗核问题谈判陷入僵局",
      "summary": "伊朗核问题新一轮谈判未能取得突破，各方在铀浓缩水平等问题上分歧依旧。",
      "deepDive": "## 一、精简原文\n\n伊朗核问题新一轮维也纳谈判未取得突破，各方在铀浓缩水平、制裁解除和核查机制三大议题上分歧依旧。\n\n## 二、AI解读\n\n谈判的死循环：伊朗需要制裁解除才能发展经济，美国需要伊朗放弃核武才能解除制裁。僵局本身就是油价的风险溢价。如果谈判意外突破，伊朗原油可能在6-12月内每日增加100-150万桶出口。\n\n## 三、后续发展预测\n\n- 基准(65%)：继续僵持，油价高波动\n- 乐观(20%)：临时性冻结铀浓缩换取部分制裁解除\n- 悲观(15%)：制裁升级，油价急拉",
      "category": "geopolitics",
      "source": "综合国际新闻",
      "sourceUrl": "#",
      "publishedAt": "2026-05-27T07:00:00.000Z",
      "importance": "normal"
    },
    {
      "id": "fin-001",
      "title": "美股三大指数集体收涨：科技股领涨",
      "summary": "受AI板块乐观情绪推动，美股三大指数全线上涨，纳斯达克涨幅领先。",
      "deepDive": "## 一、精简原文\n\n美股周三收涨：道琼斯+0.8%，标普500+1.2%，纳斯达克+1.8%。半导体+2.3%，AI软件+3.1%领涨。\n\n## 二、AI解读\n\n纳斯达克涨幅接近道琼斯2倍，说明资金高度聚焦科技股。判断是产业趋势驱动还是避险型配置的方法：看接下来一周金融和工业板块是否跟进。如果其他板块也涨说明整体市场走强；如果只有科技股独涨说明资金在避险。\n\n## 三、后续发展预测\n\n- 短期：AI板块惯性上涨\n- 中期(1-3月)：取决于Q2财报季的AI公司业绩指引\n- 风险：通胀数据反弹将重新定价科技股估值",
      "category": "finance",
      "source": "综合财经",
      "sourceUrl": "#",
      "publishedAt": "2026-05-28T21:00:00.000Z",
      "importance": "normal"
    },
    {
      "id": "fin-002",
      "title": "A股市场震荡整理：沪指企稳3000点",
      "summary": "A股三大指数今日窄幅震荡，沪指在3000点附近获得支撑。",
      "deepDive": "## 一、精简原文\n\nA股窄幅震荡：上证-0.3%，深证+0.1%，创业板+0.5%。北向资金净流入15亿，主力资金净流出80亿。\n\n## 二、AI解读\n\n沪指3000点的保卫战已成A股心理锚点。但支撑和反转是两回事。主力资金仍净流出80亿说明大资金还在减仓。目前判断是3000点附近短期稳住但方向未明。\n\n## 三、后续发展预测\n\n- 震荡延续(50%)：2950-3080区间等待政策指引\n- 政策反弹(30%)：超预期刺激政策可拉升至3150\n- 下行(20%)：外部风险叠加，跌破2950探2850",
      "category": "finance",
      "source": "综合财经",
      "sourceUrl": "#",
      "publishedAt": "2026-05-28T15:00:00.000Z",
      "importance": "normal"
    },
    {
      "id": "fin-003",
      "title": "美联储会议纪要暗示年内或降息一次",
      "summary": "美联储最新会议纪要显示，多数委员认为通胀正朝2%目标迈进，年内可能实施一次降息。",
      "deepDive": "## 一、精简原文\n\n美联储会议纪要显示多数委员认为通胀持续改善，若趋势延续年内可能降息一次。市场定价：9月降息概率45%，12月65%。\n\n## 二、AI解读\n\n信号从数据依赖转向降息路径的明确预期管理。这意味着不对称风险结构：如果9月降息市场可能不大涨(已被定价)；如果不降可能跌(预期落空)。\n\n## 三、后续发展预测\n\n- 9月FOMC是关键：CPI降至2.5%以下则降息概率升至70%+\n- 美元和人民币：降息确认后美元回落，人民币贬值压力缓解\n- 如通胀反弹：全球风险资产重新定价",
      "category": "finance",
      "source": "综合财经",
      "sourceUrl": "#",
      "publishedAt": "2026-05-28T12:00:00.000Z",
      "importance": "hot"
    },
    {
      "id": "fin-004",
      "title": "比特币价格突破7万美元：加密市场回暖",
      "summary": "比特币价格突破70000美元关口，创近期新高，ETF资金持续流入。",
      "deepDive": "## 一、精简原文\n\n比特币突破70000美元创近期新高，ETF资金持续流入、机构增持是主要推动力。\n\n## 二、AI解读\n\n比特币作为风险资产标杆与全球流动性关联度极高。当前处于紧缩尾声、降息前夕的窗口期，比特币提前定价降息预期。值得跟踪的指标：稳定币USDT/USDC总市值是否持续增长，以此判断是增量资金入场还是存量炒作。\n\n## 三、后续发展预测\n\n- 短期(1-4周)：68000-75000区间震荡\n- 中期：如美联储进入降息周期，挑战80000+前高\n- 风险：各国监管政策意外收紧",
      "category": "finance",
      "source": "综合财经",
      "sourceUrl": "#",
      "publishedAt": "2026-05-28T10:00:00.000Z",
      "importance": "hot"
    }
  ]
};
