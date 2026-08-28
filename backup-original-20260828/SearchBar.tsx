"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  initialQuery?: string;
  large?: boolean;
}

export default function SearchBar({ initialQuery = "", large = false }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    },
    [query, router]
  );

  return (
    <form onSubmit={handleSearch} className="relative w-full group">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索新闻..."
        className={`w-full rounded-2xl border border-[var(--color-border)] bg-white pl-12 pr-4 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] shadow-sm focus:shadow-md focus:border-[var(--color-ocean-400)] focus:ring-2 focus:ring-[var(--color-ocean-100)] outline-none transition-all duration-300 ${
          large ? "py-3.5 text-base" : "py-2.5 text-sm"
        }`}
      />
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-ocean-500)] transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </form>
  );
}
