import { Pricing } from "@/types";

// Map numeric API pricing option to enum
export function mapPricing(option: number): Pricing {
  return option === 0 ? "Paid" : option === 1 ? "Free" : "View Only";
}
