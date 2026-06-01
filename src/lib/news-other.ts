// other category full data — do not edit manually
import { NewsItem } from "@/types";

const items: NewsItem[] = [
  {
    id: "test-1",
    title: "Test Item",
    summary: "国际能源署（IEA）最新发布的《2024年全球能源展望》报告显示，2023年全球可再生能源装机容量新增507吉瓦，同比增长近50%，其中中国贡献了超过60%的新增装机量。报告指出，太阳能光伏和风能成为增长最快的能源来源，太阳能新增装机量达到375吉瓦，风能新增装机量为116吉瓦。IEA执行董事法提赫·比罗尔（Fatih Birol）在发布会上表示：“全球能源转型正在加速，但速度仍不足以实现《巴黎协定》设定的气候目标。”报告预测，到2030年，全球可再生能源装机容量将达到现有水平的三倍，但需要各国进一步加大政策支持力度。此外，化石燃料需求预计将在2030年前达到峰值，其中煤炭需求将在2025年见顶，石油需求在2028年达到峰值，天然气需求则将在2030年后趋于平稳。IEA强调，为实现2050年净零排放目标，全球清洁能源投资需从2023年的1.8万亿美元增至2030年的4.5万亿美元。",
    deepDive: "This is a test with embedded quotes: \"hello\" and “world”",
    category: "other",
    source: "Test",
    sourceUrl: "#",
    publishedAt: "2001-01-01T14:02:10.000Z",
    updatedAt: "2026-05-29T04:06:58.439Z",
    importance: "normal"
  }
];

export function getOtherNews(): NewsItem[] {
  return items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
