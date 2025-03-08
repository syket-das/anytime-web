import { Suspense } from "react"
import { DepositsTable } from "@/components/admin/deposits/deposits-table"
import { DepositsTableSkeleton } from "@/components/admin/deposits/deposits-table-skeleton"

interface DepositsPageProps {
  searchParams: {
    page?: string
    per_page?: string
    search?: string
    status?: string
    sort?: string
    order?: "asc" | "desc"
  }
}

export default async function DepositsPage({ searchParams }: DepositsPageProps) {
  const page = Number(searchParams.page) || 1
  const pageSize = Number(searchParams.per_page) || 10
  const search = searchParams.search || ""
  const status = searchParams.status || ""
  const sort = searchParams.sort || "createdAt"
  const order = searchParams.order || "desc"

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Deposits</h2>
      </div>

      <Suspense fallback={<DepositsTableSkeleton />}>
        <DepositsTable
          initialPage={page}
          initialPageSize={pageSize}
          initialSearch={search}
          initialStatus={status}
          initialSort={sort}
          initialOrder={order}
        />
      </Suspense>
    </div>
  )
}

