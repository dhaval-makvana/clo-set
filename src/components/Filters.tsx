"use client";
import styled from "@emotion/styled";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { RootState } from "../store";
import {
  Pricing,
  togglePricing,
  resetFilters,
} from "../store/slices/contentSlice";
const Panel = styled.div`
  background: white;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;
const Checkbox = ({ label, checked, onChange }: any) => (
  <label
    style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}
  >
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span>{label}</span>
  </label>
);
export default function Filters() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useSelector((s: RootState) => s.content.filters);
  const toggle = (p: Pricing) => {
    dispatch(togglePricing(p));
    const params = new URLSearchParams(searchParams.toString());
    const current = new Set(filters.pricing);
    current.has(p) ? current.delete(p) : current.add(p);
    current.size
      ? params.set("pricing", Array.from(current).join(","))
      : params.delete("pricing");
    router.replace("?" + params.toString());
  };
  const onReset = () => {
    dispatch(resetFilters());
    router.replace("?");
  };
  return (
    <Panel>
      <Checkbox
        label="Paid"
        checked={filters.pricing.includes("Paid")}
        onChange={() => toggle("Paid")}
      />
      <Checkbox
        label="Free"
        checked={filters.pricing.includes("Free")}
        onChange={() => toggle("Free")}
      />
      <Checkbox
        label="View Only"
        checked={filters.pricing.includes("View Only")}
        onChange={() => toggle("View Only")}
      />
      <button onClick={onReset} style={{ marginLeft: "auto" }}>
        Reset
      </button>
    </Panel>
  );
}
