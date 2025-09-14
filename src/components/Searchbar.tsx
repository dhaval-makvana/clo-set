"use client";
import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useAppDispatch, useAppSelector } from "@/store";
import { setQuery } from "@/store/slices/contentSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { colors, radii } from "@/theme/tokens";

const Wrap = styled.div`
  background: ${colors.surface};
  padding: 8px;
  border-radius: ${radii.md};
`;

const Input = styled.input`
  flex: 1;
  padding: 8px 10px;
  border-radius: ${radii.sm};
  border: 1px solid ${colors.border};
  background: ${colors.background};
  color: ${colors.textPrimary};
  font-size: 14px;
`;

const Button = styled.button`
  margin-left: 8px;
  background: ${colors.accent};
  color: ${colors.textPrimary};
  border: none;
  padding: 6px 12px;
  border-radius: ${radii.sm};
  cursor: pointer;
`;

export default function SearchBar() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const filters = useAppSelector((s) => s.content.filters);
  const [val, setVal] = useState(filters.q);

  useEffect(() => setVal(filters.q), [filters.q]);

  const onSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    dispatch(setQuery(val));
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    val ? params.set("q", val) : params.delete("q");
    // preserve other params already present (pricing, minPrice, maxPrice, sortBy)
    router.replace(params.toString() ? `?${params.toString()}` : "/", {
      scroll: false,
    });
  };

  return (
    <Wrap>
      <form onSubmit={onSearch} style={{ display: "flex", gap: 8 }}>
        <Input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="Search..."
          aria-label="Search items"
        />
        <Button type="button" onClick={() => onSearch()}>
          Search
        </Button>
      </form>
    </Wrap>
  );
}
