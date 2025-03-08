"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { updateDepositStatus as ud } from "@/actions/admin-actions";
import { formatCurrency, formatDateTime, STATUS_COLORS } from "@/lib/utils";
import { Loader2, ExternalLink } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
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

interface DepositDialogProps {
  deposit: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DepositDialog({
  deposit,
  open,
  onOpenChange,
  onSuccess,
}: DepositDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [remark, setRemark] = useState<string>("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Initialize form values when deposit changes
  useEffect(() => {
    if (deposit) {
      setStatus(deposit.status);
      setRemark(deposit.remark || "");
    }
  }, [deposit]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // If status is changing to SUCCESS or FAILED, show confirmation dialog
    if (
      deposit.status !== status &&
      (status === "SUCCESS" || status === "FAILED")
    ) {
      setConfirmDialogOpen(true);
      return;
    }

    await updateDepositStatus();
  };

  const updateDepositStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      await ud(deposit.id, status, remark);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update deposit status:", error);
      setError("Failed to update deposit status. Please try again.");
    } finally {
      setLoading(false);
      setConfirmDialogOpen(false);
    }
  };

  if (!deposit) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Deposit Details</DialogTitle>
            <DialogDescription>
              View and manage deposit information.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={deposit.user?.image || ""}
                  alt={deposit.user?.name || "User"}
                />
                <AvatarFallback>
                  {getInitials(
                    deposit.user?.name || deposit.user?.email || "User"
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{deposit.user?.name || "N/A"}</h3>
                <p className="text-sm text-muted-foreground">
                  {deposit.user?.email || "N/A"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Transaction ID</p>
                <p className="text-sm break-all">{deposit.transactionId}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Amount</p>
                <p className="text-sm">
                  {formatCurrency(deposit.amount, deposit.currency)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Convenience Fee</p>
                <p className="text-sm">
                  {formatCurrency(deposit.convienceFee, deposit.currency)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Amount</p>
                <p className="text-sm font-bold">
                  {formatCurrency(
                    deposit.amount + deposit.convienceFee,
                    deposit.currency
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge className={STATUS_COLORS[deposit.status]}>
                  {deposit.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm">{formatDateTime(deposit.createdAt)}</p>
              </div>
              {deposit.adminBank && (
                <div className="col-span-2">
                  <p className="text-sm font-medium">Admin Bank</p>
                  <p className="text-sm">
                    {deposit.adminBank.type} - {deposit.adminBank.accountNo}
                    {deposit.adminBank.accountName &&
                      ` (${deposit.adminBank.accountName})`}
                  </p>
                </div>
              )}
              {deposit.wallet && (
                <div className="col-span-2">
                  <p className="text-sm font-medium">Wallet Address</p>
                  <p className="text-sm break-all">{deposit.wallet.address}</p>
                </div>
              )}
            </div>

            {deposit.media && (
              <div className="col-span-2 space-y-2">
                <p className="text-sm font-medium">Proof of Payment</p>
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative h-64 w-full">
                      <Image
                        src={deposit.media.url || "/placeholder.svg"}
                        alt="Payment Proof"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="p-2 flex justify-end">
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={deposit.media.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Full Image
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <label className="text-sm font-medium">Update Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="SUCCESS">Success</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="NOT_VERIFIED">Not Verified</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Remark</label>
                <Textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Add a remark or note about this deposit"
                  className="min-h-[100px]"
                />
              </div>

              {error && (
                <div className="text-sm font-medium text-red-500">{error}</div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Deposit
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
            <AlertDialogDescription>
              {status === "SUCCESS"
                ? "Are you sure you want to mark this deposit as successful? This will credit the user's account."
                : "Are you sure you want to mark this deposit as failed? This will notify the user."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={updateDepositStatus}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}
