import { getFinanceNews } from "@/lib/news-finance";
import NewsCard from "@/components/NewsCard";
import SearchBar from "@/components/SearchBar";

export const dynamic = "force-static";
export const revalidate = 3600;

export default function FinancePage() {
  const items = getFinanceNews();

  return (
    <div className="px-4 sm:px-0 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-border)]">
        <span
          className="flex items-center justify-center w-7 h-7 text-[var(--color-ocean-600)]"
          dangerouslySetInnerHTML={{
            __html: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
          }}
        />
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">金融市场</h1>
          <p className="text-sm text-[var(--color-text-muted)]">{items.length} 条</p>
        </div>
      </div>

      <div className="max-w-md">
        <SearchBar />
      </div>

      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-[var(--color-text-muted)]">
          <div className="flex justify-center mb-4 text-[var(--color-ocean-300)]">
            <span
              dangerouslySetInnerHTML={{
                __html: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
              }}
            />
          </div>
          <p className="text-lg font-medium mb-1">暂无新闻</p>
          <p className="text-sm">每日 9:00 自动更新，敬请期待</p>
        </div>
      )}

    </div>
  );
}
