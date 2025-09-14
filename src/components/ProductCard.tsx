"use client";
import styled from "@emotion/styled";
import type { ContentItem } from "@/types";
import { colors, radii, typography, shadows } from "@/theme/tokens";

const Card = styled.div`
  background: ${colors.surface};
  border-radius: ${radii.lg};
  overflow: hidden;
  box-shadow: ${shadows.card};
  display: flex;
  flex-direction: column;
`;

const Thumb = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  background: ${colors.skeleton};
`;

const Body = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 15px;
  color: ${colors.textPrimary};
`;

const Meta = styled.div`
  font: ${typography.label};
  color: ${colors.textSecondary};
`;

const PriceTag = styled.div`
  margin-top: auto;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.textPrimary};
`;

export default function ProductCard({ item }: { item: ContentItem }) {
  const isPaid = item.pricing === "Paid";
  return (
    <Card>
      <Thumb src={item.photo} alt={item.title} />
      <Body>
        <Title>{item.title}</Title>
        <Meta>{item.userName}</Meta>
        <PriceTag>{isPaid ? `$${item.price}` : item.pricing}</PriceTag>
      </Body>
    </Card>
  );
}
