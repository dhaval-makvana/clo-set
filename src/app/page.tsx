"use client";
// lib
import React, { useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";

// components
import FilterBar from "@/components/FilterBar";
import ContentCard from "@/components/ProductCard";
import { Grid } from "@/components/ProductGrid";
import { InfiniteObserver } from "@/components/InfiniteObserver";
import ContentSkeleton from "@/components/Shimmer";

// store
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchContents,
  loadNextPage,
  setPageFromUrl,
} from "@/store/slices/contentSlice";

export default function Page() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { items, loading, isPaginating, hasMore, page } = useAppSelector(
    (s) => s.content
  );

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    const pricing = searchParams.get("pricing")?.split(",") ?? [];
    const minP = searchParams.get("minPrice");
    const maxP = searchParams.get("maxPrice");

    let priceRange: [number, number] | undefined;
    if (minP != null && maxP != null) {
      const minN = Number(minP);
      const maxN = Number(maxP);
      if (!Number.isNaN(minN) && !Number.isNaN(maxN)) priceRange = [minN, maxN];
    }

    dispatch(setPageFromUrl({ q, pricing: pricing as any, priceRange }));
    dispatch(fetchContents());
  }, [dispatch, searchParams]);

  const onIntersect = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(loadNextPage()); // uses thunk with delay
    }
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
      {/* <div style={{ display: "grid", gap: 12 }}>
        <SearchBar />
        <Filters />
      </div> */}
      <FilterBar />

      <Grid>
        {loading && page === 1
          ? Array.from({ length: 12 }).map((_, i) => (
              <ContentSkeleton key={`skeleton-${i}`} />
            ))
          : items.map((it) => <ContentCard key={it.id} item={it} />)}
      </Grid>

      {isPaginating && (
        <Grid>
          {Array.from({ length: 4 }).map((_, i) => (
            <ContentSkeleton key={`skeleton-more-${i}`} />
          ))}
        </Grid>
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
