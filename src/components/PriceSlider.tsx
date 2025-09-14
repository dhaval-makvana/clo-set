"use client";
import styled from "@emotion/styled";
import React from "react";

const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 200px;
`;

const TrackWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
`;

const RangeHighlight = styled.div<{ left: number; width: number }>`
  position: absolute;
  top: 0;
  left: ${({ left }) => left}%;
  width: ${({ width }) => width}%;
  height: 100%;
  background: #0070f3;
  border-radius: 2px;
`;

const Thumb = styled.input`
  position: absolute;
  top: -6px;
  width: 100%;
  height: 16px;
  background: none;
  pointer-events: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    pointer-events: all;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #0070f3;
    cursor: pointer;
  }
`;

const Label = styled.div`
  font-size: 13px;
  text-align: center;
  color: #666;
`;

interface PriceSliderProps {
  min: number;
  max: number;
  onChange: (range: [number, number]) => void;
  minLimit?: number;
  maxLimit?: number;
}

export default function PriceSlider({
  min,
  max,
  onChange,
  minLimit = 0,
  maxLimit = 500,
}: PriceSliderProps) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), max - 1);
    onChange([value, max]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), min + 1);
    onChange([min, value]);
  };

  if (maxLimit <= 0) return <div>—</div>;
  
  const range = maxLimit - minLimit;
  if (range <= 0) return null; // no valid range yet

const leftPercent = ((min - minLimit) / range) * 100;
const rightPercent = ((max - minLimit) / range) * 100;
const highlightWidth = rightPercent - leftPercent;

return (
  <SliderWrapper>
    <TrackWrapper>
      <RangeHighlight left={leftPercent} width={highlightWidth} />
      <Thumb
        type="range"
        min={minLimit}
        max={maxLimit}
        step={1}
        value={min}
        onChange={handleMinChange}
      />
      <Thumb
        type="range"
        min={minLimit}
        max={maxLimit}
        step={1}
        value={max}
        onChange={handleMaxChange}
      />
    </TrackWrapper>
    <Label>
      ${min} - ${max}
    </Label>
  </SliderWrapper>
);