"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, Suspense } from "react";
import SearchBar from "@/components/SearchBar";
import NewsCard from "@/components/NewsCard";
import { getAllNews } from "@/lib/news";
import { NewsItem } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  // 客户端搜索：直接过滤本地数据（useMemo 派生，无 effect/setState）
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return getAllNews().items.filter(
      (item: NewsItem) =>
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="px-4 sm:px-0 space-y-6">
      <div className="pb-4 border-b border-[var(--color-border)]">
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-3">搜索新闻</h1>
        <div className="max-w-md">
          <SearchBar initialQuery={query} large />
        </div>
      </div>

      {!query && (
        <div className="text-center py-16 text-[var(--color-text-muted)]">
          <p className="text-lg font-medium mb-1">搜索新闻</p>
          <p className="text-sm">输入关键词搜索所有栏目</p>
        </div>
      )}

      {query && results.length === 0 && (
        <div className="text-center py-16 text-[var(--color-text-muted)]">
          <p className="text-lg font-medium mb-1">未找到结果</p>
          <p className="text-sm">试试其他关键词</p>
        </div>
      )}

      {results.length > 0 && (
        <>
          <p className="text-sm text-[var(--color-text-muted)]">
            找到 {results.length} 条结果
          </p>
          <div className="space-y-4">
            {results.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-[var(--color-text-muted)]">加载中...</div>}>
      <SearchContent />
    </Suspense>
  );
}
