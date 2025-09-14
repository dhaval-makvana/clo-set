export type SortBy = "name" | "priceHigh" | "priceLow";
export type Pricing = "Paid" | "Free" | "View Only";
export interface ContentItem {
  id: string;
  photo: string;
  userName: string;
  title: string;
  pricing: Pricing;
  price: number;
}
