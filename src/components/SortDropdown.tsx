"use client";
import styled from "@emotion/styled";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSortBy } from "@/store/slices/contentSlice";
import { SortBy } from "@/types";
import { colors, radii } from "@/theme/tokens";

const Dropdown = styled.select`
  padding: 6px 10px;
  border-radius: ${radii.md};
  border: 1px solid ${colors.border};
  background: ${colors.surface};
  color: ${colors.textPrimary};
  font-size: 14px;
  cursor: pointer;
  min-width: 160px;
`;

export default function SortDropdown() {
  const dispatch = useAppDispatch();
  const sortBy = useAppSelector((s) => s.content.sortBy);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as SortBy;
    dispatch(setSortBy(value));
  };

  return (
    <Dropdown value={sortBy} onChange={handleChange} aria-label="Sort items">
      <option value="name">Item Name (Default)</option>
      <option value="priceHigh">Higher Price</option>
      <option value="priceLow">Lower Price</option>
    </Dropdown>
  );
}
