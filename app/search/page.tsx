import { Suspense } from "react";
import SearchPageClient from "@/components/search/SearchPageClient";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading search...</div>}>
      <SearchPageClient />
    </Suspense>
  );
}
