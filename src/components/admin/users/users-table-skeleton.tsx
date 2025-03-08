import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function UsersTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-10 w-10" />
        </div>

        <Skeleton className="h-10 w-[100px]" />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Skeleton className="h-5 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-24" />
              </TableHead>
              <TableHead className="text-center">
                <Skeleton className="h-5 w-16 mx-auto" />
              </TableHead>
              <TableHead className="text-center">
                <Skeleton className="h-5 w-16 mx-auto" />
              </TableHead>
              <TableHead className="text-right">
                <Skeleton className="h-5 w-20 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-5 w-5 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-5 w-5 mx-auto" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-24 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  )
}

