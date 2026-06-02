import { getAllNews } from "@/lib/news";
import { formatTime } from "@/lib/utils";
import { CATEGORY_LABEL } from "@/types";

export const dynamic = "force-static";

export async function GET() {
  const data = getAllNews();
  const siteUrl = "https://li-news.vercel.app";

  const itemsXml = data.items
    .map(
      (item) => `
    <entry>
      <id>${item.id}</id>
      <title>${escapeXml(item.title)}</title>
      <link href="${item.sourceUrl}" rel="alternate"/>
      <summary type="html">${escapeXml(item.summary)}</summary>
      <category term="${item.category}" label="${CATEGORY_LABEL[item.category]}"/>
      <published>${new Date(item.publishedAt).toISOString()}</published>
      <source>
        <title>${escapeXml(item.source)}</title>
      </source>
    </entry>`
    )
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>\u6728\u5b50\u65b0\u95fb | LI News</title>
  <subtitle>AI, Geopolitics, Finance - Daily News Digest</subtitle>
  <link href="${siteUrl}/feed.xml" rel="self"/>
  <link href="${siteUrl}" rel="alternate"/>
  <updated>${new Date(data.lastUpdated).toISOString()}</updated>
  <author>
    <name>LI News</name>
  </author>
  <id>${siteUrl}</id>
  ${itemsXml}
</feed>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
