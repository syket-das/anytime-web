// @ts-nocheck
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
import { Input } from "@/components/ui/input";
import { updateExchangeStatus } from "@/actions/admin-actions";
import { formatCurrency, formatDateTime, STATUS_COLORS } from "@/lib/utils";
import { Loader2, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

interface ExchangeDialogProps {
  exchange: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ExchangeDialog({
  exchange,
  open,
  onOpenChange,
  onSuccess,
}: ExchangeDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [remark, setRemark] = useState<string>("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Initialize form values when exchange changes
  useEffect(() => {
    if (exchange) {
      setStatus(exchange.status);
      setTransactionId(exchange.transactionId || "");
      setRemark(exchange.remark || "");
    }
  }, [exchange]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // If status is changing to SUCCESS or FAILED, show confirmation dialog
    if (
      exchange.status !== status &&
      (status === "SUCCESS" || status === "FAILED")
    ) {
      setConfirmDialogOpen(true);
      return;
    }

    await updateExchangeStatusHandler();
  };

  const updateExchangeStatusHandler = async () => {
    setLoading(true);
    setError(null);

    try {
      await updateExchangeStatus(exchange.id, status, transactionId, remark);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update exchange status:", error);
      setError("Failed to update exchange status. Please try again.");
    } finally {
      setLoading(false);
      setConfirmDialogOpen(false);
    }
  };

  if (!exchange) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Exchange Details</DialogTitle>
            <DialogDescription>
              View and manage exchange information.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={exchange.user?.image || ""}
                  alt={exchange.user?.name || "User"}
                />
                <AvatarFallback>
                  {getInitials(
                    exchange.user?.name || exchange.user?.email || "User"
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{exchange.user?.name || "N/A"}</h3>
                <p className="text-sm text-muted-foreground">
                  {exchange.user?.email || "N/A"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <p className="text-sm font-medium">Exchange</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{exchange.from}</Badge>
                  <ArrowRight className="h-4 w-4" />
                  <Badge variant="outline">{exchange.to}</Badge>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">From Amount</p>
                <p className="text-sm">
                  {formatCurrency(exchange.fromAmount, exchange.from)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">To Amount</p>
                <p className="text-sm">
                  {exchange.toAmount
                    ? formatCurrency(exchange.toAmount, exchange.to)
                    : "Calculating..."}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Exchange Rate</p>
                <p className="text-sm">
                  1 {exchange.from} = {exchange.exchangeRate?.rate.toFixed(4)}{" "}
                  {exchange.to}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Convenience Fee</p>
                <p className="text-sm">
                  {formatCurrency(exchange.convienceFee, exchange.from)}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge className={STATUS_COLORS[exchange.status]}>
                  {exchange.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm">{formatDateTime(exchange.createdAt)}</p>
              </div>

              {exchange.reference && (
                <div className="col-span-2">
                  <p className="text-sm font-medium">Reference</p>
                  <p className="text-sm break-all">{exchange.reference}</p>
                </div>
              )}

              {exchange.transactionId && (
                <div className="col-span-2">
                  <p className="text-sm font-medium">Transaction ID</p>
                  <p className="text-sm break-all">{exchange.transactionId}</p>
                </div>
              )}

              {exchange.bank && (
                <div className="col-span-2">
                  <p className="text-sm font-medium">User Bank</p>
                  <p className="text-sm">
                    {exchange.bank.bankName} - {exchange.bank.accountNo}
                    {exchange.bank.accountName &&
                      ` (${exchange.bank.accountName})`}
                  </p>
                  <p className="text-sm">
                    IFSC: {exchange.bank.IFSC}, Branch: {exchange.bank.branch}
                  </p>
                </div>
              )}
            </div>

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
                <label className="text-sm font-medium">Transaction ID</label>
                <Input
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter transaction ID (for successful exchanges)"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Remark</label>
                <Textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Add a remark or note about this exchange"
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
                  Update Exchange
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
                ? "Are you sure you want to mark this exchange as successful? This will complete the transaction."
                : "Are you sure you want to mark this exchange as failed? This will notify the user."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={updateExchangeStatusHandler}>
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
