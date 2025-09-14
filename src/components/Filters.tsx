"use client";
import styled from "@emotion/styled";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  togglePricing,
  resetFilters,
  setPriceRange,
} from "@/store/slices/contentSlice";
import { useSyncFiltersToUrl } from "@/utils";

import PriceSlider from "./PriceSlider";

const FilterChip = styled.button<{ active?: boolean }>`
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid ${({ active }) => (active ? "#0070f3" : "#ddd")};
  background: ${({ active }) => (active ? "#e6f0ff" : "white")};
  cursor: pointer;
  font-size: 13px;
`;

const ResetButton = styled.button`
  padding: 6px 12px;
  border: none;
  background: transparent;
  color: #666;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    text-decoration: underline;
  }
`;

const pricingOptions: ("Paid" | "Free" | "View Only")[] = [
  "Paid",
  "Free",
  "View Only",
];

export default function Filters() {
  const dispatch = useAppDispatch();
  const { setParams } = useSyncFiltersToUrl();
  const active = useAppSelector((s) => s.content.filters.pricing);
  const query = useAppSelector((s) => s.content.filters.q);
  const maxPriceAvailable = useAppSelector((s) => s.content.maxPriceAvailable);
  const [min, max] = useAppSelector((s) => s.content.filters.priceRange);
  const activePricing = useAppSelector((s) => s.content.filters.pricing);

  const handlePriceChange = (range: [number, number]) => {
    dispatch(setPriceRange(range));
    setParams(query, activePricing, range); // include range in URL
  };

  const handleReset = () => {
    dispatch(resetFilters());
    setParams("", []); // ✅ clear URL as well
  };

  return (
    <>
      {pricingOptions.map((p) => (
        <FilterChip
          key={p}
          active={active.includes(p)}
          onClick={() => {
            dispatch(togglePricing(p));
            const newPricing = active.includes(p)
              ? active.filter((x) => x !== p)
              : [...active, p];
            setParams(query, newPricing);
          }}
        >
          {p}
        </FilterChip>
      ))}

      {maxPriceAvailable === 0 ? (
        <div style={{ minHeight: "40px" }}>Loading price filter...</div>
      ) : (
        <PriceSlider
          min={min}
          max={max}
          onChange={handlePriceChange}
          minLimit={0}
          maxLimit={maxPriceAvailable}
        />
      )}

      <ResetButton onClick={handleReset}>Reset</ResetButton>
    </>
  );
}
