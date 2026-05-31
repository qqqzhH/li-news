"use client";

import { NewsItem } from "@/types";
import { useState, useRef, useEffect } from "react";
import { CATEGORIES } from "@/types";

interface NewsCardProps {
  item: NewsItem;
}

export default function NewsCard({ item }: NewsCardProps) {
  const [diveOpen, setDiveOpen] = useState(false);
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [summaryOverflows, setSummaryOverflows] = useState(false);
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const catInfo = CATEGORIES.find((c) => c.key === item.category);

  const catColors: Record<string, { bg: string; text: string }> = {
    ai: { bg: "#dbeafe", text: "#1d4ed8" },
    geopolitics: { bg: "#fce7f3", text: "#be185d" },
    finance: { bg: "#fef3c7", text: "#b45309" },
    other: { bg: "#f3f4f6", text: "#6b7280" },
  };
  const cc = catColors[item.category] || catColors.other;

  // 检测简介是否超过 2 行 — 用 inline style 测量，不与 React className 冲突
  useEffect(() => {
    const el = summaryRef.current;
    if (!el) return;
    // 临时取消 clamp 测满高，再用 inline style 恢复
    el.style.webkitLineClamp = "unset";
    const fullHeight = el.scrollHeight;
    el.style.webkitLineClamp = "2";
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
    setSummaryOverflows(fullHeight > lineHeight * 2.1);
  }, [item.summary]);

  const renderDeepDive = (text: string) => {
    // 先拆分段落（双换行）
    const paragraphs = text.split(/\n{2,}/);
    const elements: React.ReactNode[] = [];
    
    paragraphs.forEach((para, pi) => {
      const lines = para.split("\n");
      lines.forEach((line, li) => {
        const key = `${pi}-${li}`;
        
        // 标题
        if (line.startsWith("## ")) {
          elements.push(<p key={key} className="text-sm font-semibold text-[var(--color-text)] mt-4 mb-2">{line.replace("## ", "")}</p>);
          return;
        }
        if (line.startsWith("### ")) {
          elements.push(<p key={key} className="text-xs font-semibold text-[var(--color-text)] mt-3 mb-1">{line.replace("### ", "")}</p>);
          return;
        }
        
        // 数字列表项：1. 2. 3.
        if (/^\d+[\.\、]/.test(line.trimStart())) {
          elements.push(<p key={key} className="ml-2 mb-1">{renderInlineFormat(line.trimStart())}</p>);
          return;
        }
        
        // 破折号列表项
        if (line.trimStart().startsWith("- ")) {
          elements.push(<li key={key} className="ml-4 list-disc mb-1">{renderInlineFormat(line.replace(/^\s*-\s*/, ""))}</li>);
          return;
        }
        
        // 星号列表项
        if (/^\s*\*\s/.test(line) && !/^\s*\*\*/.test(line)) {
          elements.push(<li key={key} className="ml-4 list-disc mb-1">{renderInlineFormat(line.replace(/^\s*\*\s*/, ""))}</li>);
          return;
        }
        
        // 空行
        if (line.trim() === "") {
          elements.push(<div key={key} className="h-2" />);
          return;
        }
        
        // 普通行
        elements.push(<p key={key} className="mb-2">{renderInlineFormat(line)}</p>);
      });
      
      // 段落间加间距
      if (pi < paragraphs.length - 1) {
        elements.push(<div key={`spacer-${pi}`} className="h-3" />);
      }
    });
    
    return elements;
  };
  
  // 行内格式渲染：**粗体** *斜体* [链接](url)
  const renderInlineFormat = (text: string): React.ReactNode => {
    // 先处理 **粗体**，再处理 *斜体*，再处理链接
    const parts: React.ReactNode[] = [];
    // 正则：匹配 **text** 或 [text](url) 或普通文本
    const regex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(\[(.+?)\]\((.+?)\))|([^*[\n]+)/g;
    let match;
    let lastIndex = 0;
    
    while ((match = regex.exec(text)) !== null) {
      if (match[1]) {
        // **粗体**
        parts.push(<strong key={match.index}>{match[2]}</strong>);
      } else if (match[3]) {
        // *斜体*
        parts.push(<em key={match.index}>{match[4]}</em>);
      } else if (match[5]) {
        // [文字](链接)
        parts.push(<a key={match.index} href={match[7]} target="_blank" rel="noopener noreferrer" className="text-[var(--color-ocean-600)] hover:underline">{match[6]}</a>);
      } else if (match[8]) {
        // 普通文本
        parts.push(<span key={match.index}>{match[8]}</span>);
      }
    }
    
    return parts.length > 0 ? <>{parts}</> : text;
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

      {/* 简介 — 默认2行折叠 */}
      <p
        ref={summaryRef}
        className={`text-sm text-[var(--color-text-secondary)] leading-relaxed mb-2 ${!summaryExpanded ? "line-clamp-2" : ""}`}
      >
        {item.summary}
      </p>
      {summaryOverflows && (
        <button
          onClick={() => setSummaryExpanded(!summaryExpanded)}
          className="flex items-center gap-1 text-xs text-[var(--color-ocean-600)] hover:text-[var(--color-ocean-700)] font-medium transition-colors mb-4"
        >
          <svg
            className={`w-3 h-3 transition-transform ${summaryExpanded ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {summaryExpanded ? "收起" : "更多内容"}
        </button>
      )}
      {!summaryOverflows && <div className="mb-4" />}

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
