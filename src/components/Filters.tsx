"use client";
import styled from "@emotion/styled";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  togglePricing,
  resetFilters,
  setPriceRange,
} from "@/store/slices/contentSlice";
import { useSyncFiltersToUrl } from "@/hooks";
import { colors, radii, typography } from "@/theme/tokens";
import type { Pricing } from "@/types";

import PriceSlider from "./PriceSlider";

const FilterChip = styled.button<{ active?: boolean }>`
  padding: 6px 12px;
  border-radius: ${radii.xl};
  border: 1px solid ${({ active }) => (active ? colors.accent : colors.border)};
  background: ${({ active }) =>
    active ? `${colors.accent}22` : colors.surface};
  color: ${colors.textPrimary};
  cursor: pointer;
  font: ${typography.label};
`;

const ResetButton = styled.button`
  padding: 6px 12px;
  border: none;
  background: transparent;
  color: ${colors.textPrimary};
  opacity: 0.75;
  cursor: pointer;
  font: ${typography.label};
  transition: color 0.2s ease, opacity 0.2s ease;
  margin-left: auto !important;

  &:hover {
    opacity: 1;
    text-decoration: underline;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
`;

const pricingOptions: Pricing[] = ["Paid", "Free", "View Only"];

export default function Filters() {
  const dispatch = useAppDispatch();
  const { setParams } = useSyncFiltersToUrl();
  const activePricing = useAppSelector((s) => s.content.filters.pricing);
  const q = useAppSelector((s) => s.content.filters.q);
  const [min, max] = useAppSelector((s) => s.content.filters.priceRange);
  const maxPriceAvailable = useAppSelector((s) => s.content.maxPriceAvailable);

  const handleToggle = (p: Pricing) => {
    const newPricing = activePricing.includes(p)
      ? activePricing.filter((x) => x !== p)
      : [...activePricing, p];

    dispatch(togglePricing(p));
    setParams(q, newPricing, [min, max]);
  };

  const handlePriceChange = (range: [number, number]) => {
    dispatch(setPriceRange(range));
    setParams(q, activePricing, range);
  };

  const handleReset = () => {
    dispatch(resetFilters());
    setParams("", []);
  };

  return (
    <Row>
      {pricingOptions.map((p) => (
        <FilterChip
          key={p}
          active={activePricing.includes(p)}
          onClick={() => handleToggle(p)}
        >
          {p}
        </FilterChip>
      ))}

      {maxPriceAvailable > 0 ? (
        <PriceSlider
          min={min}
          max={max}
          minLimit={0}
          maxLimit={maxPriceAvailable}
          onChange={handlePriceChange}
        />
      ) : (
        <div style={{ minHeight: 40 }} />
      )}

      <ResetButton onClick={handleReset}>Reset</ResetButton>
    </Row>
  );
}
