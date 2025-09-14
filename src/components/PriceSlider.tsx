"use client";
import styled from "@emotion/styled";
import React from "react";
import { colors } from "@/theme/tokens";

const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 160px;
  margin-left: 16px;
`;

const TrackWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 4px;
`;

const RangeHighlight = styled.div<{ left: number; width: number }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: ${({ left }) => left}%;
  width: ${({ width }) => width}%;
  height: 4px;
  background: ${colors.textPrimary};
  border-radius: 4px;
  z-index: 1;
`;

const RangeInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: transparent;
  pointer-events: none;
  -webkit-appearance: none;
  z-index: 2;

  &::-webkit-slider-runnable-track {
    height: 4px;
    background: ${colors.border}; /* ✅ Override default blue track */
    border-radius: 4px;
  }

  &::-webkit-slider-thumb {
    pointer-events: all;
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    margin-top: -4px; /* centers thumb vertically */
    border-radius: 50%;
    background: ${colors.textPrimary};
    border: 2px solid ${colors.surface};
    cursor: pointer;
  }

  &::-moz-range-track {
    height: 4px;
    background: ${colors.border};
    border-radius: 4px;
  }

  &::-moz-range-thumb {
    pointer-events: all;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${colors.textPrimary};
    border: 2px solid ${colors.surface};
    cursor: pointer;
  }
`;

const Label = styled.div`
  font-size: 12px;
  color: ${colors.textSecondary};
  text-align: center;
`;

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

interface PriceSliderProps {
  min: number;
  max: number;
  onChange: (range: [number, number]) => void;
  minLimit?: number;
  maxLimit?: number;
  step?: number;
}

export default function PriceSlider({
  min,
  max,
  onChange,
  minLimit = 0,
  maxLimit = 1000,
  step,
}: PriceSliderProps) {
  if (maxLimit <= minLimit) return <div style={{ minHeight: 32 }} />;

  const range = maxLimit - minLimit;
  if (range <= 0) return <div style={{ minHeight: 32 }} />;

  const effectiveStep = step ?? Math.max(1, Math.round(range / 100));

  const leftPercent = clamp(((min - minLimit) / range) * 100, 0, 100);
  const rightPercent = clamp(((max - minLimit) / range) * 100, 0, 100);
  const highlightWidth = Math.max(0, rightPercent - leftPercent);

  const handleMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = clamp(Number(e.target.value), minLimit, max - effectiveStep);
    onChange([v, max]);
  };

  const handleMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = clamp(Number(e.target.value), min + effectiveStep, maxLimit);
    onChange([min, v]);
  };

  return (
    <SliderWrapper>
      <TrackWrapper>
        <RangeHighlight left={leftPercent} width={highlightWidth} />
        <RangeInput
          type="range"
          min={minLimit}
          max={maxLimit}
          step={effectiveStep}
          value={min}
          onChange={handleMin}
          aria-label="Minimum price"
        />
        <RangeInput
          type="range"
          min={minLimit}
          max={maxLimit}
          step={effectiveStep}
          value={max}
          onChange={handleMax}
          aria-label="Maximum price"
        />
      </TrackWrapper>
      <Label>
        ${min.toLocaleString()} – ${max.toLocaleString()}
      </Label>
    </SliderWrapper>
  );
}
