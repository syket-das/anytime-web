"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getExchangeRates, deleteExchangeRate } from "@/actions/admin-actions";
import { formatDate } from "@/lib/utils";
import { ExchangeRateDialog } from "./exchange-rate-dialog";
import { Loader2, Plus, SortAsc, SortDesc, Trash2, Edit } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ExchangeRatesTableProps {
  initialPage: number;
  initialPageSize: number;
  initialSort: string;
  initialOrder: "asc" | "desc";
}

export function ExchangeRatesTable({
  initialPage,
  initialPageSize,
  initialSort,
  initialOrder,
}: ExchangeRatesTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [exchangeRates, setExchangeRates] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalExchangeRates, setTotalExchangeRates] = useState(0);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sort, setSort] = useState(initialSort);
  const [order, setOrder] = useState(initialOrder);

  const [selectedRate, setSelectedRate] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rateToDelete, setRateToDelete] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExchangeRates() {
      setLoading(true);
      try {
        const result = await getExchangeRates(
          page,
          pageSize,
          undefined,
          sort,
          order
        );
        setExchangeRates(result.exchangeRates);
        setTotalPages(result.totalPages);
        setTotalExchangeRates(result.totalExchangeRates);
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchExchangeRates();

    // Update URL
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    params.set("per_page", pageSize.toString());
    params.set("sort", sort);
    params.set("order", order);

    router.push(`${pathname}?${params.toString()}`);
  }, [page, pageSize, sort, order, pathname, router, searchParams]);

  const toggleSort = (column: string) => {
    if (sort === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(column);
      setOrder("asc");
    }
  };

  const openAddDialog = () => {
    setSelectedRate(null);
    setIsEditing(false);
    setDialogOpen(true);
  };

  const openEditDialog = (rate: any) => {
    setSelectedRate(rate);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const confirmDelete = (rateId: string) => {
    setRateToDelete(rateId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!rateToDelete) return;

    try {
      await deleteExchangeRate(rateToDelete);
      setExchangeRates(
        exchangeRates.filter((rate) => rate.id !== rateToDelete)
      );
      setTotalExchangeRates((prev) => prev - 1);
    } catch (error) {
      console.error("Failed to delete exchange rate:", error);
    } finally {
      setDeleteDialogOpen(false);
      setRateToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1"></div>

        <div className="flex items-center space-x-2">
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Rate
          </Button>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="10 per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
              <SelectItem value="100">100 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("from")}
                  className="flex items-center gap-1"
                >
                  From
                  {sort === "from" &&
                    (order === "asc" ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    ))}
                </Button>
              </TableHead>
              <TableHead className="w-[100px]">
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("to")}
                  className="flex items-center gap-1"
                >
                  To
                  {sort === "to" &&
                    (order === "asc" ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    ))}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("rate")}
                  className="flex items-center gap-1"
                >
                  Rate
                  {sort === "rate" &&
                    (order === "asc" ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    ))}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("createdAt")}
                  className="flex items-center gap-1"
                >
                  Created At
                  {sort === "createdAt" &&
                    (order === "asc" ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    ))}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("updatedAt")}
                  className="flex items-center gap-1"
                >
                  Updated At
                  {sort === "updatedAt" &&
                    (order === "asc" ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    ))}
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : exchangeRates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No exchange rates found.
                </TableCell>
              </TableRow>
            ) : (
              exchangeRates.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell className="font-medium">{rate.from}</TableCell>
                  <TableCell>{rate.to}</TableCell>
                  <TableCell>{rate.rate.toFixed(4)}</TableCell>
                  <TableCell>{formatDate(rate.createdAt)}</TableCell>
                  <TableCell>
                    {rate.updatedAt ? formatDate(rate.updatedAt) : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(rate)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDelete(rate.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {exchangeRates.length} of {totalExchangeRates} exchange rates
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <div className="text-sm">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      <ExchangeRateDialog
        rate={selectedRate}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        isEditing={isEditing}
        onSuccess={() => {
          // Refresh the data
          getExchangeRates(page, pageSize, undefined, sort, order).then(
            (result) => {
              setExchangeRates(result.exchangeRates);
              setTotalPages(result.totalPages);
              setTotalExchangeRates(result.totalExchangeRates);
            }
          );
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              exchange rate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
