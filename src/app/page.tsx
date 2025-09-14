import ContentGridClient from "./Client";
import FilterBar from "@/components/FilterBar";
import { fetchAllProducts } from "@/service/product"; // service layer
import { Suspense } from "react";
import PageLayout from "@/components/PageLayout";

export default async function Page() {
  // Fetch first render on the server
  const initialItems = await fetchAllProducts();

  return (
    <PageLayout>
      <h1>CLO-SET Connect — Store</h1>

      <Suspense fallback={<div>Loading filter bar...</div>}>
        <FilterBar />
      </Suspense>

      {/* Hydrate client component with server-fetched items */}
      <ContentGridClient initialItems={initialItems} />
    </PageLayout>
  );
}
