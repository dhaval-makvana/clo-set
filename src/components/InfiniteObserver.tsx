"use client";
import React, { useRef, useEffect } from "react";

type Props = {
  onIntersect: () => void;
  root?: Element | null;
  rootMargin?: string;
  threshold?: number;
};
export function InfiniteObserver({
  onIntersect,
  root = null,
  rootMargin = "200px",
  threshold = 0,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.isIntersecting && onIntersect());
      },
      { root, rootMargin, threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onIntersect, root, rootMargin, threshold]);
  return <div ref={ref} style={{ minHeight: 1 }} />;
}
