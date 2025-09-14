import reducer, {
  setAllItems,
  setQuery,
  togglePricing,
  setPriceRange,
  resetFilters,
  setSortBy,
  incPage,
  type ContentState,
} from "@/store/slices/productSlice";
import type { ContentItem } from "@/types";

const mockItems: ContentItem[] = [
  {
    id: "1",
    title: "Alpha",
    userName: "A",
    photo: "",
    pricing: "Paid",
    price: 100,
  },
  {
    id: "2",
    title: "Bravo",
    userName: "B",
    photo: "",
    pricing: "Free",
    price: 0,
  },
  {
    id: "3",
    title: "Charlie",
    userName: "C",
    photo: "",
    pricing: "Paid",
    price: 200,
  },
];

function getInitialState(): ContentState {
  return reducer(undefined, { type: "@@INIT" }) as ContentState;
}

describe("contentSlice", () => {
  it("should initialize with correct default state", () => {
    const state = getInitialState();
    expect(state.page).toBe(1);
    expect(state.filters.priceRange).toEqual([0, Infinity]);
    expect(state.allItems).toEqual([]);
  });

  it("should set all items and calculate maxPriceAvailable", () => {
    let state = getInitialState();
    state = reducer(state, setAllItems(mockItems));
    expect(state.allItems.length).toBe(3);
    expect(state.maxPriceAvailable).toBe(200); // only Paid items considered
    expect(state.filters.priceRange[1]).toBe(200); // auto-initialized
  });

  it("should filter by query (case-insensitive)", () => {
    let state = reducer(getInitialState(), setAllItems(mockItems));
    state = reducer(state, setQuery("char"));
    expect(state.items.every((i) => i.title.includes("Charlie"))).toBe(true);
  });

  it("should filter by pricing type", () => {
    let state = reducer(getInitialState(), setAllItems(mockItems));
    state = reducer(state, togglePricing("Paid"));
    expect(state.items.every((i) => i.pricing === "Paid")).toBe(true);
  });

  it("should filter by price range", () => {
    let state = reducer(getInitialState(), setAllItems(mockItems));
    state = reducer(state, setPriceRange([150, 300]));
    expect(state.items.every((i) => i.price >= 150 && i.price <= 300)).toBe(
      true
    );
  });

  it("should sort by price descending", () => {
    let state = reducer(getInitialState(), setAllItems(mockItems));
    state = reducer(state, setSortBy("priceHigh"));
    const prices = state.items.map((i) => i.price);
    expect(prices).toEqual([200, 100, 0]);
  });

  it("should sort by price ascending", () => {
    let state = reducer(getInitialState(), setAllItems(mockItems));
    state = reducer(state, setSortBy("priceLow"));
    const prices = state.items.map((i) => i.price);
    expect(prices).toEqual([0, 100, 200]);
  });

  it("should reset filters correctly", () => {
    let state = reducer(getInitialState(), setAllItems(mockItems));
    state = reducer(state, setQuery("alpha"));
    state = reducer(state, togglePricing("Paid"));
    state = reducer(state, resetFilters());
    expect(state.filters.q).toBe("");
    expect(state.filters.pricing).toEqual([]);
    expect(state.filters.priceRange[1]).toBe(200);
  });

  it("should increment page and paginate items", () => {
    let state = reducer(
      getInitialState(),
      setAllItems([...mockItems, ...mockItems])
    ); // 6 items
    const firstPageItems = state.items;
    state = reducer(state, incPage());
    expect(state.page).toBe(2);
    expect(state.items.length).toEqual(firstPageItems.length);
  });
});
