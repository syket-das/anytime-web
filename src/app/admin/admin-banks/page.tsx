import { Suspense } from "react";
import { AdminBanksTable } from "@/components/admin/admin-banks/admin-banks-table";
import { AdminBanksTableSkeleton } from "@/components/admin/admin-banks/admin-banks-table-skeleton";

interface AdminBanksPageProps {
  searchParams: {
    page?: string;
    per_page?: string;
    search?: string;
    sort?: string;
    order?: "asc" | "desc";
  };
}

export default async function AdminBanksPage({
  searchParams,
}: AdminBanksPageProps) {
  const page = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.per_page) || 10;
  const search = searchParams.search || "";
  const sort = searchParams.sort || "createdAt";
  const order = searchParams.order || "desc";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Admin Banks</h2>
      </div>

      <Suspense fallback={<AdminBanksTableSkeleton />}>
        <AdminBanksTable
          initialPage={page}
          initialPageSize={pageSize}
          initialSearch={search}
          initialSort={sort}
          initialOrder={order}
        />
      </Suspense>
    </div>
  );
}
