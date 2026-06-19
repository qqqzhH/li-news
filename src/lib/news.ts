// Lightweight news data for homepage — do not edit manually
import { NewsData, NewsItem, Category } from "@/types";

const hardcodedData: NewsData = {
  lastUpdated: "2026-06-19T01:11:33.445Z",
  items: [
  {
    id: "ai-1781831201658-6",
    title: "AI 员工 Viktor 登陆 Microsoft Teams，年化收入达 2000 万美元",
    summary: "AI 员工 Viktor 在 Slack 上实现 2000 万美元年化收入（无销售团队、未大规模推广），现已正式进驻 Microsoft Teams。Vikto",
    deepDive: "",
    category: "ai",
    source: "X：Rohan Paul (@rohanpaul_ai)",
    sourceUrl: "https://x.com/rohanpaul_ai/status/2067755504613613699",
    publishedAt: "2026-06-18T23:45:03.996Z",
    updatedAt: "2026-06-19T01:06:41.658Z",
    importance: "normal"
  },
  {
    id: "robotics-1781831203222-9",
    title: "人形机器人或许将是我们第一次完整经历的产业革命-36氪",
    summary: "博望财经·2026年03月13日 19:32\n\n2026年，人形机器人产业突破的产业化拐点即将到来。\n\n一年时间上涨超过120%，华是科技、海天瑞声两个月内涨幅",
    deepDive: "",
    category: "robotics",
    source: "Exa 搜索",
    sourceUrl: "https://www.36kr.com/p/3721088135492104",
    publishedAt: "2026-06-18T23:00:10.000Z",
    updatedAt: "2026-06-19T01:06:43.222Z",
    importance: "hot"
  },
  {
    id: "ai-1781831201658-4",
    title: "OpenAI 联合多国医生：GPT-5.5 Instant 健康问答能力追平前沿 Thinking 模型",
    summary: "OpenAI 与全球 60 个国家、49 种语言、26 个专科的数百名医生合作，通过医生主导的评估大幅提升了 GPT-5.5 Instant 在健康相关问题的智",
    deepDive: "",
    category: "ai",
    source: "X：Greg Brockman (@gdb)",
    sourceUrl: "https://x.com/gdb/status/2067675030335668270",
    publishedAt: "2026-06-18T18:25:17.433Z",
    updatedAt: "2026-06-19T01:06:41.658Z",
    importance: "normal"
  },
  {
    id: "ai-1781831201658-2",
    title: "Grok TTS 盲测人类感得分96登顶",
    summary: "xAI（由埃隆·马斯克创立的人工智能公司）于2023年7月12日正式宣布成立，其核心使命是“理解宇宙的真实本质”。公司团队汇聚了来自DeepMind、OpenA",
    deepDive: "",
    category: "ai",
    source: "X：xAI (@xai)",
    sourceUrl: "https://x.com/xai/status/2067654108123910495",
    publishedAt: "2026-06-18T17:02:09.189Z",
    updatedAt: "2026-06-19T01:06:41.658Z",
    importance: "normal"
  },
  {
    id: "geopolitics-1781831202611-7",
    title: "美伊远程签署谅解备忘录 条款全部公布_新浪科技_新浪网",
    summary: "Exa搜索完成了新一轮融资，具体金额未披露，但据知情人士透露，本轮融资由Lightspeed Venture Partners领投，估值达到数亿美元。Exa搜索",
    deepDive: "",
    category: "geopolitics",
    source: "Exa 搜索",
    sourceUrl: "https://finance.sina.com.cn/tech/roll/2026-06-19/doc-inicwaii3095717.shtml",
    publishedAt: "2026-06-18T16:11:29.000Z",
    updatedAt: "2026-06-19T01:06:42.611Z",
    importance: "normal"
  },
  {
    id: "finance-1781831202914-0",
    title: "A股特别提示（6-18）：美联储按兵不动但释放鹰派信号，年内加息风险显著上升_新浪财经_新浪网",
    summary: "A股特别提示（6-18）：美联储按兵不动但释放鹰派信号，年内加息风险显著上升\n\n市场资讯\n\n18\n\n星期四\n\n2026年6月\n\n新债申购：南芯转债 118070",
    deepDive: "",
    category: "finance",
    source: "Exa 搜索",
    sourceUrl: "https://finance.sina.com.cn/wm/2026-06-18/doc-inicuqfx6611294.shtml",
    publishedAt: "2026-06-18T13:21:29.000Z",
    updatedAt: "2026-06-19T01:06:42.914Z",
    importance: "hot"
  },
  {
    id: "robotics-1781831203220-6",
    title: "人形机器人不再走走停停：Current Robotics发布全身灵巧操作模型|移动|动作|本体|current|robotics_网易订阅",
    summary: "0\n\n分享至好友和朋友圈\n\n机器之心发布\n\n让人形机器人在移动中完成精细操作，一直是具身智能领域没有被很好解决的问题。\n\n过去的主流方案是把移动和操作拆成两个独",
    deepDive: "",
    category: "robotics",
    source: "Exa 搜索",
    sourceUrl: "https://www.163.com/dy/article/KVNOGA7N0511AQHO.html?f=post2020_dy_recommends",
    publishedAt: "2026-06-18T10:24:26.000Z",
    updatedAt: "2026-06-19T01:06:43.221Z",
    importance: "hot"
  },
  {
    id: "finance-1781831202915-2",
    title: "沃什“首秀”吓坏市场！美股全线收跌，金银跳水，预期今年会加息？_新浪财经_新浪网",
    summary: "Exa搜索公司近期完成了一轮重要融资，具体金额未公开，但据知情人士透露，本轮融资由知名风投机构Lightspeed Venture Partners领投，现有投",
    deepDive: "",
    category: "finance",
    source: "Exa 搜索",
    sourceUrl: "https://finance.sina.com.cn/wm/2026-06-18/doc-inicvmmr3305485.shtml",
    publishedAt: "2026-06-18T09:28:28.000Z",
    updatedAt: "2026-06-19T01:06:42.915Z",
    importance: "hot"
  },
  {
    id: "finance-1781831202916-6",
    title: "彻底晕了，美联储新主席首秀，四大“意外”直接把多头打懵-36氪",
    summary: "沃什鹰派首秀重构美联储框架，美股资产剧烈重定价\n\n美东时间周三，美股经历了一场典型的“过山车”行情。\n\n早盘，得益于 5 月零售销售数据超预期增长 0.9% 的",
    deepDive: "",
    category: "finance",
    source: "Exa 搜索",
    sourceUrl: "https://36kr.com/p/3857992231736582",
    publishedAt: "2026-06-18T09:25:03.000Z",
    updatedAt: "2026-06-19T01:06:42.916Z",
    importance: "hot"
  },
  {
    id: "ai-1781831201658-5",
    title: "免费开源乔木画布：AI生图+抠图，一键部署Vercel",
    summary: "乔木画布推出免费开源在线图像编辑器，可一键部署Vercel为网站，功能类似简化版PS。支持Seedream和GPT-image-2生图、图片模板存储分享、一键抠",
    deepDive: "",
    category: "ai",
    source: "X：Vista (@vista8)",
    sourceUrl: "https://x.com/vista8/status/2067513484364140994",
    publishedAt: "2026-06-18T07:43:21.872Z",
    updatedAt: "2026-06-19T01:06:41.658Z",
    importance: "normal"
  },
  {
    id: "finance-1781831202917-9",
    title: "潘功胜收紧利率走廊、丁向群立法强穿透、吴清科创扩容严打AI炒作｜2026陆家嘴论坛三监管定全年主线_新浪财经_新浪网",
    summary: "潘功胜收紧利率走廊、丁向群立法强穿透、吴清科创扩容严打AI炒作｜2026陆家嘴论坛三监管定全年主线\n\n6 月 17 日 2026陆家嘴论坛开幕，央行行长潘功胜、",
    deepDive: "",
    category: "finance",
    source: "Exa 搜索",
    sourceUrl: "https://finance.sina.com.cn/money/bank/bank_yhfg/2026-06-18/doc-inicvfcx2245864.shtml",
    publishedAt: "2026-06-18T05:27:05.000Z",
    updatedAt: "2026-06-19T01:06:42.917Z",
    importance: "hot"
  },
  {
    id: "finance-1781831202916-8",
    title: "芦哲：6月FOMC——市场反应过鹰，年内加息仍难【2026年6月FOMC会议点评】|美联储|点阵图|fomc|货币政策|会议纪要_网易订阅",
    summary: "0\n\n分享至好友和朋友圈\n\n芦哲、张佳炜（芦哲系东吴证券首席经济学家、中国首席经济学家论坛理事）\n\n核心观点\n\n核心观点：6月FOMC会议如期维持政策利率不变，",
    deepDive: "",
    category: "finance",
    source: "Exa 搜索",
    sourceUrl: "https://www.163.com/dy/article/KVN4NC7R0519IGF7.html",
    publishedAt: "2026-06-18T04:37:56.000Z",
    updatedAt: "2026-06-19T01:06:42.917Z",
    importance: "hot"
  },
  {
    id: "robotics-1781831203220-0",
    title: "通研院重磅成果，一套策略让人形机器人学会后空翻、霹雳舞，准确率超90%-36氪",
    summary: "智东西·2026年03月09日 12:56\n\n人形机器人学会数十种极限动作。\n\n今年春晚，人形机器人再次成为舞台上的焦点。\n\n相比去年颤颤巍巍地扭秧歌，宇树人形",
    deepDive: "",
    category: "robotics",
    source: "Exa 搜索",
    sourceUrl: "https://www.36kr.com/p/3713742376579463",
    publishedAt: "2026-06-18T04:35:37.000Z",
    updatedAt: "2026-06-19T01:06:43.220Z",
    importance: "hot"
  },
  {
    id: "finance-1781831202914-1",
    title: "沃什首秀，“吓坏”市场！美联储，重大转向！_新浪财经_新浪网",
    summary: "沃什首秀，“吓坏”市场！美联储，重大转向！\n\n6月18日，A股三大指数早盘低开，随后集体翻红。\n\n当地时间6月17日，美股尾盘突发跳水，截至收盘，道指跌超500",
    deepDive: "",
    category: "finance",
    source: "Exa 搜索",
    sourceUrl: "https://finance.sina.com.cn/wm/2026-06-18/doc-inicuyvx5514249.shtml",
    publishedAt: "2026-06-18T03:19:24.000Z",
    updatedAt: "2026-06-19T01:06:42.915Z",
    importance: "hot"
  },
  {
    id: "ai-1781831201659-10",
    title: "深入解析 Midjourney Scanner 技术内幕",
    summary: "Midjourney官方账号于2025年3月27日发布声明，宣布即日起暂停其AI图像生成工具的免费试用服务。该决定旨在应对近期出现的“大规模滥用行为”，包括用户",
    deepDive: "",
    category: "ai",
    source: "X：Midjourney (@midjourney)",
    sourceUrl: "https://x.com/midjourney/status/2067422898407837797",
    publishedAt: "2026-06-18T01:43:24.497Z",
    updatedAt: "2026-06-19T01:06:41.659Z",
    importance: "normal"
  },
  {
    id: "finance-1781831202915-4",
    title: "美联储进入“沃什时代”：压缩声明，点阵图转向加息，美联储一夜之间重塑鹰派形象_新浪财经_新浪网",
    summary: "美联储进入“沃什时代”：压缩声明，点阵图转向加息，美联储一夜之间重塑鹰派形象\n\n周四凌晨，凯文·沃什（Kevin Warsh）首次以美联储主席身份主持政策会议，",
    deepDive: "",
    category: "finance",
    source: "Exa 搜索",
    sourceUrl: "https://finance.sina.com.cn/money/forex/hbfx/2026-06-18/doc-inicuupx3280319.shtml",
    publishedAt: "2026-06-18T01:19:52.000Z",
    updatedAt: "2026-06-19T01:06:42.915Z",
    importance: "hot"
  },
  {
    id: "geopolitics-1781831202609-1",
    title: "特朗普亲自签署美伊谅解备忘录，现已生效；双方披露14项条款|伊朗外交部|唐纳·川普|联合国安理会|唐纳德·特朗普_网易订阅",
    summary: "0\n\n分享至好友和朋友圈\n\n美官员称特朗普亲自签署美伊谅解备忘录\n\n央视记者当地时间6月17日获悉，两名美国官员透露，美国和伊朗已远程签署旨在结束战争并开放霍尔",
    deepDive: "",
    category: "geopolitics",
    source: "Exa 搜索",
    sourceUrl: "https://www.163.com/dy/article/KVMOOFRC0512DU6N.html",
    publishedAt: "2026-06-18T01:08:50.000Z",
    updatedAt: "2026-06-19T01:06:42.610Z",
    importance: "normal"
  },
  {
    id: "ai-1781831201659-12",
    title: "Noam Shazeer 离开 Google 加入 OpenAI",
    summary: "Yuchen Jin（@Yuchenj_UW）在社交平台X上发布内容，具体信息需结合其个人账号动态与相关事件背景展开。该用户为华盛顿大学（University ",
    deepDive: "",
    category: "ai",
    source: "X：Yuchen Jin (@Yuchenj_UW)",
    sourceUrl: "https://x.com/Yuchenj_UW/status/2067401895178817999",
    publishedAt: "2026-06-18T00:19:56.937Z",
    updatedAt: "2026-06-19T01:06:41.659Z",
    importance: "normal"
  },
  {
    id: "ai-1781831201657-0",
    title: "首个统一科学大模型 LOGOS 正式开源",
    summary: "LOGOS 由 ATH-Token Foundry 联合中国人民大学高瓴人工智能学院开源，是首个基于统一“科学语法”的多领域科学生成基础模型。LOGOS-1B（",
    deepDive: "",
    category: "ai",
    source: "公众号：通义实验室（千问）",
    sourceUrl: "https://mp.weixin.qq.com/s/50q5uY849FKnBzk1Q04MRg",
    publishedAt: "2026-06-18T00:00:00.000Z",
    updatedAt: "2026-06-19T01:06:41.658Z",
    importance: "normal"
  },
  {
    id: "ai-1781831201658-1",
    title: "火山引擎上线豆包实时语音模型3.0 API 服务，开启邀测",
    summary: "火山引擎上线豆包实时语音模型3.0（Seeduplex）API 服务并开启邀测。该模型为原生全双工端到端语音大模型，具备精准遵循、抗干扰、动态判停三大优势。可在",
    deepDive: "",
    category: "ai",
    source: "公众号：火山引擎",
    sourceUrl: "https://mp.weixin.qq.com/s/L4BJnexabQu5DAxDnwEGxw",
    publishedAt: "2026-06-18T00:00:00.000Z",
    updatedAt: "2026-06-19T01:06:41.658Z",
    importance: "normal"
  },
  {
    id: "ai-1781831201658-3",
    title: "GPT-5.5 Instant提升ChatGPT健康智能",
    summary: "每周超2.3亿用户通过ChatGPT获取健康信息。GPT-5.5 Instant在健康评估中表现显著提升，最具挑战性评测上达到前沿Thinking模型水平，已面",
    deepDive: "",
    category: "ai",
    source: "OpenAI：官网动态（RSS · 排除企业/客户案例）",
    sourceUrl: "https://openai.com/index/improving-health-intelligence-in-chatgpt",
    publishedAt: "2026-06-18T00:00:00.000Z",
    updatedAt: "2026-06-19T01:06:41.658Z",
    importance: "normal"
  },
  {
    id: "ai-1781831201658-7",
    title: "Claude Code 现已支持 artifacts",
    summary: "从今日起，Claude Code 可将工作进度生成为 artifacts——实时、可分享的交互式网页，涵盖 PR 走查、系统说明、仪表盘、发布清单等。artif",
    deepDive: "",
    category: "ai",
    source: "Claude：Blog（网页）",
    sourceUrl: "https://claude.com/blog/artifacts-in-claude-code",
    publishedAt: "2026-06-18T00:00:00.000Z",
    updatedAt: "2026-06-19T01:06:41.658Z",
    importance: "hot"
  },
  {
    id: "ai-1781831201658-8",
    title: "Adobe 为 Photoshop、Premiere 等多款 Creative Cloud 应用加入 AI 智能体",
    summary: "Adobe 将其“创意智能体”扩展至 Photoshop、Premiere 等应用，以公开测试形式提供 AI Assistant。该智能体可自动完成多步骤常规任",
    deepDive: "",
    category: "ai",
    source: "The Decoder：AI News（RSS）",
    sourceUrl: "https://the-decoder.com/adobe-adds-ai-agents-to-photoshop-premiere-and-more-creative-cloud-apps",
    publishedAt: "2026-06-18T00:00:00.000Z",
    updatedAt: "2026-06-19T01:06:41.658Z",
    importance: "normal"
  },
  {
    id: "ai-1781831201658-9",
    title: "DeepSeek 识图模式正式上线 App 和网页端",
    summary: "DeepSeek 识图模式于6月18日在网页和 App 端正式上线，与快速模式、专家模式并列。开启后用户可直接上传图片让 DeepSeek 识别图像，能力超越简",
    deepDive: "",
    category: "ai",
    source: "IT之家（RSS）",
    sourceUrl: "https://www.ithome.com/0/966/066.htm",
    publishedAt: "2026-06-18T00:00:00.000Z",
    updatedAt: "2026-06-19T01:06:41.658Z",
    importance: "normal"
  },
  {
    id: "ai-1781831201659-11",
    title: "八部门：用好个人消费贷款财政贴息政策，支持消费者购买 AI 相关产品",
    summary: "商务部等八部门6月18日发布关于加快“人工智能+消费”发展的实施意见。其中提到加大财政资金支持，落实数码和智能产品购新政策，鼓励地方在消费品以旧换新框架内自主制",
    deepDive: "",
    category: "ai",
    source: "IT之家（RSS）",
    sourceUrl: "https://www.ithome.com/0/966/154.htm",
    publishedAt: "2026-06-18T00:00:00.000Z",
    updatedAt: "2026-06-19T01:06:41.659Z",
    importance: "hot"
  },
  {
    id: "ai-1781831201659-13",
    title: "我国首部L3/L4自动驾驶强制性国标公示：2027年7月起实施",
    summary: "工信部6月16日就《智能网联汽车自动驾驶系统安全要求》等2项强制性国标公开征求意见，公示至6月24日，建议2027年7月1日起实施。该标准系我国首部针对L3/L",
    deepDive: "",
    category: "ai",
    source: "IT之家（RSS）",
    sourceUrl: "https://www.ithome.com/0/966/272.htm",
    publishedAt: "2026-06-18T00:00:00.000Z",
    updatedAt: "2026-06-19T01:06:41.659Z",
    importance: "normal"
  },
  {
    id: "ai-1781831201659-14",
    title: "伯尼·桑德斯提出7万亿美元AI计划：对大型AI公司征收50%股票税",
    summary: "伯尼·桑德斯提出立法，对年AI销售额超2亿美元的公司征收50%股票税，建立价值约7万亿美元的主权财富基金。基金每年向每位美国公民发放超1000美元股息（5%年股",
    deepDive: "",
    category: "ai",
    source: "Ars Technica：AI（RSS）",
    sourceUrl: "https://arstechnica.com/tech-policy/2026/06/bernie-sanders-unveils-7-trillion-plan-to-give-americans-control-of-ai-industry",
    publishedAt: "2026-06-18T00:00:00.000Z",
    updatedAt: "2026-06-19T01:06:41.659Z",
    importance: "normal"
  },
  {
    id: "ai-1781831201659-15",
    title: "OpenAI IPO前连下两城：招揽Transformer共同作者及前白宫AI政策官员",
    summary: "OpenAI在IPO前夕连招两位重量级人物：Google DeepMind AI先驱、Transformer架构共同作者Noam Shazeer，以及前特朗普白",
    deepDive: "",
    category: "ai",
    source: "TechCrunch：AI（RSS）",
    sourceUrl: "https://techcrunch.com/2026/06/18/openai-is-bringing-on-some-big-guns-in-the-lead-up-to-its-ipo",
    publishedAt: "2026-06-18T00:00:00.000Z",
    updatedAt: "2026-06-19T01:06:41.659Z",
    importance: "normal"
  },
  {
    id: "ai-1781831201659-16",
    title: "AI数据中心获政府强制电网快车道",
    summary: "美国联邦能源监管委员会（FERC）命令六大电网运营商为数据中心等大型用户提供快速并网通道，数据中心需承担并网费用。FERC同时要求运营商考虑“替代输电技术”，并",
    deepDive: "",
    category: "ai",
    source: "TechCrunch：AI（RSS）",
    sourceUrl: "https://techcrunch.com/2026/06/18/ai-data-centers-just-got-a-government-mandated-fast-lane-to-the-grid",
    publishedAt: "2026-06-18T00:00:00.000Z",
    updatedAt: "2026-06-19T01:06:41.659Z",
    importance: "normal"
  },
  {
    id: "ai-1781831201659-17",
    title: "Grok 现集成 Databricks Agent Bricks",
    summary: "Grok 模型现已原生集成到 Databricks Agent Bricks 平台。在 2026 年 Data + AI Summit 上，Databricks",
    deepDive: "",
    category: "ai",
    source: "xAI：News（网页）",
    sourceUrl: "https://x.ai/news/grok-databricks",
    publishedAt: "2026-06-18T00:00:00.000Z",
    updatedAt: "2026-06-19T01:06:41.659Z",
    importance: "normal"
  },
  {
    id: "ai-1781831201659-18",
    title: "ChatGPT 图像生成器可被绕过滤镜生成暴力和色情内容",
    summary: "Mindgard 红队研究发现，ChatGPT 的图像生成器可通过简单提示词轻易绕过内容过滤器，在未直接请求的情况下自动生成性暴力、血腥谋杀等露骨图像。一个热门",
    deepDive: "",
    category: "ai",
    source: "Hacker News 热门（buzzing.cc 中文翻译）",
    sourceUrl: "https://mindgard.ai/blog/chatgpt-spontaneously-generated-violent-images-from-a-viral-prompt",
    publishedAt: "2026-06-18T00:00:00.000Z",
    updatedAt: "2026-06-19T01:06:41.659Z",
    importance: "normal"
  },
  {
    id: "ai-1781831201659-19",
    title: "Anthropic Project Fetch 第二阶段：Claude Opus 4.7 自主完成任务，速度比人类团队快约20倍",
    summary: "Anthropic 发布 Project Fetch 实验第二阶段结果。在2024年8月原始实验中，配备 Claude Opus 4.1 的人类团队在操控四足机",
    deepDive: "",
    category: "ai",
    source: "Anthropic：Research（发表成果 · 网页）",
    sourceUrl: "https://www.anthropic.com/research/project-fetch-phase-two",
    publishedAt: "2026-06-18T00:00:00.000Z",
    updatedAt: "2026-06-19T01:06:41.659Z",
    importance: "hot"
  },
  {
    id: "ai-1781831201659-20",
    title: "MosaicLeaks: 你的研究智能体能保守秘密吗？",
    summary: "深度研究智能体在结合私有本地文档与外部网页检索时存在隐私泄露风险。MosaicLeaks 提出包含 1,001 条多跳研究链的新任务，每条链交错混合本地与公共子",
    deepDive: "",
    category: "ai",
    source: "Hugging Face：Blog（RSS）",
    sourceUrl: "https://huggingface.co/blog/ServiceNow/mosaicleaks",
    publishedAt: "2026-06-18T00:00:00.000Z",
    updatedAt: "2026-06-19T01:06:41.659Z",
    importance: "normal"
  },
  {
    id: "ai-1781831201659-21",
    title: "OpenAI与哈佛等合作研究：o3 Deep Research模型辅助诊断儿童罕见病，额外诊断率4.8%",
    summary: "波士顿儿童医院、哈佛大学与OpenAI合作，在《NEJM AI》发表研究。团队使用OpenAI o3 Deep Research推理模型重新分析376例此前未确",
    deepDive: "",
    category: "ai",
    source: "OpenAI：官网动态（RSS · 排除企业/客户案例）",
    sourceUrl: "https://openai.com/index/diagnose-rare-childhood-diseases",
    publishedAt: "2026-06-18T00:00:00.000Z",
    updatedAt: "2026-06-19T01:06:41.659Z",
    importance: "normal"
  },
  {
    id: "ai-1781831201659-22",
    title: "OpenAI 强化学习实现广泛且持久的有益模型",
    summary: "OpenAI 通过强化学习在真实对话场景中训练模型，使其展现诚实、认知谦逊、元认知透明、可纠正性、普遍公平性和对人类福祉的关心等有益特质。训练数据涵盖健康、教育",
    deepDive: "",
    category: "ai",
    source: "OpenAI：Alignment 研究博客（RSS）",
    sourceUrl: "https://alignment.openai.com/beneficial-rl",
    publishedAt: "2026-06-18T00:00:00.000Z",
    updatedAt: "2026-06-19T01:06:41.659Z",
    importance: "normal"
  },
  {
    id: "ai-1781831201659-23",
    title: "AI 智能体够格吗？在自有工具上评测开源模型",
    summary: "Hugging Face 发布面向 AI 智能体使用场景的基准测试框架，以 transformers 库为案例评估库的智能体友好度。框架使用 pi coding",
    deepDive: "",
    category: "ai",
    source: "Hugging Face：Blog（RSS）",
    sourceUrl: "https://huggingface.co/blog/is-it-agentic-enough",
    publishedAt: "2026-06-18T00:00:00.000Z",
    updatedAt: "2026-06-19T01:06:41.659Z",
    importance: "hot"
  },
  {
    id: "ai-1781831201659-24",
    title: "驾驭 Claude Code：CLAUDE.md、技能、钩子、规则、子智能体等",
    summary: "Claude Code 提供七种自定义指令方式：CLAUDE.md（根目录始终加载，子目录按需加载）、规则（无范围或路径范围）、技能（按需调用，共享 token",
    deepDive: "",
    category: "ai",
    source: "Claude：Blog（网页）",
    sourceUrl: "https://claude.com/blog/steering-claude-code-skills-hooks-rules-subagents-and-more",
    publishedAt: "2026-06-18T00:00:00.000Z",
    updatedAt: "2026-06-19T01:06:41.659Z",
    importance: "normal"
  },
  {
    id: "ai-1781831201659-25",
    title: "超越 LoRA：如何选择最佳参数高效微调技术？",
    summary: "参数高效微调（PEFT）技术中，LoRA 占据绝对主导：Hugging Face Hub 上 20,834 张提及单一 PEFT 技术的模型卡中 20,509 ",
    deepDive: "",
    category: "ai",
    source: "Hugging Face：Blog（RSS）",
    sourceUrl: "https://huggingface.co/blog/peft-beyond-lora",
    publishedAt: "2026-06-18T00:00:00.000Z",
    updatedAt: "2026-06-19T01:06:41.659Z",
    importance: "normal"
  },
  {
    id: "ai-1781831201659-26",
    title: "Cloudflare 发布多阶段漏洞发现工具，详解对抗性审查与上下文绕过技术",
    summary: "Cloudflare 分享了其多阶段漏洞发现工具的技术架构，包含自动化分类循环。该系统通过管理状态控制、引入对抗性审查来压制误报，并围绕 LLM 上下文窗口限制",
    deepDive: "",
    category: "ai",
    source: "Cloudflare Blog",
    sourceUrl: "https://blog.cloudflare.com/build-your-own-vulnerability-harness",
    publishedAt: "2026-06-18T00:00:00.000Z",
    updatedAt: "2026-06-19T01:06:41.659Z",
    importance: "hot"
  },
  {
    id: "ai-1781831201659-27",
    title: "Google 庆祝A2A协议发布一周年：协作智能体生态",
    summary: "Google 庆祝Agent-to-Agent（A2A）协议发布一周年。A2A专为生成式AI设计，相比传统REST API提供安全边界、零上下文污染、动态自主性",
    deepDive: "",
    category: "ai",
    source: "Google Developers Blog（RSS）",
    sourceUrl: "https://developers.googleblog.com/how-a2a-is-building-a-world-of-collaborative-agents",
    publishedAt: "2026-06-18T00:00:00.000Z",
    updatedAt: "2026-06-19T01:06:41.659Z",
    importance: "hot"
  },
  {
    id: "ai-1781831201659-28",
    title: "埃森哲：昔日与今朝，以及它如何预示未来",
    summary: "埃森哲去年九月高调宣称AI将改变其业务，但本季度财报令人失望，股价下跌约18%，本周跌幅近23%，较52周高点已跌超50%。生成式AI并未带来预期的大幅收益，M",
    deepDive: "",
    category: "ai",
    source: "Gary Marcus：The Road to AI We Can Trust（RSS）",
    sourceUrl: "https://garymarcus.substack.com/p/accenture-then-and-now-and-how-it",
    publishedAt: "2026-06-18T00:00:00.000Z",
    updatedAt: "2026-06-19T01:06:41.659Z",
    importance: "normal"
  },
  {
    id: "finance-1781831202916-7",
    title: "沃什新官上任三把火，美联储改革箭在弦上 - 21经济网",
    summary: "###### 2026年06月18日 13:07 21世纪经济报道 21财经APP 王应贵\n\n资料图\n\n南方财经 21世纪经济报道特约撰稿 王应贵\n\n投资者瞩目",
    deepDive: "",
    category: "finance",
    source: "Exa 搜索",
    sourceUrl: "https://www.21jingji.com/article/20260618/herald/7284fb075285cb87baccaa5831a8f3b0.html",
    publishedAt: "2026-06-18T00:00:00.000Z",
    updatedAt: "2026-06-19T01:06:42.916Z",
    importance: "hot"
  },
  {
    id: "finance-1781831202915-5",
    title: "“100%加息”！凌晨，全线跳水！美联储，重大宣布！沃什重磅发声|fomc|美联储政策|点阵图_网易财经",
    summary: "美联储称年内100%加息 美股跳水\n\n0\n\n分享至好友和朋友圈\n\n沃什首秀“鹰风阵阵”。\n\n北京时间6月18日凌晨2点，美联储宣布，将联邦基金利率目标区间维持在",
    deepDive: "",
    category: "finance",
    source: "Exa 搜索",
    sourceUrl: "https://www.163.com/money/article/KVMIPOTR00258105.html",
    publishedAt: "2026-06-17T23:24:40.000Z",
    updatedAt: "2026-06-19T01:06:42.916Z",
    importance: "hot"
  },
  {
    id: "geopolitics-1781831202610-3",
    title: "对特朗普表态感到乐观，希望美采取更多措施，欧洲想把美国拉回俄乌议题|乌克兰|俄乌|俄罗斯|唐纳·川普|唐纳德·特朗普|新总统_手机网易网",
    summary: "【环球时报驻俄罗斯特派记者 隋鑫 环球时报特约记者 吴鸣 董铭】当地时间17日凌晨，七国集团（G7）领导人就地缘政治问题发表联合声明，承诺加大对乌克兰的军事支持",
    deepDive: "",
    category: "geopolitics",
    source: "Exa 搜索",
    sourceUrl: "https://m.163.com/dy/article/KVMG4ES60514R9OJ.html",
    publishedAt: "2026-06-17T22:38:04.000Z",
    updatedAt: "2026-06-19T01:06:42.610Z",
    importance: "hot"
  },
  {
    id: "finance-1781831202915-3",
    title: "沃什首秀震动全球市场！9位官员支持加息、仅1人支持降息：美元急拉50点、黄金暴跌110美元，道指上演倒V反转提供者FX168",
    summary: "夏洛特\n\n关注\n\n0\n\n0\n\n获赞\n\n粉丝\n\n喜欢 0 0收藏举报\n\n— 分享 —\n\n摘要：美联储新任主席沃什（Kevin Warsh）上任后的首次议息会议落下",
    deepDive: "",
    category: "finance",
    source: "Exa 搜索",
    sourceUrl: "https://www.fx168news.com/article/%E7%BE%8E%E8%81%94%E5%82%A8%E6%94%BF%E7%AD%96%E4%BC%9A%E8%AE%AE-1045569",
    publishedAt: "2026-06-17T18:13:52.000Z",
    updatedAt: "2026-06-19T01:06:42.915Z",
    importance: "normal"
  },
  {
    id: "robotics-1781831203220-1",
    title: "人形机器人，批量上岗宁德时代-36氪",
    summary: "Exa搜索（Exa Search）近日宣布完成1700万美元A轮融资，由Lightspeed Venture Partners领投，现有投资者包括Y Combi",
    deepDive: "",
    category: "robotics",
    source: "Exa 搜索",
    sourceUrl: "https://36kr.com/p/3601771715265544",
    publishedAt: "2026-06-17T17:53:30.000Z",
    updatedAt: "2026-06-19T01:06:43.220Z",
    importance: "normal"
  },
  {
    id: "geopolitics-1781831202612-9",
    title: "G7公报：反对改变台海现状 强化对俄制裁 | 乌克兰 | 联合声明 | 川普 | 大纪元",
    summary: "2026年6月16日，在法国埃维昂莱班，美国总统川普、法国总统马克龙、加拿大总理卡尼、意大利总理梅洛尼、日本首相高市早苗、欧盟委员会主席冯德莱恩、欧洲理事会主席",
    deepDive: "",
    category: "geopolitics",
    source: "Exa 搜索",
    sourceUrl: "https://www.epochtimes.com/gb/26/6/17/n14790613.htm",
    publishedAt: "2026-06-17T16:38:59.000Z",
    updatedAt: "2026-06-19T01:06:42.612Z",
    importance: "hot"
  },
  {
    id: "robotics-1781831203221-7",
    title: "刷新权威榜单SOTA！ACE-Ego 解锁“以人为中心”的规模化具身模型训练新范式 - 一起AI技术",
    summary: "刷新权威榜单SOTA！ACE-Ego 解锁“以人为中心”的规模化具身模型训练新范式 - 一起AI技术\n\n首页» 刷新权威榜单SOTA！ACE-Ego 解锁“以人",
    deepDive: "",
    category: "robotics",
    source: "Exa 搜索",
    sourceUrl: "https://17aitech.com/?p=41056",
    publishedAt: "2026-06-17T14:05:56.000Z",
    updatedAt: "2026-06-19T01:06:43.221Z",
    importance: "hot"
  },
  {
    id: "geopolitics-1781831202609-0",
    title: "乌克兰、伊朗、印太局势和全球贸易平衡：看G7峰会关注的地缘政治焦点 - 要闻解说 - RFI - 法国国际广播电台",
    summary: "发表时间： 17/06/2026 - 15:44\n\n周一（6月15号）到周三在法国埃维昂莱班举行的七国集团峰会讨论从国际和平与安全到全球经济稳定、增长和新兴技术",
    deepDive: "",
    category: "geopolitics",
    source: "Exa 搜索",
    sourceUrl: "https://www.rfi.fr/cn/%E4%B8%93%E6%A0%8F%E6%A3%80%E7%B4%A2/%E8%A6%81%E9%97%BB%E8%A7%A3%E8%AF%B4/20260617-g7%E5%B3%B0%E4%BC%9A%E8%81%94%E5%90%88%E5%A3%B0%E6%98%8E%E5%85%B3%E6%B3%A8%E5%9C%B0%E7%BC%98%E6%94%BF%E6%B2%BB%E7%84%A6%E7%82%B9-%E4%B9%8C%E5%85%8B%E5%85%B0-%E4%BC%8A%E6%9C%97-%E5%8D%B0%E5%A4%AA%E5%B1%80%E5%8A%BF%E5%92%8C%E5%85%A8%E7%90%83%E8%B4%B8%E6%98%93%E5%B9%B3%E8%A1%A1",
    publishedAt: "2026-06-17T13:44:43.000Z",
    updatedAt: "2026-06-19T01:06:42.609Z",
    importance: "hot"
  },
  {
    id: "robotics-1781831203220-4",
    title: "矩阵超智：打造中国版擎天柱人形机器人 2027年步入十万台产能-36氪",
    summary: "矩阵超智：打造中国版擎天柱人形机器人 2027年步入十万台产能-36氪\n\n矩阵超智：打造中国版擎天柱人形机器人 2027年步入十万台产能\n\n2026矩阵超智发布",
    deepDive: "",
    category: "robotics",
    source: "Exa 搜索",
    sourceUrl: "https://m.36kr.com/p/3815989447204610",
    publishedAt: "2026-06-17T08:00:38.000Z",
    updatedAt: "2026-06-19T01:06:43.220Z",
    importance: "hot"
  },
  {
    id: "geopolitics-1781831202610-4",
    title: "G7麦克风漏音：马克龙拉着泽连斯基“防”特朗普？西方团结演不下去了_新浪财经_新浪网",
    summary: "G7麦克风漏音：马克龙拉着泽连斯基“防”特朗普？西方团结演不下去了\n\n作为峰会东道主，马克龙的处境堪称如履薄冰。去年加拿大G7峰会上，特朗普提前离场、拒绝签署联",
    deepDive: "",
    category: "geopolitics",
    source: "Exa 搜索",
    sourceUrl: "https://finance.sina.com.cn/wm/2026-06-17/doc-inicsvws5701407.shtml",
    publishedAt: "2026-06-17T04:22:36.000Z",
    updatedAt: "2026-06-19T01:06:42.610Z",
    importance: "normal"
  },
  {
    id: "robotics-1781831203220-3",
    title: "德银大幅上调人形机器人出货预测：2026年翻倍至5万台，2050年剑指700万台_新浪财经_新浪网",
    summary: "德银大幅上调人形机器人出货预测：2026年翻倍至5万台，2050年剑指700万台\n\n德意志银行大幅上调全球人形机器人市场出货预测，将2026年预测值从此前202",
    deepDive: "",
    category: "robotics",
    source: "Exa 搜索",
    sourceUrl: "https://finance.sina.com.cn/stock/hkstock/hkstocknews/2026-06-16/doc-inicrivp4316478.shtml",
    publishedAt: "2026-06-16T13:42:31.000Z",
    updatedAt: "2026-06-19T01:06:43.220Z",
    importance: "hot"
  },
  {
    id: "robotics-1781831203220-2",
    title: "开启中国机器人的“作业模式”_腾讯新闻",
    summary: "Exa搜索（Exa Search）是一家专注于人工智能领域的企业级搜索引擎公司，近期完成了一轮融资，具体金额为1700万美元。本轮融资由Lightspeed V",
    deepDive: "",
    category: "robotics",
    source: "Exa 搜索",
    sourceUrl: "https://news.qq.com/rain/a/20260616A024Z100",
    publishedAt: "2026-06-16T08:34:08.000Z",
    updatedAt: "2026-06-19T01:06:43.220Z",
    importance: "hot"
  },
  {
    id: "robotics-1781831203221-8",
    title: "重点场景不少于20个 国家2026年度人形机器人与具身智能实景实训专项行动通知|宇宙|人工智能|真实场景_网易订阅",
    summary: "0\n\n分享至好友和朋友圈\n\n为深入贯彻党中央、国务院决策部署，落实人形机器人、具身智能产业创新发展有关指导意见和行动方案要求，推动人形机器人与具身智能产品在真实",
    deepDive: "",
    category: "robotics",
    source: "Exa 搜索",
    sourceUrl: "https://www.163.com/dy/article/KVHHL3NF0532N2UB.html",
    publishedAt: "2026-06-16T00:28:26.000Z",
    updatedAt: "2026-06-19T01:06:43.222Z",
    importance: "normal"
  },
  {
    id: "robotics-1781831203220-5",
    title: "场景泛化能力反超主流VLA模型？大晓机器人开源新世界模型，以极小代价直达家庭_腾讯新闻",
    summary: "问AI · 模型在家庭场景的泛化能力源自哪些创新？\n\n整理｜华卫\n\n近日，大晓机器人开悟世界模型（Kairos）同时在 RoboTwin 2.0、LIBERO-",
    deepDive: "",
    category: "robotics",
    source: "Exa 搜索",
    sourceUrl: "https://news.qq.com/rain/a/20260615A054ET00",
    publishedAt: "2026-06-15T13:38:37.000Z",
    updatedAt: "2026-06-19T01:06:43.220Z",
    importance: "hot"
  }
  ],
};

export function getAllNews(): NewsData { return hardcodedData; }
export function getNewsByCategory(category: Category): NewsItem[] {
  return hardcodedData.items
    .filter((item) => item.category === category)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
export function getHotNews(): NewsItem[] {
  return hardcodedData.items
    .filter((item) => item.importance === "hot")
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
export function searchNews(query: string): NewsItem[] {
  const q = query.toLowerCase();
  return hardcodedData.items
    .filter((item) =>
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q)
    )
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
