"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import SearchBar from "@/components/SearchBar";
import NewsCard from "@/components/NewsCard";
import { getAllNews } from "@/lib/news";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    // 客户端搜索：直接过滤本地数据
    const data = getAllNews();
    const q = query.toLowerCase();
    const filtered = data.items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
    setResults(filtered);
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
