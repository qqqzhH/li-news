// Daily news summary — generated once per day, do not edit manually
import { DailySummary } from "@/types";

const summary: DailySummary = {
  date: "2026-08-19",
  lastUpdated: "2026-08-19T15:37:35.118Z",

  coreEvents: `**AI领域**：Mojo语言正式开源，OpenAI推出ChatGPT for Teens，Anthropic发布Claude Science，AI应用持续拓展。**机器人领域**：小米人形机器人将首秀世界机器人大会，LG与NVIDIA合作推进机器人训练，宇树科技上市首日大涨。**地缘政治**：伊朗宣布美军已被驱逐出波斯湾等海域，美伊紧张局势升级；韩美联合军演缩减规模。**金融市场**：美债收益率飙升，30年期美债收益率创近20年新高，全球股市承压，日韩股市暴跌。`,

  categoryHighlights: {
    ai: `AI领域动态密集：Mojo语言开源，OpenAI推出青少年版ChatGPT，Anthropic发布Claude Science，OpenRouter推出新功能，Claude Code更新，Claude集成Gmail和Google Drive，Sentence Transformers新增多向量编码器。`,

    robotics: `机器人行业热度高涨：小米人形机器人即将亮相，LG与NVIDIA合作推进10万小时训练，香港企业发布可搬运50公斤的人形机器人，宇树科技上市，世界人形机器人运动会即将开幕。`,

    geopolitics: `地缘政治紧张：伊朗宣称美军已被驱逐，不得进入霍尔木兹海峡；美伊停火谈判到期，美国未能体面退出；韩美联合军演缩减；美军撤走亚太航母引发关注。`,

    finance: `金融市场动荡：美债收益率飙升，30年期美债收益率创近20年新高，引发全球风险资产承压；美股三连跌，日韩股市暴跌，存储芯片逆势爆发。`,

    other: `今日暂无其他要闻分类中的重要新闻条目。`,
  },

  aiAnalysis: {
    geopolitics: `**一、AI成为地缘博弈新工具**
美国对伊朗的施压不仅限于军事，还体现在科技领域。OpenAI等美国AI公司对伊朗的制裁限制，以及伊朗试图发展自主AI能力，都反映AI技术正成为地缘政治博弈的重要筹码。伊朗宣称驱逐美军，背后也有展示自身科技实力的意图。
**二、AI加剧信息战与认知战**
在美伊对峙中，双方利用AI生成内容进行舆论宣传，AI换脸、虚假信息传播等成为新手段。伊朗的强硬声明和美国的回应，都通过AI加速传播，影响国际认知。这提示国际社会需警惕AI在冲突中的负面应用。`,

    finance: `**一、AI泡沫与美债收益率飙升的联动**
美债收益率飙升，尤其是30年期美债收益率创近20年新高，对高估值的AI科技股构成压力。费城半导体指数暴跌，AI牛股齐跌，市场担忧AI投资回报周期过长，高利率环境下融资成本上升，AI泡沫风险加剧。
**二、存储芯片逆势爆发与AI需求**
尽管整体市场下跌，但存储芯片板块逆势上涨，闪迪大涨近9%，兆易创新等业绩亮眼。这反映AI对存储需求的强劲拉动，但市场对AI的过度乐观也可能导致短期波动。投资者需关注AI产业链的业绩兑现能力。`,
  },

  todayJudgment: [
    "美债收益率飙升，全球资产定价锚动摇，AI泡沫面临考验。",
    "小米人形机器人亮相在即，机器人赛道竞争白热化。",
    "伊朗驱逐美军言论加剧地缘风险，油价高企冲击经济。",
    "AI应用加速落地，但安全与伦理问题亟待解决。",
  ],
};

export function getDailySummary(): DailySummary {
  return summary;
}
