import { ContentItem, Pricing, SortBy } from "@/types";
import { ContentState } from "../slices/productSlice";

export function filterItems(
  items: ContentItem[],
  q: string,
  pricing: Pricing[],
  priceRange?: [number, number]
): ContentItem[] {
  let filtered = [...items];

  if (q) {
    // normalize: lowercase + trim extra spaces
    const query = q.trim().toLowerCase();

    filtered = filtered.filter((i) => {
      const name = i.userName.trim().toLowerCase();
      const title = i.title.trim().toLowerCase();

      // match even if extra spaces exist
      return name.includes(query) || title.includes(query);
    });
  }

  if (pricing.length) {
    filtered = filtered.filter((i) => pricing.includes(i.pricing));
  }

  if (priceRange) {
    const [min, max] = priceRange;
    filtered = filtered.filter((i) => {
      // only meaningful for Paid items, but safe: check price
      const p = Number(i.price ?? 0);
      return p >= min && p <= max;
    });
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

export function applyFiltersAndPagination(state: ContentState) {
  const filtered = filterItems(
    state.allItems,
    state.filters.q,
    state.filters.pricing,
    state.filters.priceRange
  );
  const sorted = sortItems(filtered, state.sortBy);
  const { pageItems, hasMore } = paginateItems(
    sorted,
    state.page,
    state.pageSize
  );

  state.items = pageItems;
  state.hasMore = hasMore;
}
