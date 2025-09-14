"use client";

import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import ContentCard from "@/components/ProductCard";
import { Grid } from "@/components/ProductGrid";
import { InfiniteObserver } from "@/components/InfiniteObserver";
import ContentSkeleton from "@/components/Shimmer";
import { setAllItems, setLoading, setError } from "@/store/slices/productSlice";
import { ContentItem } from "@/types";
import { loadNextPage } from "@/store/actions/product";

export default function ContentGridClient({
  initialItems,
}: {
  initialItems: ContentItem[];
}) {
  const dispatch = useAppDispatch();
  const { items, loading, isPaginating, hasMore, page } = useAppSelector(
    (s) => s.content
  );

  // Hydrate store with server data
  useEffect(() => {
    dispatch(setLoading(true));
    try {
      dispatch(setAllItems(initialItems));
    } catch (err) {
      dispatch(setError("Failed to load data"));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, initialItems]);

  const onIntersect = useCallback(() => {
    if (!loading && hasMore) dispatch(loadNextPage());
  }, [dispatch, loading, hasMore]);

  return (
    <>
      <Grid>
        {loading && page === 1
          ? Array.from({ length: 12 }).map((_, i) => (
              <ContentSkeleton key={i} />
            ))
          : items.map((item) => <ContentCard key={item.id} item={item} />)}
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
    </>
  );
}
