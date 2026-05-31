import { NextRequest, NextResponse } from "next/server";
import { getAllNews } from "@/lib/news";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";
  const data = getAllNews();

  const query = q.toLowerCase();
  const results = data.items.filter(
    (item) =>
      item.title.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query)
  ).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return NextResponse.json(results);
}
