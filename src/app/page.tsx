"use client";

import Link from "next/link";
import { getAllNews } from "@/lib/news";
import { getDailySummary } from "@/lib/daily-summary";
import { formatTime } from "@/lib/utils";
import SearchBar from "@/components/SearchBar";
import { CATEGORIES, CATEGORY_ICONS } from "@/types";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

// Daily quotes - cycles based on date
const QUOTES = [
  { text: "信息筛选的能力，比信息获取的能力更重要", author: "" },
  { text: "新闻是历史的初稿", author: "菲利普·格雷厄姆" },
  { text: "在信息爆炸的时代，安静是一种力量", author: "" },
  { text: "读新闻的人，看到的是世界", author: "" },
  { text: "好的问题比好的答案更有价值", author: "" },
  { text: "每一天都是一张白纸，新闻是今天的笔迹", author: "" },
  { text: "理解世界，从阅读开始", author: "" },
  { text: "知天下事，方能立其身", author: "" },
  { text: "视野决定格局，新闻打开视野", author: "" },
  { text: "深度比速度更重要", author: "" },
  { text: "不要只读标题，要读内容", author: "" },
  { text: "信息自由是思想自由的前提", author: "" },
  { text: "保持好奇，保持质疑", author: "" },
  { text: "世界很大，新闻很近", author: "" },
  { text: "独立思考，从多元信息开始", author: "" },
  { text: "让信息为你所用，而非被信息淹没", author: "" },
  { text: "知识就是力量，新闻是知识的入口", author: "" },
  { text: "听见不同的声音，看见更远的地方", author: "" },
  { text: "新闻告诉你发生了什么，思考告诉你为什么", author: "" },
  { text: "阅读新闻，连接世界", author: "" },
  { text: "在变化中寻找不变", author: "" },
  { text: "事实是最好的论据", author: "" },
  { text: "每一个新闻背后，都有一个世界", author: "" },
  { text: "清醒的头脑，从阅读开始", author: "" },
  { text: "信息时代，选择看什么比看多少更重要", author: "" },
  { text: "理解不同，才能理解世界", author: "" },
  { text: "新闻是通向世界的窗口", author: "" },
  { text: "用信息武装自己，用思考照亮前路", author: "" },
  { text: "广度与深度，缺一不可", author: "" },
  { text: "在喧嚣中寻找真相", author: "" },
  { text: "阅读新闻，不仅是为了知道，更是为了理解", author: "" },
];

function getDailyQuote() {
  const today = new Date().toISOString().slice(0, 10); // "2026-05-30"
  const hash = today.split("-").reduce((s, n) => s + parseInt(n), 0);
  return QUOTES[hash % QUOTES.length];
}

