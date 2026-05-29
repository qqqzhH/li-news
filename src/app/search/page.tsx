"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import SearchBar from "@/components/SearchBar";
import NewsCard from "@/components/NewsCard";
import { NewsItem } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((data) => setResults(data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[var(--color-border)]">
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-3">Search</h1>
        <div className="max-w-md">
          <SearchBar initialQuery={query} large />
        </div>
      </div>

      {loading && (
        <div className="text-center py-16 text-[var(--color-text-muted)]">
          <p>Searching...</p>
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div className="text-center py-16 text-[var(--color-text-muted)]">
          <div className="text-4xl mb-4">{"\ud83d\udd0d"}</div>
          <p className="text-lg font-medium mb-1">No results</p>
          <p className="text-sm">Try a different search term</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <p className="text-sm text-[var(--color-text-muted)]">
            {results.length} results for &quot;{query}&quot;
          </p>
          <div className="space-y-4">
            {results.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}

      {!query && (
        <div className="text-center py-16 text-[var(--color-text-muted)]">
          <div className="text-4xl mb-4">{"\ud83d\udd0d"}</div>
          <p className="text-lg font-medium mb-1">Search the news</p>
          <p className="text-sm">Type above to search across all categories</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-16">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
