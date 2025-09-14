import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllProducts } from "@/service/product";
import {
  setAllItems,
  incPage,
  startPagination,
  stopPagination,
  ContentState,
} from "../slices/productSlice";
import type { ContentItem } from "@/types";

// Fetch all data once
export const fetchProductsThunk = createAsyncThunk<
  ContentItem[],
  void,
  { state: { content: ContentState } }
>("content/fetch", async (_, thunkAPI) => {
  const state = thunkAPI.getState().content;

  // Avoid duplicate fetches
  if (state.allItems.length > 0) return [];

  const allItems = await fetchAllProducts();
  thunkAPI.dispatch(setAllItems(allItems));
  return allItems;
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
