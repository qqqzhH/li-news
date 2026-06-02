// other category full data — do not edit manually
import { NewsItem } from "@/types";

const items: NewsItem[] = [

];

export function getOtherNews(): NewsItem[] {
  return items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
