"use client";
import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { setQuery } from "../store/slices/contentSlice";
import { RootState } from "../store";
const Wrap = styled.div`
  background: white;
  padding: 8px;
  border-radius: 8px;
`;
export default function SearchBar() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const filters = useSelector((s: RootState) => s.content.filters);
  const [val, setVal] = useState(filters.q);
  useEffect(() => setVal(filters.q), [filters.q]);
  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setQuery(val));
    const params = new URLSearchParams(searchParams.toString());
    val ? params.set("q", val) : params.delete("q");
    router.replace("?" + params.toString());
  };
  return (
    <Wrap>
      <form onSubmit={onSearch} style={{ display: "flex", gap: 8 }}>
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="Search..."
          style={{
            flex: 1,
            padding: "8px 10px",
            borderRadius: 6,
            border: "1px solid #e6e6f0",
          }}
        />
        <button type="submit">Search</button>
      </form>
    </Wrap>
  );
}
