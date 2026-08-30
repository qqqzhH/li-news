import { getRoboticsNews } from "@/lib/news-robotics";
import NewsCard from "@/components/NewsCard";
import SearchBar from "@/components/SearchBar";

export const dynamic = "force-static";
export const revalidate = 3600;

export default function RoboticsPage() {
  const items = getRoboticsNews();

  return (
    <div className="px-4 sm:px-0 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-border)]">
        <span
          className="flex items-center justify-center w-7 h-7 text-[var(--color-ocean-600)]"
          dangerouslySetInnerHTML={{
            __html: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
          }}
        />
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">机器人</h1>
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
                __html: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
              }}
            />
          </div>
          <p className="text-lg font-medium mb-1">暂无新闻</p>
          <p className="text-sm">有最新机器人新闻时会自动更新</p>
        </div>
      )}

    </div>
  );
}
