"use client";

import { NewsItem } from "@/types";
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
    // 直接渲染为纯文本格式（兼容 Cloudflare）
    const lines = text.split("\n");
    return lines.map((line, i) => {
      if (line.startsWith("## ")) return <p key={i} className="text-sm font-semibold text-[var(--color-text)] mt-4 mb-2">{line.replace("## ", "")}</p>;
      if (line.startsWith("### ")) return <p key={i} className="text-xs font-semibold text-[var(--color-text)] mt-3 mb-1">{line.replace("### ", "")}</p>;
      if (line.startsWith("- **")) {
        const m = line.match(/- \*\*(.+?)\*\*[：:] (.+)/);
        if (m) return <p key={i} className="mb-1"><strong>{m[1]}</strong>：{m[2]}</p>;
      }
      if (line.startsWith("- ")) return <li key={i} className="ml-4 list-disc mb-1">{line.replace("- ", "")}</li>;
      if (line.trim() === "") return <div key={i} className="h-2" />;
      // 普通行：解析 [文字](链接) 和 *斜体*
      let html = line
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" class="text-blue-600 hover:underline">$1</a>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>');
      return <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: html }} />;
    });
  };

  return (
    <article className="news-card bg-white border border-[var(--color-border)] rounded-xl p-4 sm:p-6 animate-fade-in">
      {/* 元信息 */}
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <span
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
          style={{ backgroundColor: cc.bg, color: cc.text }}
        >
          {catInfo?.label}
        </span>

        {item.importance === "hot" && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-[var(--color-red-accent)]">
            热门
          </span>
        )}

        <span className="text-xs text-[var(--color-text)] font-medium">
          发布 {new Date(item.publishedAt).toLocaleDateString("zh-CN", {
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit"
          })}
        </span>
        <span className="text-xs text-[var(--color-text-muted)] ml-auto">
          更新 {new Date(item.updatedAt).toLocaleDateString("zh-CN", {
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit"
          })}
        </span>
      </div>

      {/* 标题 */}
      <h2 className="text-xl font-semibold text-[var(--color-text)] mb-3 leading-snug">
        {item.title}
      </h2>

      {/* 简介 */}
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
        {item.summary}
      </p>

      {/* 来源 */}
      <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-4">
        <span>{item.source}</span>
        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-ocean-600)] hover:underline"
        >
          原文 ↗
        </a>
      </div>

      {/* 深挖按钮 */}
      <button
        onClick={() => setDiveOpen(!diveOpen)}
        className="flex items-center gap-1.5 text-sm text-[var(--color-ocean-600)] hover:text-[var(--color-ocean-700)] font-medium transition-colors"
      >
        <svg
          className="w-4 h-4 shrink-0"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} points="14 2 14 8 20 8" />
          <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} x1="16" y1="13" x2="8" y2="13" />
          <line strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} x1="16" y1="17" x2="8" y2="17" />
        </svg>
        <svg
          className={`w-3.5 h-3.5 transition-transform ${diveOpen ? "rotate-90" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {diveOpen ? "收起" : "深挖阅读"}
      </button>

      {/* 深挖内容 */}
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
