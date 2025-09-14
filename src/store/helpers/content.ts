import { ContentItem, Pricing } from "../slices/contentSlice";

export type SortBy = "name" | "priceHigh" | "priceLow";

export function filterItems(
  items: ContentItem[],
  q: string,
  pricing: Pricing[]
): ContentItem[] {
  let filtered = [...items];

  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.userName.toLowerCase().includes(query) ||
        i.title.toLowerCase().includes(query)
    );
  }

  if (pricing.length) {
    filtered = filtered.filter((i) => pricing.includes(i.pricing));
  }

  return filtered;
}

export function sortItems(items: ContentItem[], sortBy: SortBy): ContentItem[] {
  const sorted = [...items];
  if (sortBy === "name") {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "priceHigh") {
    sorted.sort((a, b) => b.price - a.price);
  } else if (sortBy === "priceLow") {
    sorted.sort((a, b) => a.price - b.price);
  }
  return sorted;
}

export function paginateItems(
  items: ContentItem[],
  page: number,
  pageSize: number
): { pageItems: ContentItem[]; hasMore: boolean } {
  const end = page * pageSize;
  return {
    pageItems: items.slice(0, end),
    hasMore: end < items.length,
  };
}
