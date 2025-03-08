import { Skeleton } from "@/components/ui/skeleton";
import { Table } from "@/components/ui/table";

export function ExchangeRatesTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1"></div>

        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <thead>
            <tr>
              <th className="w-[150px]">
                <Skeleton className="h-5 w-20" />
              </th>
              <th>
                <Skeleton className="h-5 w-32" />
              </th>
              <th>
                <Skeleton className="h-5 w-24" />
              </th>
              <th>
                <Skeleton className="h-5 w-16" />
              </th>
              <th>
                <Skeleton className="h-5 w-24" />
              </th>
              <th className="text-right">
                <Skeleton className="h-5 w-20 ml-auto" />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td>
                  <Skeleton className="h-5 w-24" />
                </td>
                <td>
                  <Skeleton className="h-5 w-32" />
                </td>
                <td>
                  <Skeleton className="h-5 w-24" />
                </td>
                <td>
                  <Skeleton className="h-5 w-16" />
                </td>
                <td>
                  <Skeleton className="h-5 w-24" />
                </td>
                <td className="text-right">
                  <Skeleton className="h-5 w-20 ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
