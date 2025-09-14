"use client";
import styled from "@emotion/styled";

const SkeletonCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
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
  background: #e5e7eb;
`;

const BodySkeleton = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Line = styled.div<{ w?: string }>`
  height: 14px;
  background: #e5e7eb;
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
