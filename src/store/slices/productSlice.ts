import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { applyFiltersAndPagination } from "../helpers/content";
import { ContentItem, Pricing, SortBy } from "@/types";

export interface ContentState {
  allItems: ContentItem[];
  items: ContentItem[];
  page: number;
  pageSize: number;
  loading: boolean;
  isPaginating: boolean;
  hasMore: boolean;
  filters: {
    q: string;
    pricing: Pricing[];
    priceRange: [number, number];
  };
  sortBy: SortBy;
  error?: string | null;
  maxPriceAvailable: number;
}

const initialState: ContentState = {
  allItems: [],
  items: [],
  page: 1,
  pageSize: 12,
  loading: false,
  isPaginating: false,
  hasMore: true,
  filters: {
    q: "",
    pricing: [],
    priceRange: [0, Infinity],
  },
  sortBy: "name",
  error: null,
  maxPriceAvailable: 0,
};

const slice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAllItems(state, action: PayloadAction<ContentItem[]>) {
      state.allItems = action.payload;

      // Consider only "Paid" products for max price
      const maxPrice = action.payload
        .filter((item) => item.pricing === "Paid")
        .reduce((max, item) => Math.max(max, item.price), 0);

      state.maxPriceAvailable = maxPrice;

      // Ensure priceRange is numeric (avoid Infinity)
      if (
        !Number.isFinite(state.filters.priceRange[1]) ||
        state.filters.priceRange[1] === 0
      ) {
        state.filters.priceRange = [0, maxPrice];
      }

      state.page = 1;
      applyFiltersAndPagination(state);
    },
    setQuery(state, action: PayloadAction<string>) {
      state.filters.q = action.payload;
      state.page = 1;
      applyFiltersAndPagination(state);
    },
    togglePricing(state, action: PayloadAction<Pricing>) {
      const p = action.payload;
      const idx = state.filters.pricing.indexOf(p);
      idx >= 0
        ? state.filters.pricing.splice(idx, 1)
        : state.filters.pricing.push(p);
      state.page = 1;
      applyFiltersAndPagination(state);
    },
    setPriceRange(state, action: PayloadAction<[number, number]>) {
      state.filters.priceRange = action.payload;
      state.page = 1;
      applyFiltersAndPagination(state);
    },
    resetFilters(state) {
      state.filters = {
        q: "",
        pricing: [],
        priceRange: [0, state.maxPriceAvailable],
      };
      state.page = 1;
      applyFiltersAndPagination(state);
    },
    incPage(state) {
      state.page += 1;
      applyFiltersAndPagination(state);
    },
    setPageFromUrl(
      state,
      action: PayloadAction<{
        q: string;
        pricing: Pricing[];
        priceRange?: [number, number];
      }>
    ) {
      state.filters.q = action.payload.q;
      state.filters.pricing = action.payload.pricing;
      if (action.payload.priceRange) {
        state.filters.priceRange = action.payload.priceRange;
      } else if (
        state.maxPriceAvailable > 0 &&
        state.filters.priceRange[0] === 0 &&
        state.filters.priceRange[1] === 0
      ) {
        state.filters.priceRange = [0, state.maxPriceAvailable];
      }
      state.page = 1;
      applyFiltersAndPagination(state);
    },
    setSortBy(state, action: PayloadAction<SortBy>) {
      state.sortBy = action.payload;
      state.page = 1;
      applyFiltersAndPagination(state);
    },
    startPagination(state) {
      state.isPaginating = true;
    },
    stopPagination(state) {
      state.isPaginating = false;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setAllItems,
  setQuery,
  togglePricing,
  resetFilters,
  incPage,
  setPageFromUrl,
  setSortBy,
  startPagination,
  stopPagination,
  setPriceRange,
  setError,
} = slice.actions;

export default slice.reducer;
