import Link from "next/link";
import { getAllNews, getHotNews, formatTime } from "@/lib/news";
import SearchBar from "@/components/SearchBar";
import { CATEGORIES } from "@/types";

export default function HomePage() {
  const data = getAllNews();
  const hotNews = getHotNews();
  const totalItems = data.items.length;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          <span className="text-[var(--color-ocean-600)]">\u6728\u5b50</span> \u65b0\u95fb
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm md:text-base max-w-lg mx-auto">
          \u4f60\u7684\u4e2a\u4eba\u667a\u80fd\u65b0\u95fb\u7ad9 \u00b7 \u6bcf\u65e5 9:00 \u81ea\u52a8\u66f4\u65b0
        </p>
        <div className="mt-2 text-xs text-[var(--color-text-muted)]">
          {data.lastUpdated ? `\u6700\u540e\u66f4\u65b0: ${formatTime(data.lastUpdated)}` : ""}
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <SearchBar large />
      </div>

      {/* Stats */}
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
              <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{count} items</div>
            </Link>
          );
        })}
      </div>

      {/* Hot News */}
      {hotNews.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-red-50 text-[var(--color-red-accent)] text-xs font-medium">HOT</span>
            Hot News
          </h2>
          <div className="space-y-3">
            {hotNews.map((item) => (
              <Link
                key={item.id}
                href={`/${item.category}`}
                className="block bg-[var(--color-bg-alt)] border border-[var(--color-border)] rounded-xl p-4 hover:border-[var(--color-ocean-300)] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-[var(--color-red-accent)] mt-0.5 shrink-0">\u25b6</span>
                  <div>
                    <h3 className="text-sm font-medium text-[var(--color-text)]">{item.title}</h3>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                      {item.summary.slice(0, 100)}...
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent across all categories */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Recent News</h2>
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
