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
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
`;

const SortRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default function FilterBar() {
  return (
    <Wrapper>
      <SearchBar />
      <FiltersRow>
        <FilterGroup>
          <Filters />
        </FilterGroup>
      </FiltersRow>
      <SortRow>
        <SortDropdown />
      </SortRow>
    </Wrapper>
  );
}
