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
import { Checkbox } from "@/components/ui/checkbox";
import { getUsers, updateUser } from "@/actions/admin-actions";
import { formatDate } from "@/lib/utils";
import { UserDialog } from "./user-dialog";
import { Loader2, Search, SortAsc, SortDesc } from "lucide-react";

interface UsersTableProps {
  initialPage: number;
  initialPageSize: number;
  initialSearch: string;
  initialSort: string;
  initialOrder: "asc" | "desc";
}

export function UsersTable({
  initialPage,
  initialPageSize,
  initialSearch,
  initialSort,
  initialOrder,
}: UsersTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [users, setUsers] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState(initialSort);
  const [order, setOrder] = useState(initialOrder);

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const result = await getUsers(page, pageSize, search, sort, order);
        setUsers(result.users);
        setTotalPages(result.totalPages);
        setTotalUsers(result.totalUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();

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

  const handleVerifyUser = async (userId: string, isVerified: boolean) => {
    try {
      await updateUser(userId, { isVerified });
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, isVerified } : user
        )
      );
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleToggleAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      await updateUser(userId, { isAdmin });
      setUsers(
        users.map((user) => (user.id === userId ? { ...user, isAdmin } : user))
      );
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const openUserDialog = (user: any) => {
    setSelectedUser(user);
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
            placeholder="Search users..."
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
                  onClick={() => toggleSort("name")}
                  className="flex items-center gap-1"
                >
                  Name
                  {sort === "name" &&
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
                  onClick={() => toggleSort("email")}
                  className="flex items-center gap-1"
                >
                  Email
                  {sort === "email" &&
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
              <TableHead className="text-center">Verified</TableHead>
              <TableHead className="text-center">Admin</TableHead>
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
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.name || "N/A"}
                  </TableCell>
                  <TableCell>{user.email || "N/A"}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={user.isVerified}
                      onCheckedChange={(checked) =>
                        handleVerifyUser(user.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={user.isAdmin}
                      onCheckedChange={(checked) =>
                        handleToggleAdmin(user.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openUserDialog(user)}
                    >
                      View Details
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
          Showing {users.length} of {totalUsers} users
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

      <UserDialog
        user={selectedUser}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
