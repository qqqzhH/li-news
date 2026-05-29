import { getNewsByCategory } from "@/lib/news";
import NewsCard from "@/components/NewsCard";
import SearchBar from "@/components/SearchBar";

export const dynamic = "force-static";
export const revalidate = 3600;

export default function GeopoliticsPage() {
  const items = getNewsByCategory("geopolitics");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-border)]">
        <span className="text-3xl">{"\ud83c\udf0d"}</span>
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">\u5730\u7f18\u653f\u6cbb</h1>
          <p className="text-sm text-[var(--color-text-muted)]">{items.length} articles</p>
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
          <div className="text-4xl mb-4">{"\ud83c\udf0d"}</div>
          <p className="text-lg font-medium mb-1">No news yet</p>
          <p className="text-sm">Check back at 9:00 AM for today&apos;s update</p>
        </div>
      )}
    </div>
  );
}
