"use client";
import { useRouter, useSearchParams } from "next/navigation";

export function useSyncFiltersToUrl() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setParams = (
    q?: string,
    pricing?: string[],
    priceRange?: [number, number]
  ) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");

    if (q) params.set("q", q);
    else params.delete("q");
    if (pricing && pricing.length) params.set("pricing", pricing.join(","));
    else params.delete("pricing");

    if (priceRange) {
      params.set("minPrice", String(priceRange[0]));
      params.set("maxPrice", String(priceRange[1]));
    } else {
      params.delete("minPrice");
      params.delete("maxPrice");
    }

    const qp = params.toString();
    router.replace(qp ? `?${qp}` : "/", { scroll: false });
  };

  return { setParams };
}
