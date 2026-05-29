// Server-only news data module
// Reads from public/data/news.json at build time via a simple fetch approach
// For static generation, we embed the data directly

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

// Embedded news data (static, bundled at build time)
const embeddedData: NewsData = {
  "lastUpdated": "2026-05-29T09:00:00.000Z",
  "items": [
    {
      "id": "ai-001",
      "title": "Claude Opus 4.8 发布：在编码、智能体技能与推理方面实现全面升级",
      "summary": "Anthropic 发布了新一代模型 Claude Opus 4.8，在编码、智能体技能、推理等各项基准测试中均取得进步，价格与前代相同。",
      "deepDive": "## 一、精简原文\n\nAnthropic 发布 Claude Opus 4.8，在编码(错误漏检率降低约 75%)、智能体(Online-Mind2Web 得分 84%，超越 Opus 4.7 和 GPT-5.5)、推理三个方面提升。同步推出动态工作流功能，2.5 倍速模式降价至原来的 1/3。\n\n## 二、AI 解读\n\n**为什么这次发布值得关注？**\n\nOpus 4.8 最耐人寻味的地方不是又强了多少，而是 Anthropic 选择在哪里发力。编码能力提升的针对性非常明确，这是在跟 Claude Code 生态打配合。头部模型的竞争已经从 benchmark 数字军备竞赛进入场景化的精细优化阶段。\n\n**降价的意义被低估了。** 2.5 倍速模式降价到 1/3，本质上是在打 token 价格战。这会让开发者的选择维度从哪个最强用哪个变成哪个性价比最优用哪个。对中小开发者和创业公司来说，这个变化比任何 benchmark 数字都更重要。",
      "category": "ai",
      "source": "Anthropic Newsroom",
      "sourceUrl": "https://www.anthropic.com/news/claude-opus-4-8",
      "publishedAt": "2026-05-29T08:00:00.000Z",
      "importance": "hot"
    },
    {
      "id": "ai-002",
      "title": "Grok Build 0.1 on API：xAI 发布专为编码训练的新模型",
      "summary": "xAI 的最新编码模型 Grok Build 0.1 已通过 API 进入公开测试阶段，推理速度超过 100 tokens/秒。",
      "deepDive": "## 一、精简原文\n\nxAI 推出 Grok Build 0.1，专为智能体编码任务训练，支持网页开发、调试和 MCP 协议。定价输入 $1/M tokens、输出 $2/M tokens。\n\n## 二、AI 解读\n\n**xAI 的策略正在清晰化。** Grok 系列之前以聊天助手形象出现，现在出纯编码模型，说明 xAI 想切开发者市场。定价比 GPT-5.5 便宜 7.5 倍，比 Claude Opus 4.8 也便宜一大截，策略明显是低价抢市场。如果 Grok Build 的 API 使用量在三个月内快速增长，说明开发者对够用且便宜的编码模型有巨大需求。",
      "category": "ai",
      "source": "xAI News",
      "sourceUrl": "https://x.ai/news/grok-build-0-1",
      "publishedAt": "2026-05-29T06:30:00.000Z",
      "importance": "normal"
    },
    {
      "id": "ai-003",
      "title": "Nano Banana Pro 与 Nano Banana 2 正式发布",
      "summary": "Google 发布 Nano Banana Pro 和 Nano Banana 2 图像生成模型，可通过 Gemini API 使用。",
      "deepDive": "## 一、精简原文\n\nGoogle 发布 Nano Banana Pro (Gemini 3 Pro Image) 和 Nano Banana 2 (Gemini 3.1 Flash Image) 两个图像生成模型。\n\n## 二、AI 解读\n\nNano 这个名字透露出策略定位：Google 在走小模型路线来打图像生成市场。不从最强切入，而是从最便宜够用切入。Nano 系列面向需要批量生成、对成本敏感的开发者场景。这延续了 Google 在文本模型上的策略（Gemini Nano 系列），说明 Google 判断 AI 应用落地的瓶颈不是能力上限，而是成本下限。",
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
      "deepDive": "## 一、精简原文\n\n商汤发布升级版信息图生成模型，在四个维度优化：文本准确性、布局一致性、图表质量、新增学术内容渲染支持。\n\n## 二、AI 解读\n\n这个方向选得非常精准。在中国 ToB 市场，信息图生成是刚需——企业做年报、汇报 PPT、营销物料需求巨大。商汤这个模型瞄准了科研论文配图这个垂直市场，这是海外模型很少关注的细分领域。",
      "category": "ai",
      "source": "商汤 SenseTime",
      "sourceUrl": "https://x.com/SenseTime_AI/status/2060015749826240724",
      "publishedAt": "2026-05-29T05:00:00.000Z",
      "importance": "hot"
    },
    {
      "id": "ai-005",
      "title": "Claude Code 引入动态工作流功能",
      "summary": "Claude Code 推出动态工作流功能，可端到端处理复杂任务，在单个会话中并行运行数十到数百个子智能体。",
      "deepDive": "## 一、精简原文\n\nClaude Code 推出动态工作流功能：在单个会话中并行运行数百个子智能体完成复杂任务，结果呈现前进行验证。适用于跨代码库 Bug 查找、大规模迁移等场景。\n\n## 二、AI 解读\n\n这是 Anthropic 对 AI 编码到了瓶颈的回应。目前 AI 编码助手本质上是单线程的，但真实软件开发需要同时理解多个文件的上下文。动态工作流不是让一个 Agent 做所有事，而是像人类团队一样让多个子智能体各负责一个模块。这个方向比模型更强更重要。如果多 Agent 协作被验证优于单 Agent 超强，未来 AI 编码赛道将从卷模型能力转向卷 Agent 架构。",
      "category": "ai",
      "source": "Claude Blog",
      "sourceUrl": "https://claude.com/blog/introducing-dynamic-workflows-in-claude-code",
      "publishedAt": "2026-05-29T04:30:00.000Z",
      "importance": "normal"
    },
    {
      "id": "ai-006",
      "title": "Perplexity Computer 现已集成微软 Office 套件",
      "summary": "Perplexity Computer 登陆 Excel、Word、PowerPoint 和 Outlook，可在侧边栏直接使用。",
      "deepDive": "## 一、精简原文\n\nPerplexity Computer 集成微软 Office 套件，用户可在应用侧边栏直接使用 AI 能力进行文档起草、建模、演示和邮件处理。\n\n## 二、AI 解读\n\n这是 Perplexity 去搜索化战略的最新一步。集成 Office 意味着定位不是搜索引擎而是工作助手。Office 用户基数巨大，但微软 Copilot 需要额外付费。Perplexity 作为第三方集成提供了一个低门槛替代。关键是执行质量：侧边栏 AI 是真能操作数据还是只能给建议？如果是前者，就找到了比搜索更有商业价值的场景。",
      "category": "ai",
      "source": "Perplexity",
      "sourceUrl": "https://x.com/perplexity_ai/status/2060013442720010598",
      "publishedAt": "2026-05-29T04:00:00.000Z",
      "importance": "normal"
    },
    {
      "id": "ai-007",
      "title": "Mistral AI 发布 Search Toolkit",
      "summary": "Mistral AI 发布 Search Toolkit 公共预览版，一个用于构建 AI 应用搜索管道的可组合框架。",
      "deepDive": "## 一、精简原文\n\nMistral AI 发布 Search Toolkit，整合数据摄取、检索和评估到单一框架中。开源，可部署在云端、本地或边缘环境。\n\n## 二、AI 解读\n\nMistral 在打欧洲开源这张牌。Search Toolkit 解决了一个真实痛点：搭建搜索/RAG 系统需要在多个工具间跳来跳去。对企业客户来说，选择 Mistral 有一个隐形吸引力——数据主权。用 OpenAI 的 RAG 数据要经过 OpenAI API，用 Mistral 的开源方案可完全部署在自己的基础设施里。这也是 Mistral 差异化竞争的核心策略：不做最强模型，做最能保护数据隐私的企业级 AI 方案。",
      "category": "ai",
      "source": "Mistral AI",
      "sourceUrl": "https://mistral.ai/news/search-toolkit",
      "publishedAt": "2026-05-29T03:30:00.000Z",
      "importance": "hot"
    },
    {
      "id": "ai-008",
      "title": "Anthropic 完成 650 亿美元 H 轮融资",
      "summary": "Anthropic 宣布完成 650 亿美元 H 轮融资，投后估值达 9650 亿美元，年化收入突破 470 亿美元。",
      "deepDive": "## 一、精简原文\n\nAnthropic 完成 650 亿美元 H 轮融资，投后估值 9650 亿美元，年化收入 470 亿美元。Claude 已登陆 AWS、Google Cloud 和 Azure 三大云平台。\n\n## 二、AI 解读\n\n几个数字值得对齐：650 亿美元 H 轮超过了全球 95% 的独角兽估值。470 亿美元年化收入意味着月收入约 40 亿美元。但有一个值得警惕的信号：9650 亿 / 470 亿 = 20 倍 PS，对于 AI 公司偏高。投资人赌的是 Claude 会在企业市场持续增长，而不是 Anthropic 目前的盈利能力值这个价。如果明年年化收入没有翻倍到 1000 亿级别，估值压力就会显现。",
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
      "deepDive": "## 一、精简原文\n\n台海地区近期出现新的紧张态势，美国重申一个中国政策，欧盟呼吁和平解决，日本表示关注地区稳定。各方虽 rhetoric 升温但保留外交沟通渠道。\n\n## 二、AI 解读\n\n台海局势的紧张-缓和周期已形成可预测的节奏。双方都在利用紧张本身作为筹码。值得关注的新变量：下半年 APEC、G20 等国际峰会是领导人会晤窗口。如果局势在会议前明显升温，往往是为了降温而加压的策略性操作。\n\n## 三、后续发展预测\n\n- 短期(1-3月)：紧张但不失控，无重大突破也无实质性冲突\n- 中期(3-6月)：峰会提供外交场合，可能出现经济层面的小交易\n- 长期：美国大选周期影响政策连续性",
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
      "deepDive": "## 一、精简原文\n\n中美近期保持技术级别官员频繁接触，就关税、市场准入等议题举行多轮视频会议。\n\n## 二、AI 解读\n\n工作层面频繁接触要么是正在谈成具体协议，要么是双方在摸底。后者可能性更大。这次的接触频繁更可能产生的是部分领域的小交易而非全面突破。这种小事上推进、大事上僵持的模式可能会是未来两年的常态。\n\n## 三、后续发展预测\n\n- 最可能(60%)：2-3月内达成小范围关税减免和采购协议\n- 较可能(25%)：无实质成果，人民币短期承压\n- 小概率(15%)：关系转冷，新一轮贸易摩擦",
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
      "deepDive": "## 一、精简原文\n\n俄乌冲突整体烈度下降，但和谈无进展。联合国呼吁停火，欧盟继续援助。\n\n## 二、AI 解读\n\n一个关键转变正在发生：战场烈度下降不意味着走向和平，而是进入消耗战新阶段。双方都在巩固已控制区域、补充兵力和争取国际支持。对于市场来说，俄乌冲突影响已从突发冲击转化为背景噪音。值得跟踪的信号：欧洲天然气库存水平和价格。\n\n## 三、后续发展预测\n\n- 短期(1-3月)：战线僵持，无重大领土变化\n- 中期：可能出现被动谈判窗口，短暂停火和有限对话\n- 最大不确定性：2027年美国政策变化",
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
      "deepDive": "## 一、精简原文\n\n伊朗核问题新一轮维也纳谈判未取得突破，各方在铀浓缩水平、制裁解除和核查机制三大议题上分歧依旧。\n\n## 二、AI 解读\n\n谈判的死循环：伊朗需要制裁解除才能发展经济，美国需要伊朗放弃核武才能解除制裁。本轮新增变量是地区冲突外溢——中东越乱，伊朗的配合对西方越有价值。油价视角：僵局本身就是油价的风险溢价。如果谈判意外突破，伊朗原油可能在6-12月内每日增加100-150万桶出口。\n\n## 三、后续发展预测\n\n- 基准(65%)：继续僵持，油价高波动\n- 乐观(20%)：临时性冻结铀浓缩换取部分制裁解除\n- 悲观(15%)：伊朗加速铀浓缩，制裁升级，油价急拉",
      "category": "geopolitics",
      "source": "综合国际新闻",
      "sourceUrl": "#",
      "publishedAt": "2026-05-27T07:00:00.000Z",
      "importance": "normal"
    },
    {
      "id": "fin-001",
      "title": "美股三大指数集体收涨：科技股领涨",
      "summary": "受 AI 板块乐观情绪推动，美股三大指数全线上涨，纳斯达克涨幅领先。",
      "deepDive": "## 一、精简原文\n\n美股周三收涨：道琼斯 +0.8%，标普500 +1.2%，纳斯达克 +1.8%。半导体 +2.3%，AI 软件 +3.1%领涨。\n\n## 二、AI 解读\n\n这轮上涨的结构值得拆解。纳斯达克涨幅接近道琼斯2倍，说明资金高度聚焦科技股。驱动因素可能是产业趋势驱动(机构调仓到AI)或避险型配置(其他板块不确定性更大)。判断方法：看接下来一周金融和工业板块是否跟进。如果其他板块开始涨说明整体市场走强；如果只有科技股独涨说明资金在避险。\n\n## 三、后续发展预测\n\n- 短期：AI 板块惯性上涨，但周五获利回吐则说明支撑不足\n- 中期(1-3月)：取决于Q2财报季的AI公司业绩指引\n- 风险：通胀数据反弹将重新定价科技股估值",
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
      "deepDive": "## 一、精简原文\n\nA股窄幅震荡：上证 -0.3%，深证 +0.1%，创业板 +0.5%。北向资金净流入15亿，主力资金净流出80亿。\n\n## 二、AI 解读\n\n沪指3000点的保卫战已成A股心理锚点。但支撑和反转是两回事。主力资金仍净流出80亿说明大资金还在减仓，北向15亿体量太小说明外资没有大规模回来。目前判断是3000点附近短期稳住但方向未明，需等待新的催化剂。\n\n## 三、后续发展预测\n\n- 震荡延续(50%)：2950-3080区间等待政策或数据指引\n- 政策反弹(30%)：超预期刺激政策可拉升至3150以上\n- 下行(20%)：外部风险叠加，跌破2950探2850",
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
      "deepDive": "## 一、精简原文\n\n美联储会议纪要显示多数委员认为通胀持续改善，若趋势延续年内可能降息一次。市场定价：9月降息概率45%，12月65%。\n\n## 二、AI 解读\n\n信号有细微但重要的转变：从数据依赖转向降息路径的明确预期管理。市场定价的45%和65%值得解读——9月不是板上钉钉，但市场认为年底大概率会降一次，且这个预期已被定价。这意味着不对称风险结构：如果9月降息市场可能不大涨(已被定价)；如果不降可能跌(预期落空)。\n\n## 三、后续发展预测\n\n- 9月FOMC是关键：CPI降至2.5%以下则降息概率升至70%+\n- 美元和人民币：降息确认后美元回落，人民币贬值压力缓解\n- 如通胀反弹：联储重回鹰派，全球风险资产重新定价",
      "category": "finance",
      "source": "综合财经",
      "sourceUrl": "#",
      "publishedAt": "2026-05-28T12:00:00.000Z",
      "importance": "hot"
    },
    {
      "id": "fin-004",
      "title": "比特币价格突破7万美元：加密市场回暖",
      "summary": "比特币价格突破 70000 美元关口，创近期新高，ETF 资金持续流入。",
      "deepDive": "## 一、精简原文\n\n比特币突破70000美元创近期新高，ETF资金持续流入、机构增持是主要推动力。\n\n## 二、AI 解读\n\n原因可能不像表面看起来那么简单。传统叙事是减半效应加ETF资金等于上涨，但忽略了宏观流动性环境。比特币作为风险资产标杆与全球流动性关联度极高。当前处于紧缩尾声、降息前夕的窗口期，比特币提前定价降息预期。值得跟踪的指标：稳定币USDT/USDC总市值是否持续增长，以此判断是增量资金入场还是存量炒作。\n\n## 三、后续发展预测\n\n- 短期(1-4周)：68000-75000区间震荡整固\n- 中期：如美联储进入降息周期，挑战80000+前高\n- 风险：各国监管政策意外收紧",
      "category": "finance",
      "source": "综合财经",
      "sourceUrl": "#",
      "publishedAt": "2026-05-28T10:00:00.000Z",
      "importance": "hot"
    }
  ]
};
