// @ts-nocheck

import { Suspense } from "react";
import { ExchangeRatesTable } from "@/components/admin/exchange-rates/exchange-rates-table";
import { ExchangeRatesTableSkeleton } from "@/components/admin/exchange-rates/exchange-rates-table-skeleton";

interface ExchangeRatesPageProps {
  searchParams: {
    page?: string;
    per_page?: string;
    sort?: string;
    order?: "asc" | "desc";
  };
}

export default async function ExchangeRatesPage({ searchParams }) {
  const page = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.per_page) || 10;
  const sort = searchParams.sort || "createdAt";
  const order = searchParams.order || "desc";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Exchange Rates</h2>
      </div>

      <Suspense fallback={<ExchangeRatesTableSkeleton />}>
        <ExchangeRatesTable
          initialPage={page}
          initialPageSize={pageSize}
          initialSort={sort}
          initialOrder={order}
        />
      </Suspense>
    </div>
  );
}
