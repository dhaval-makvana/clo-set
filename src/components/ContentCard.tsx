"use client";
import styled from "@emotion/styled";
import { ContentItem } from "../store/slices/contentSlice";

const Card = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
`;

const Thumb = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  background: #eee;
`;

const Body = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Meta = styled.div`
  font-size: 13px;
  color: #666;
`;

export default function ContentCard({ item }: { item: ContentItem }) {
  const isPaid = item.pricing === "Paid";

  return (
    <Card>
      <Thumb src={item.photo} alt={item.title} />
      <Body>
        <div style={{ fontWeight: 600 }}>{item.title}</div>
        <Meta>{item.userName}</Meta>
        <div style={{ marginTop: "auto", fontSize: 14, fontWeight: 600 }}>
          {isPaid ? `$${item.price}` : item.pricing}
        </div>
      </Body>
    </Card>
  );
}
