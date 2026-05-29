import { getNewsByCategory } from "@/lib/news";
import NewsCard from "@/components/NewsCard";
import SearchBar from "@/components/SearchBar";

export const dynamic = "force-static";
export const revalidate = 3600;

export default function AiPage() {
  const items = getNewsByCategory("ai");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-border)]">
        <span
          className="flex items-center justify-center w-7 h-7 text-[var(--color-ocean-600)]"
          dangerouslySetInnerHTML={{
            __html: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 2-2 3-4 5-2-2-4-3-4-5a4 4 0 0 1 4-4z"/><path d="M12 12v6"/><circle cx="12" cy="19" r="3"/></svg>',
          }}
        />
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">AI 动态</h1>
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
                __html: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 2-2 3-4 5-2-2-4-3-4-5a4 4 0 0 1 4-4z"/><path d="M12 12v6"/><circle cx="12" cy="19" r="3"/></svg>',
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
