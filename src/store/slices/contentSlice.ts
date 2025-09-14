import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export type Pricing = "Paid" | "Free" | "View Only";

export interface ContentItem {
  id: string;
  photo: string;
  userName: string;
  title: string;
  pricing: Pricing;
  price: number;
}

interface ContentState {
  allItems: ContentItem[];
  items: ContentItem[];
  page: number;
  pageSize: number;
  loading: boolean;
  hasMore: boolean;
  filters: {
    q: string;
    pricing: Pricing[];
  };
  error?: string | null;
}

const initialState: ContentState = {
  allItems: [],
  items: [],
  page: 1,
  pageSize: 12,
  loading: false,
  hasMore: true,
  filters: {
    q: "",
    pricing: [],
  },
  error: null,
};

// Async thunk to fetch all data once
export const fetchContents = createAsyncThunk<
  void,
  void,
  { state: { content: ContentState } }
>("content/fetch", async (_, thunkAPI) => {
  const state = thunkAPI.getState().content;

  // Skip fetching if data already cached
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

function mapPricing(option: number): Pricing {
  return option === 2 ? "Paid" : option === 1 ? "View Only" : "Free";
}

const slice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setAllItems(state, action: PayloadAction<ContentItem[]>) {
      state.allItems = action.payload;
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
      if (idx >= 0) state.filters.pricing.splice(idx, 1);
      else state.filters.pricing.push(p);
      state.page = 1;
      applyFiltersAndPagination(state);
    },
    resetFilters(state) {
      state.filters = { q: "", pricing: [] };
      state.page = 1;
      applyFiltersAndPagination(state);
    },
    incPage(state) {
      state.page += 1;
      applyFiltersAndPagination(state);
    },
    setPageFromUrl(
      state,
      action: PayloadAction<{ q: string; pricing: Pricing[] }>
    ) {
      state.filters.q = action.payload.q;
      state.filters.pricing = action.payload.pricing;
      state.page = 1;
      applyFiltersAndPagination(state);
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

function applyFiltersAndPagination(state: ContentState) {
  let filtered = [...state.allItems];

  // Apply search
  if (state.filters.q) {
    const query = state.filters.q.toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.userName.toLowerCase().includes(query) ||
        i.title.toLowerCase().includes(query)
    );
  }

  // Apply pricing filter
  if (state.filters.pricing.length) {
    filtered = filtered.filter((i) =>
      state.filters.pricing.includes(i.pricing)
    );
  }

  const end = state.page * state.pageSize;
  state.items = filtered.slice(0, end);
  state.hasMore = end < filtered.length;
}

export const {
  setAllItems,
  setQuery,
  togglePricing,
  resetFilters,
  incPage,
  setPageFromUrl,
} = slice.actions;

export default slice.reducer;
