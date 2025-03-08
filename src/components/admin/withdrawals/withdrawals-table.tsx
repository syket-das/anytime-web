// @ts-nocheck
"use client";

import type React from "react";

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getWithdrawals } from "@/actions/admin-actions";
import { formatCurrency, formatDateTime, STATUS_COLORS } from "@/lib/utils";
import { WithdrawalDialog } from "./withdrawal-dialog";
import { Loader2, Search, SortAsc, SortDesc, Eye } from "lucide-react";

interface WithdrawalsTableProps {
  initialPage: number;
  initialPageSize: number;
  initialSearch: string;
  initialStatus: string;
  initialSort: string;
  initialOrder: "asc" | "desc";
}

export function WithdrawalsTable({
  initialPage,
  initialPageSize,
  initialSearch,
  initialStatus,
  initialSort,
  initialOrder,
}: WithdrawalsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const [sort, setSort] = useState(initialSort);
  const [order, setOrder] = useState(initialOrder);

  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchWithdrawals() {
      setLoading(true);
      try {
        const result = await getWithdrawals(
          page,
          pageSize,
          search,
          status,
          sort,
          order
        );
        setWithdrawals(result.withdrawals);
        setTotalPages(result.totalPages);
        setTotalWithdrawals(result.totalWithdrawals);
      } catch (error) {
        console.error("Failed to fetch withdrawals:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWithdrawals();

    // Update URL
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    params.set("per_page", pageSize.toString());
    if (search) params.set("search", search);
    else params.delete("search");
    if (status) params.set("status", status);
    else params.delete("status");
    params.set("sort", sort);
    params.set("order", order);

    router.push(`${pathname}?${params.toString()}`);
  }, [
    page,
    pageSize,
    search,
    status,
    sort,
    order,
    pathname,
    router,
    searchParams,
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };

  const toggleSort = (column: string) => {
    if (sort === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(column);
      setOrder("asc");
    }
  };

  const openWithdrawalDialog = (withdrawal: any) => {
    setSelectedWithdrawal(withdrawal);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <form
          onSubmit={handleSearch}
          className="flex w-full max-w-sm items-center space-x-2"
        >
          <Input
            type="search"
            placeholder="Search withdrawals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </form>

        <div className="flex items-center space-x-2">
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="SUCCESS">Success</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="NOT_VERIFIED">Not Verified</SelectItem>
            </SelectContent>
          </Select>

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
              <TableHead>User</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("walletAddress")}
                  className="flex items-center gap-1"
                >
                  Wallet Address
                  {sort === "walletAddress" &&
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
                  onClick={() => toggleSort("amount")}
                  className="flex items-center gap-1"
                >
                  Amount
                  {sort === "amount" &&
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
                  onClick={() => toggleSort("status")}
                  className="flex items-center gap-1"
                >
                  Status
                  {sort === "status" &&
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
                  Date
                  {sort === "createdAt" &&
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
            ) : withdrawals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No withdrawals found.
                </TableCell>
              </TableRow>
            ) : (
              withdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell>
                    {withdrawal.user.name || withdrawal.user.email}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {withdrawal.walletAddress}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(withdrawal.amount, withdrawal.currency)}
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_COLORS[withdrawal.status]}>
                      {withdrawal.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDateTime(withdrawal.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openWithdrawalDialog(withdrawal)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {withdrawals.length} of {totalWithdrawals} withdrawals
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

      <WithdrawalDialog
        withdrawal={selectedWithdrawal}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          // Refresh the data
          getWithdrawals(page, pageSize, search, status, sort, order).then(
            (result) => {
              setWithdrawals(result.withdrawals);
              setTotalPages(result.totalPages);
              setTotalWithdrawals(result.totalWithdrawals);
            }
          );
        }}
      />
    </div>
  );
}
