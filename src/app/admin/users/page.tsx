// @ts-nocheck

import { UsersTable } from "@/components/admin/users/users-table";
import { Suspense } from "react";
import { UsersTableSkeleton } from "@/components/admin/users/users-table-skeleton";

interface UsersPageProps {
  searchParams: {
    page?: string;
    per_page?: string;
    search?: string;
    sort?: string;
    order?: "asc" | "desc";
  };
}

export default async function UsersPage({ searchParams }) {
  const page = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.per_page) || 10;
  const search = searchParams.search || "";
  const sort = searchParams.sort || "createdAt";
  const order = searchParams.order || "desc";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
      </div>

      <Suspense fallback={<UsersTableSkeleton />}>
        <UsersTable
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
