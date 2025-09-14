"use client";
import styled from "@emotion/styled";
import { colors, radii, shadows } from "@/theme/tokens";

const SkeletonCard = styled.div`
  background: ${colors.surface};
  border-radius: ${radii.lg};
  overflow: hidden;
  box-shadow: ${shadows.card};
  display: flex;
  flex-direction: column;
  animation: pulse 1.5s infinite ease-in-out;

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;

const ThumbSkeleton = styled.div`
  width: 100%;
  height: 160px;
  background: ${colors.skeleton};
`;

const BodySkeleton = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Line = styled.div<{ w?: string }>`
  height: 14px;
  background: ${colors.skeleton};
  border-radius: 4px;
  width: ${({ w }) => w || "100%"};
`;

export default function ContentSkeleton() {
  return (
    <SkeletonCard>
      <ThumbSkeleton />
      <BodySkeleton>
        <Line w="80%" />
        <Line w="50%" />
        <Line w="30%" />
      </BodySkeleton>
    </SkeletonCard>
  );
}
