"use client";
import styled from "@emotion/styled";
import { useAppDispatch, useAppSelector } from "@/store";
import { setSortBy } from "@/store/slices/contentSlice";

const Dropdown = styled.select`
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: white;
  font-size: 14px;
  cursor: pointer;
  min-width: 160px;

  &:focus {
    outline: none;
    border-color: #999;
  }
`;

export default function SortDropdown() {
  const dispatch = useAppDispatch();
  const sortBy = useAppSelector((s) => s.content.sortBy);

  return (
    <Dropdown
      value={sortBy}
      onChange={(e) => dispatch(setSortBy(e.target.value as any))}
      aria-label="Sort items"
    >
      <option value="name">Item Name (Default)</option>
      <option value="priceHigh">Higher Price</option>
      <option value="priceLow">Lower Price</option>
    </Dropdown>
  );
}
