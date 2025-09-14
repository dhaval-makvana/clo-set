import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { filterItems, sortItems, paginateItems } from "../helpers/content";

export type Pricing = "Paid" | "Free" | "View Only";
export interface ContentItem {
  id: string;
  photo: string;
  userName: string;
  title: string;
  pricing: Pricing;
  price: number;
}

export interface ContentState {
  allItems: ContentItem[];
  items: ContentItem[];
  page: number;
  pageSize: number;
  loading: boolean; // true while fetching from API
  isPaginating: boolean; // true while loading next page locally
  hasMore: boolean;
  filters: {
    q: string;
    pricing: Pricing[];
    priceRange: [number, number];
  };
  sortBy: "name" | "priceHigh" | "priceLow";
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

// Fetch all data once
export const fetchContents = createAsyncThunk<
  void,
  void,
  { state: { content: ContentState } }
>("content/fetch", async (_, thunkAPI) => {
  const state = thunkAPI.getState().content;

  // Avoid duplicate fetches
  if (state.allItems.length > 0) return;

  const res = await axios.get(
    "https://closet-recruiting-api.azurewebsites.net/api/data"
  );
  const all = (res.data as any[]).map((it, idx) => ({
    id: it.id ?? `${it.creator}-${it.title}-${idx}`,
    photo: it.imagePath,
    userName: it.creator,
    title: it.title,
    pricing: mapPricing(it.pricingOption),
    price: it.price,
  }));

  thunkAPI.dispatch(setAllItems(all));
});

// Delay pagination so skeletons show
export const loadNextPage = createAsyncThunk<
  void,
  void,
  { state: { content: ContentState } }
>("content/loadNextPage", async (_, thunkAPI) => {
  thunkAPI.dispatch(startPagination());
  await new Promise((resolve) => setTimeout(resolve, 500)); // simulate network delay
  thunkAPI.dispatch(incPage());
  thunkAPI.dispatch(stopPagination());
});

// Map numeric API pricing option to enum
function mapPricing(option: number): Pricing {
  // Updated mapping: 0 = Paid, 1 = Free, 2 = View Only
  return option === 0 ? "Paid" : option === 1 ? "Free" : "View Only";
}

// Helper: Apply filter/sort/pagination to state
function applyFiltersAndPagination(state: ContentState) {
  const filtered = filterItems(
    state.allItems,
    state.filters.q,
    state.filters.pricing,
    state.filters.priceRange // <-- important
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

// Redux slice
const slice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setAllItems(state, action: PayloadAction<ContentItem[]>) {
      state.allItems = action.payload;

      // ✅ Consider only "Paid" products for max price
      const maxPrice = action.payload
        .filter((item) => item.pricing === "Paid")
        .reduce((max, item) => Math.max(max, item.price), 0);

      state.maxPriceAvailable = maxPrice;

      // only set default price range if current range is the initial placeholder (0,0)
      if (
        state.filters.priceRange[0] === 0 &&
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
    setSortBy(state, action: PayloadAction<"name" | "priceHigh" | "priceLow">) {
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchContents.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchContents.fulfilled, (state) => {
      state.loading = false;
      applyFiltersAndPagination(state);
    });
    builder.addCase(fetchContents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Failed to fetch content";
    });
  },
});

// Export actions and reducer
export const {
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
} = slice.actions;

export default slice.reducer;
