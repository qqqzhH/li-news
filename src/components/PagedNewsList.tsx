"use client";

import { useState } from "react";
import { NewsItem } from "@/types";
import NewsCard from "@/components/NewsCard";

const PAGE_SIZE = 50;

// 分类页列表分页：静态导出下首屏只渲染最近 50 张卡（HTML 仍含全量数据，
// 此处解决的是 DOM 节点数与首屏渲染压力，数据体积属架构级问题另立项）
export default function PagedNewsList({ items }: { items: NewsItem[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = items.slice(0, visible);

  return (
    <div className="space-y-4">
      {shown.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
      {visible < items.length && (
        <div className="flex justify-center py-6">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="px-6 py-2.5 rounded-xl border border-[var(--color-border)] bg-white text-sm font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-ocean-400)] hover:text-[var(--color-ocean-600)] hover:shadow-md transition-all"
          >
            加载更多（还有 {items.length - visible} 条）
          </button>
        </div>
      )}
    </div>
  );
}
