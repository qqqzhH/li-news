// Daily news summary — generated once per day, do not edit manually
import { DailySummary } from "@/types";

const summary: DailySummary = {
  date: "2026-08-20",
  lastUpdated: "2026-08-20T13:14:47.157Z",

  coreEvents: `**AI 领域**：Liquid AI 发布 LFM2.5 系列 QAD 量化检查点，恢复 97% 精度损失；Mojo 语言正式开源；OpenAI 推出 ChatGPT for Teens；Anthropic 发布 Claude Science 测试版。**机器人领域**：2026 世界机器人大会在北京开幕，小米人形机器人首次公开亮相，银河通用双足机器人首秀，LG 与 NVIDIA 加速机器人训练合作。**地缘政治**：美伊谈判僵局，特朗普宣布经济战孤立伊朗；莫斯科遭乌克兰 620 架无人机袭击。**金融领域**：美债收益率飙升创 19 年新高，引发全球资产抛售，美股、日韩股市大跌，人民币汇率走强，宇树科技上市。`,

  categoryHighlights: {
    ai: `AI 模型与产品密集发布：Liquid AI 的 QAD 量化检查点、Mojo 开源、ChatGPT for Teens、Claude Science 等，展示 AI 在效率、安全、科学研究的多元进展。`,

    robotics: `世界机器人大会成焦点，小米、银河通用等展示人形机器人新品；LG 与 NVIDIA 合作推动 10 万小时训练数据；宇树科技上市引发市场关注。`,

    geopolitics: `美伊冲突升级，美国宣布经济战，阿联酋暂停与伊贸易；俄乌冲突持续，莫斯科遭大规模无人机袭击，地缘风险加剧。`,

    finance: `美债收益率创 19 年新高，引发全球债市、股市震荡；黄金、白银、比特币齐涨；人民币汇率走强，A 股面临压力测试。`,

    other: `今日暂无其他要闻分类中的重要新闻条目。`,
  },

  aiAnalysis: {
    geopolitics: `**一、AI 成为地缘博弈新工具**
美国对伊朗的经济战与 AI 技术结合，通过数据监控和预测模型强化制裁效果。同时，AI 在军事领域的应用加速，如无人机袭击的自主化，使得冲突形态改变。AI 技术的地缘政治属性日益凸显，各国竞相发展 AI 以维护自身安全。`,

    finance: `**二、AI 投资与金融市场波动**
美债收益率飙升反映市场对 AI 投资回报的担忧，AI 硬件股受挫。然而，AI 技术仍吸引大量资本，如 Exa 融资、宇树科技上市等。市场在 AI 泡沫论与长期增长预期之间摇摆，投资者需警惕高估值风险。`,
  },

  todayJudgment: [
    "AI 模型开源与量化技术降低部署门槛，但地缘冲突可能拖累全球科技合作。",
    "机器人大会展示产业进步，但商业化落地与成本控制仍是关键挑战。",
    "美债收益率飙升冲击全球资产，AI 板块估值面临重估压力。",
    "美伊紧张与俄乌冲突升级，地缘风险溢价持续推高油价与避险资产。",
  ],
};

export function getDailySummary(): DailySummary {
  return summary;
}
