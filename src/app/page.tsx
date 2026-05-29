import Link from "next/link";
import { getAllNews, getHotNews, formatTime } from "@/lib/news";
import SearchBar from "@/components/SearchBar";
import { CATEGORIES, CATEGORY_ICONS } from "@/types";

export default function HomePage() {
  const data = getAllNews();
  const hotNews = getHotNews();

  return (
    <div className="space-y-14">
      {/* === 一级：Hero === */}
      <div className="text-center pt-12 pb-10 md:pt-16 md:pb-12">
        <h1 className="text-5xl md:text-6xl font-bold mb-5 tracking-tight">
          <span className="text-[var(--color-ocean-600)]">木子</span>
          <span className="text-[var(--color-text)]">新闻</span>
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm md:text-base max-w-md mx-auto leading-relaxed">
          AI 动态 · 机器人 · 地缘政治 · 金融市场
        </p>
        <div className="mt-2 flex items-center justify-center gap-2 text-xs text-[var(--color-text-muted)]">
          <span>每日 9:00 自动更新</span>
          {data.lastUpdated && (
            <>
              <span className="w-1 h-1 rounded-full bg-[var(--color-text-muted)]" />
              <span>上次更新 {formatTime(data.lastUpdated)}</span>
            </>
          )}
        </div>
      </div>

      {/* 搜索 - 缩小视觉权重 */}
      <div className="max-w-sm mx-auto">
        <SearchBar />
      </div>

      {/* === 二级：分类导览 === */}
      <section>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => {
            const count = data.items.filter((i) => i.category === cat.key).length;
            return (
              <Link
                key={cat.key}
                href={`/${cat.key}`}
                className="category-card bg-white border border-[var(--color-border)] rounded-xl p-5 text-center hover:border-[var(--color-ocean-300)]"
              >
                <div className="flex justify-center mb-3 text-[var(--color-ocean-600)]">
                  <span dangerouslySetInnerHTML={{ __html: CATEGORY_ICONS[cat.key] || "" }} />
                </div>
                <div className="text-sm font-medium text-[var(--color-text)]">{cat.label}</div>
                <div className="text-xs text-[var(--color-text-muted)] mt-1">{count} 条</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* === 二级：热门推荐 === */}
      {hotNews.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-[var(--color-border-light)]" />
            <span className="text-xs font-medium text-[var(--color-text-muted)] tracking-wider uppercase">推荐阅读</span>
            <div className="h-px flex-1 bg-[var(--color-border-light)]" />
          </div>

          <div className="space-y-0 divide-y divide-[var(--color-border-light)] border border-[var(--color-border)] rounded-xl overflow-hidden bg-white">
            {hotNews.slice(0, 6).map((item, idx) => (
              <Link
                key={item.id}
                href={`/${item.category}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--color-ocean-50)] transition-colors"
              >
                {/* 数字编号 */}
                <span
                  className={`flex items-center justify-center w-7 h-7 rounded-lg text-sm font-semibold shrink-0 ${
                    idx < 3
                      ? "bg-red-50 text-red-500"
                      : "bg-gray-50 text-[var(--color-text-muted)]"
                  }`}
                >
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-[var(--color-text)] truncate">{item.title}</h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">{item.summary}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {item.importance === "hot" && idx >= 3 && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-red-50 text-red-500">热门</span>
                  )}
                  <span className="text-xs text-[var(--color-text-muted)]">{formatTime(item.publishedAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* === 三级：最新动态 === */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-[var(--color-border-light)]" />
          <span className="text-xs font-medium text-[var(--color-text-muted)] tracking-wider uppercase">最新动态</span>
          <div className="h-px flex-1 bg-[var(--color-border-light)]" />
        </div>

        <div className="divide-y divide-[var(--color-border-light)] border border-[var(--color-border)] rounded-xl overflow-hidden bg-white">
          {data.items.slice(0, 8).map((item) => {
            const cat = CATEGORIES.find((c) => c.key === item.category);
            return (
              <Link
                key={item.id}
                href={`/${item.category}`}
                className="recent-item flex items-center gap-3 px-5 py-3.5"
              >
                <span
                  className="flex items-center justify-center shrink-0 w-4 h-4 text-[var(--color-ocean-500)]"
                  dangerouslySetInnerHTML={{ __html: CATEGORY_ICONS[item.category] || "" }}
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm text-[var(--color-text)] truncate">{item.title}</h3>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-bg-alt)] text-[var(--color-text-muted)]">
                    {cat?.label}
                  </span>
                  <span className="text-xs text-[var(--color-text-muted)]">{formatTime(item.publishedAt)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 底部留白 */}
      <div className="h-8" />
    </div>
  );
}
