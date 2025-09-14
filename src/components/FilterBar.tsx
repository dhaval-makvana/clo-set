"use client";
import styled from "@emotion/styled";
import SearchBar from "./SearchBar";
import Filters from "./Filters";
import SortDropdown from "./SortDropdown";

const Wrapper = styled.div`
  display: grid;
  gap: 12px;
`;

const FiltersRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SortRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default function FilterBar() {
  return (
    <Wrapper>
      {/* 1️⃣ Searchbar full width */}
      <SearchBar />

      {/* 2️⃣ Filters row with Reset button */}
      <FiltersRow>
        <FilterGroup>
          <Filters />
        </FilterGroup>
        {/* Reset button is part of Filters component (or we can pass as prop) */}
      </FiltersRow>

      {/* 3️⃣ Sorting row right aligned */}
      <SortRow>
        <SortDropdown />
      </SortRow>
    </Wrapper>
  );
}
