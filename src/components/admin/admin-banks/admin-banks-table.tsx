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
import { getAdminBanks, deleteAdminBank } from "@/actions/admin-actions";
import { formatDate } from "@/lib/utils";
import { AdminBankDialog } from "./admin-bank-dialog";
import {
  Loader2,
  Plus,
  Search,
  SortAsc,
  SortDesc,
  Trash2,
  Edit,
} from "lucide-react";
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

interface AdminBanksTableProps {
  initialPage: number;
  initialPageSize: number;
  initialSearch: string;
  initialSort: string;
  initialOrder: "asc" | "desc";
}

export function AdminBanksTable({
  initialPage,
  initialPageSize,
  initialSearch,
  initialSort,
  initialOrder,
}: AdminBanksTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [adminBanks, setAdminBanks] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAdminBanks, setTotalAdminBanks] = useState(0);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState(initialSort);
  const [order, setOrder] = useState(initialOrder);

  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bankToDelete, setBankToDelete] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAdminBanks() {
      setLoading(true);
      try {
        const result = await getAdminBanks(page, pageSize, search, sort, order);
        setAdminBanks(result.adminBanks);
        setTotalPages(result.totalPages);
        setTotalAdminBanks(result.totalAdminBanks);
      } catch (error) {
        console.error("Failed to fetch admin banks:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAdminBanks();

    // Update URL
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    params.set("per_page", pageSize.toString());
    if (search) params.set("search", search);
    else params.delete("search");
    params.set("sort", sort);
    params.set("order", order);

    router.push(`${pathname}?${params.toString()}`);
  }, [page, pageSize, search, sort, order, pathname, router, searchParams]);

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

  const openAddDialog = () => {
    setSelectedBank(null);
    setIsEditing(false);
    setDialogOpen(true);
  };

  const openEditDialog = (bank: any) => {
    setSelectedBank(bank);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const confirmDelete = (bankId: string) => {
    setBankToDelete(bankId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!bankToDelete) return;

    try {
      await deleteAdminBank(bankToDelete);
      setAdminBanks(adminBanks.filter((bank) => bank.id !== bankToDelete));
      setTotalAdminBanks((prev) => prev - 1);
    } catch (error) {
      console.error("Failed to delete admin bank:", error);
    } finally {
      setDeleteDialogOpen(false);
      setBankToDelete(null);
    }
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
            placeholder="Search banks..."
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
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Bank
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
              <TableHead className="w-[150px]">
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("type")}
                  className="flex items-center gap-1"
                >
                  Bank Type
                  {sort === "type" &&
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
                  onClick={() => toggleSort("accountNo")}
                  className="flex items-center gap-1"
                >
                  Account Number
                  {sort === "accountNo" &&
                    (order === "asc" ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    ))}
                </Button>
              </TableHead>
              <TableHead>Account Name</TableHead>
              <TableHead>Branch</TableHead>
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
            ) : adminBanks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No admin banks found.
                </TableCell>
              </TableRow>
            ) : (
              adminBanks.map((bank) => (
                <TableRow key={bank.id}>
                  <TableCell className="font-medium">{bank.type}</TableCell>
                  <TableCell>{bank.accountNo}</TableCell>
                  <TableCell>{bank.accountName || "N/A"}</TableCell>
                  <TableCell>{bank.branch || "N/A"}</TableCell>
                  <TableCell>{formatDate(bank.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(bank)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDelete(bank.id)}
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
          Showing {adminBanks.length} of {totalAdminBanks} admin banks
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

      <AdminBankDialog
        bank={selectedBank}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        isEditing={isEditing}
        onSuccess={() => {
          // Refresh the data
          getAdminBanks(page, pageSize, search, sort, order).then((result) => {
            setAdminBanks(result.adminBanks);
            setTotalPages(result.totalPages);
            setTotalAdminBanks(result.totalAdminBanks);
          });
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              admin bank.
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
