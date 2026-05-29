"use client";

import { NewsItem } from "@/types";
import { formatTime } from "@/lib/utils";
import { useState } from "react";
import { CATEGORIES } from "@/types";

interface NewsCardProps {
  item: NewsItem;
}

export default function NewsCard({ item }: NewsCardProps) {
  const [diveOpen, setDiveOpen] = useState(false);
  const catInfo = CATEGORIES.find((c) => c.key === item.category);

  const catColors: Record<string, { bg: string; text: string }> = {
    ai: { bg: "#dbeafe", text: "#1d4ed8" },
    geopolitics: { bg: "#fce7f3", text: "#be185d" },
    finance: { bg: "#fef3c7", text: "#b45309" },
    other: { bg: "#f3f4f6", text: "#6b7280" },
  };
  const cc = catColors[item.category] || catColors.other;

  const renderDeepDive = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("## ")) {
        return (
          <h3 key={i} className="text-base font-semibold text-[var(--color-text)] mt-4 mb-2">
            {line.replace("## ", "")}
          </h3>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h4 key={i} className="text-sm font-semibold text-[var(--color-text)] mt-3 mb-1">
            {line.replace("### ", "")}
          </h4>
        );
      }
      if (line.startsWith("- **")) {
        const match = line.match(/- \*\*(.+?)\*\*[：:] (.+)/);
        if (match) {
          return (
            <p key={i} className="mb-1">
              <strong className="text-[var(--color-text)]">{match[1]}</strong>: {match[2]}
            </p>
          );
        }
      }
      if (line.startsWith("- ")) {
        return <li key={i} className="ml-4 list-disc mb-1">{line.replace("- ", "")}</li>;
      }
      if (line.trim() === "") return <div key={i} className="h-2" />;
      return <p key={i} className="mb-2">{line}</p>;
    });
  };

  return (
    <article className="news-card bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl p-5 animate-fade-in">
      {/* Meta info */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
          style={{ backgroundColor: cc.bg, color: cc.text }}
        >
          {catInfo?.icon} {catInfo?.label}
        </span>

        {item.importance === "hot" && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-[var(--color-red-accent)]">
            Hot
          </span>
        )}

        <span className="text-xs text-[var(--color-text-muted)] ml-auto">
          {formatTime(item.publishedAt)}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold text-[var(--color-text)] mb-2 leading-snug">
        {item.title}
      </h2>

      {/* Summary */}
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
        {item.summary}
      </p>

      {/* Source */}
      <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-3">
        <span>{item.source}</span>
        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-ocean-600)] hover:underline"
        >
          Source
        </a>
      </div>

      {/* Deep dive toggle */}
      <button
        onClick={() => setDiveOpen(!diveOpen)}
        className="flex items-center gap-1 text-sm text-[var(--color-ocean-600)] hover:text-[var(--color-ocean-700)] font-medium transition-colors"
      >
        <svg
          className={`w-4 h-4 transition-transform ${diveOpen ? "rotate-90" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {diveOpen ? "Collapse" : "Deep Dive"}
      </button>

      {/* Deep dive content */}
      <div className={`deep-dive-content ${diveOpen ? "open" : ""}`}>
        <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
          <div className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {renderDeepDive(item.deepDive)}
          </div>
        </div>
      </div>
    </article>
  );
}
