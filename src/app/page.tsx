"use client";
import React, { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { useSearchParams } from "next/navigation";
import Filters from "../components/Filters";
import SearchBar from "../components/Searchbar";
import ContentCard from "../components/ContentCard";
import { Grid } from "../components/ContentGrid";
import { InfiniteObserver } from "../components/InfiniteObserver";
import {
  fetchContents,
  incPage,
  setPageFromUrl,
} from "../store/slices/contentSlice";

export default function Page() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { items, loading, hasMore, page } = useAppSelector((s) => s.content);

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    const pricing = searchParams.get("pricing")?.split(",") ?? [];
    dispatch(setPageFromUrl({ q, pricing: pricing as any }));
    dispatch(fetchContents());
  }, [dispatch, searchParams]);

  const onIntersect = useCallback(() => {
    if (!loading && hasMore) dispatch(incPage());
  }, [dispatch, loading, hasMore]);

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "24px auto",
        padding: "0 16px",
        display: "grid",
        gap: 16,
      }}
    >
      <h1>CLO-SET Connect — Store</h1>
      <div style={{ display: "grid", gap: 12 }}>
        <SearchBar />
        <Filters />
      </div>

      <Grid>
        {items.map((it) => (
          <ContentCard key={it.id} item={it} />
        ))}
      </Grid>

      {loading && page === 1 && (
        <div style={{ textAlign: "center" }}>Loading data...</div>
      )}
      {!loading && hasMore && (
        <>
          <InfiniteObserver onIntersect={onIntersect} rootMargin="300px" />
          <div style={{ textAlign: "center", color: "#666" }}>
            Scroll to load more
          </div>
        </>
      )}
      {!hasMore && !loading && (
        <div style={{ textAlign: "center", color: "#666" }}>No more items</div>
      )}
    </div>
  );
}
