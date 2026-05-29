import Link from "next/link";
import { getAllNews, getHotNews, formatTime } from "@/lib/news";
import SearchBar from "@/components/SearchBar";
import { CATEGORIES } from "@/types";

export default function HomePage() {
  const data = getAllNews();
  const hotNews = getHotNews();

  return (
    <div className="space-y-8">
      {/* Hero - 更突出 */}
      <div className="text-center py-10 md:py-16 bg-gradient-to-b from-[var(--color-ocean-50)] to-white rounded-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-[var(--color-ocean-600)]">木子</span>
          <span className="text-[var(--color-text)]">新闻</span>
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm md:text-base max-w-lg mx-auto leading-relaxed">
          AI 动态 · 地缘政治 · 金融市场
        </p>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          每日 9:00 自动更新
          {data.lastUpdated ? ` · 上次更新 ${formatTime(data.lastUpdated)}` : ""}
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <SearchBar large />
      </div>

      {/* 分类统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CATEGORIES.map((cat) => {
          const count = data.items.filter((i) => i.category === cat.key).length;
          return (
            <Link
              key={cat.key}
              href={`/${cat.key}`}
              className="bg-[var(--color-bg-alt)] border border-[var(--color-border)] rounded-xl p-4 text-center hover:border-[var(--color-ocean-300)] transition-colors"
            >
              <div className="text-2xl mb-1">{cat.icon}</div>
              <div className="text-sm font-medium text-[var(--color-text)]">{cat.label}</div>
              <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{count} 条</div>
            </Link>
          );
        })}
      </div>

      {/* 热门推荐 */}
      {hotNews.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-red-50 text-[var(--color-red-accent)] text-xs font-medium">🔥 热门</span>
            推荐阅读
          </h2>
          <div className="space-y-3">
            {hotNews.map((item) => (
              <Link
                key={item.id}
                href={`/${item.category}`}
                className="block bg-white border border-[var(--color-border)] rounded-xl p-4 hover:border-[var(--color-ocean-300)] hover:shadow-sm transition-all"
              >
                <div>
                  <h3 className="text-sm font-medium text-[var(--color-text)]">{item.title}</h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    {item.summary.slice(0, 100)}...
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 最新动态 */}
      <section>
        <h2 className="text-lg font-semibold mb-4">最新动态</h2>
        <div className="space-y-3">
          {data.items.slice(0, 10).map((item) => {
            const catInfo = CATEGORIES.find((c) => c.key === item.category);
            return (
              <Link
                key={item.id}
                href={`/${item.category}`}
                className="flex items-center gap-3 bg-[var(--color-bg-alt)] border border-[var(--color-border)] rounded-xl p-3 hover:border-[var(--color-ocean-300)] transition-colors"
              >
                <span className="text-lg shrink-0">{catInfo?.icon}</span>
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-[var(--color-text)] truncate">{item.title}</h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{formatTime(item.publishedAt)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