export default function HomePage() {
  const data = getAllNews();
  const summary = getDailySummary();
  const quote = getDailyQuote();

  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const updRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const catsRef = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(titleRef.current, { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(subtitleRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2")
      .fromTo(updRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 }, "-=0.15")
      .fromTo(quoteRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.1")
      .fromTo(searchRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 }, "-=0.1")
      .fromTo(".cat-card", { opacity: 0, y: 12, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.06 }, "-=0.15");

    // Typewriter effect for daily quote
    setTimeout(() => {
      const qEl = document.querySelector(".quote-text") as HTMLElement | null;
      if (!qEl) return;
      const fullText = qEl.getAttribute("data-text") || "";
      qEl.textContent = "";
      let i = 0;
      const tw = setInterval(() => {
        if (i < fullText.length) {
          qEl.textContent += fullText[i];
          i++;
        } else {
          clearInterval(tw);
        }
      }, 50);
    }, 600);

    let cleanupScroll: (() => void) | undefined;
    const s2 = section2Ref.current;
    if (s2) {
      const check = () => {
        const r = s2.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.85) {
      gsap.fromTo(".daily-summary", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
          cleanupScroll?.();
        }
      };
      window.addEventListener("scroll", check, { passive: true });
      cleanupScroll = () => window.removeEventListener("scroll", check);
      check();
    }

    // 接管滚轮：目标索引法，不管滚多快都只滑到正确的目标页
    let cleanupWheel: (() => void) | undefined;
    const container = document.querySelector(".snap-container") as HTMLElement | null;
    if (container) {
      const sections = container.querySelectorAll("section");
      const totalSections = sections.length;
      let targetIndex = 0;
      let animating = false;

      // 根据当前滚动位置同步 targetIndex
      const syncTarget = () => {
        if (animating) return;
        targetIndex = Math.round(container.scrollTop / window.innerHeight);
        targetIndex = Math.max(0, Math.min(targetIndex, totalSections - 1));
      };
      syncTarget();

      const scrollToTarget = () => {
        animating = true;
        sections[targetIndex].scrollIntoView({ behavior: "smooth" });
        // 等动画结束后恢复
        setTimeout(() => { animating = false; syncTarget(); }, 500);
      };

      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        // 根据滚动方向更新目标
        if (e.deltaY > 0) {
          targetIndex = Math.min(targetIndex + 1, totalSections - 1);
        } else if (e.deltaY < 0) {
          targetIndex = Math.max(targetIndex - 1, 0);
        }
        scrollToTarget();
      };
      container.addEventListener("wheel", onWheel, { passive: false });
      cleanupWheel = () => container.removeEventListener("wheel", onWheel);
    }

    return () => {
      cleanupScroll?.();
      cleanupWheel?.();
    };
  }, []);

  return (
    <div className="snap-container space-y-0">

      {/* ===== Screen 1: Hero ===== */}
      <section data-section="home" className="h-screen flex flex-col items-center px-4 md:px-16 max-w-4xl mx-auto w-full overflow-hidden">

        <div className="flex-1 min-h-0 flex flex-col justify-center items-center w-full pt-8 pb-4">
          {/* Title */}
          <div className="text-center">
            <h1 ref={titleRef} className="text-4xl sm:text-7xl md:text-8xl font-black tracking-wide leading-none">
              <span className="text-[var(--color-ocean-600)]">木子</span>
              <span className="text-[var(--color-text)]">新闻</span>
            </h1>
            <p ref={subtitleRef} className="mt-3 sm:mt-5 text-xs sm:text-base text-[var(--color-text-muted)] max-w-md mx-auto">
              AI 动态 · 机器人 · 地缘政治 · 金融市场
            </p>
            <div ref={updRef} className="mt-3 text-xs text-[var(--color-text-muted)]/60">
              <span>每日 9:00 自动更新</span>
              {data.lastUpdated && (
                <>
                  <span className="mx-1.5 inline-block w-0.5 h-0.5 rounded-full bg-[var(--color-text-muted)]/40 align-middle" />
                  <span>上次更新 {formatTime(data.lastUpdated)}</span>
                </>
              )}
            </div>
          </div>

          {/* Quote - daily */}
          <div ref={quoteRef} className="mt-6 sm:mt-8 text-center">
            <div className="inline-block px-4 sm:px-8 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-[var(--color-ocean-50)] to-blue-50 border border-[var(--color-ocean-100)] shadow-sm">
              <p className="quote-text text-sm sm:text-lg text-[var(--color-ocean-700)] font-serif italic leading-relaxed tracking-wide" data-text={quote.text}>
                <span className="text-2xl text-[var(--color-ocean-400)] leading-none mr-2">&ldquo;</span>
                {quote.text}
                <span className="text-2xl text-[var(--color-ocean-400)] leading-none ml-2">&rdquo;</span>
              </p>
              {quote.author && (
                <p className="text-xs text-[var(--color-text-muted)] mt-1.5">&mdash; {quote.author}</p>
              )}
            </div>
          </div>

          {/* Search */}
          <div ref={searchRef} className="mt-6 sm:mt-8 max-w-sm mx-auto w-full px-4 sm:px-0">
            <SearchBar large />
          </div>

          {/* Category cards */}
          <div ref={catsRef} className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 max-w-3xl mx-auto w-full px-4 sm:px-0">
            {CATEGORIES.map((cat) => {
              const count = data.items.filter((i) => i.category === cat.key).length;
              return (
                <Link key={cat.key} href={`/${cat.key}`}
                  className="cat-card bg-white border border-[var(--color-border)] rounded-xl py-2 sm:py-3 px-2 text-center hover:border-[var(--color-ocean-400)] hover:shadow-lg hover:-translate-y-1.5 transition-all duration-250"
                >
                  <div className="flex justify-center mb-1 sm:mb-2 text-[var(--color-ocean-500)]">
                    <span className="scale-75 sm:scale-100" dangerouslySetInnerHTML={{ __html: CATEGORY_ICONS[cat.key] || "" }} />
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-[var(--color-text)]">{cat.label}</div>
                  <div className="text-[11px] text-[var(--color-text-muted)] mt-1">{count} 条</div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 探索 */}
        <div
          onClick={() => section2Ref.current?.scrollIntoView({ behavior: "smooth" })}
          className="flex flex-col items-center gap-1 mb-6 sm:mb-8 text-[var(--color-text-muted)]/50 hover:text-[var(--color-ocean-500)] transition-colors cursor-pointer"
        >
          <span className="text-xs tracking-widest">探索</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

      </section>

      {/* ===== Screen 2: 今日新闻总结 ===== */}
      <section data-section="summary" className="min-h-screen flex flex-col py-6 sm:py-16 px-4 sm:px-8 md:px-16" ref={section2Ref}>
        <div className="max-w-4xl mx-auto w-full">
          {/* Section header — left-aligned */}
          <div className="mb-6 sm:mb-10">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-6 sm:h-8 bg-[var(--color-ocean-600)] rounded-full" />
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-[var(--color-text)] tracking-tight">今日新闻总结</h2>
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] ml-4 sm:ml-5">{summary.date} · 每日 9:00 更新</p>
          </div>

          {/* Content */}
          <div className="daily-summary space-y-8 sm:space-y-12">
            {/* 一、今日核心事件 */}
            <SectionBlock title="一、今日核心事件">
              <ContentText text={summary.coreEvents} />
            </SectionBlock>

            {/* 二、分类要点 */}
            <SectionBlock title="二、分类要点">
              <div className="space-y-5 sm:space-y-7">
                <CatSection title="AI 动态" color="var(--color-ocean-600)">
                  <ContentText text={summary.categoryHighlights.ai} />
                </CatSection>
                <CatSection title="机器人" color="#16a34a">
                  <ContentText text={summary.categoryHighlights.robotics} />
                </CatSection>
                <CatSection title="地缘政治" color="#dc2626">
                  <ContentText text={summary.categoryHighlights.geopolitics} />
                </CatSection>
                <CatSection title="金融市场" color="#ca8a04">
                  <ContentText text={summary.categoryHighlights.finance} />
                </CatSection>
                <CatSection title="其他要闻" color="var(--color-text-muted)">
                  <ContentText text={summary.categoryHighlights.other} />
                </CatSection>
              </div>
            </SectionBlock>

            {/* 三、AI 分析 */}
            <SectionBlock title="三、AI 分析">
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-[var(--color-text)] mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-red-500 rounded-full inline-block" />
                    地缘政治
                  </h4>
                  <ContentText text={summary.aiAnalysis.geopolitics} />
                </div>
                <div className="border-t border-[var(--color-border)] pt-6 sm:pt-8">
                  <h4 className="text-base sm:text-lg font-bold text-[var(--color-text)] mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-amber-500 rounded-full inline-block" />
                    金融市场
                  </h4>
                  <ContentText text={summary.aiAnalysis.finance} />
                </div>
              </div>
            </SectionBlock>

            {/* 四、今日判断 */}
            <SectionBlock title="四、今日判断">
              <ul className="space-y-2 sm:space-y-3">
                {summary.todayJudgment.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm sm:text-base leading-relaxed text-[var(--color-text-secondary)]">
                    <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-[var(--color-ocean-50)] text-[var(--color-ocean-600)] text-xs font-bold flex items-center justify-center">{idx + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </SectionBlock>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Helper components for daily summary ───

/** Top-level section with numbered heading */
function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-base sm:text-xl font-black text-[var(--color-text)] mb-3 sm:mb-5 pb-2 sm:pb-3 border-b border-[var(--color-border)]">
        {title}
      </h3>
      {children}
    </div>
  );
}

/** Category sub-section with colored label */
function CatSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm sm:text-base font-bold mb-2 flex items-center gap-2" style={{ color }}>
        <span className="w-1.5 h-1.5 rounded-full inline-block shrink-0" style={{ backgroundColor: color }} />
        {title}
      </h4>
      {children}
    </div>
  );
}

/** Renders markdown-style multi-paragraph text */
function ContentText({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  return (
    <div className="text-sm sm:text-base leading-relaxed text-[var(--color-text-secondary)] space-y-3 sm:space-y-4">
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}
