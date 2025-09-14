import axios from "axios";
import { ApiContentResponse } from "@/types/api";
import { ContentItem } from "@/types";
import { mapPricing } from "./transformers";

export async function fetchAllProducts(): Promise<ContentItem[]> {
  const res = await axios.get<ApiContentResponse[]>(
    "https://closet-recruiting-api.azurewebsites.net/api/data"
  );

  return res.data.map((it, idx) => ({
    id: it.id ?? `${it.creator}-${it.title}-${idx}`,
    photo: it.imagePath,
    userName: it.creator,
    title: it.title,
    pricing: mapPricing(it.pricingOption),
    price: it.price,
  }));
}
