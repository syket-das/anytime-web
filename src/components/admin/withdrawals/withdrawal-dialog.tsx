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
import { updateWithdrawalStatus } from "@/actions/admin-actions";
import { formatCurrency, formatDateTime, STATUS_COLORS } from "@/lib/utils";
import { Loader2, Copy, Check } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WithdrawalDialogProps {
  withdrawal: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function WithdrawalDialog({
  withdrawal,
  open,
  onOpenChange,
  onSuccess,
}: WithdrawalDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [remark, setRemark] = useState<string>("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Initialize form values when withdrawal changes
  useEffect(() => {
    if (withdrawal) {
      setStatus(withdrawal.status);
      setTransactionId(withdrawal.transactionId || "");
      setRemark(withdrawal.remark || "");
    }
  }, [withdrawal]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // If status is changing to SUCCESS or FAILED, show confirmation dialog
    if (
      withdrawal.status !== status &&
      (status === "SUCCESS" || status === "FAILED")
    ) {
      setConfirmDialogOpen(true);
      return;
    }

    await updateWithdrawalStatusHandler();
  };

  const updateWithdrawalStatusHandler = async () => {
    setLoading(true);
    setError(null);

    try {
      await updateWithdrawalStatus(
        withdrawal.id,
        status,
        transactionId,
        remark
      );
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update withdrawal status:", error);
      setError("Failed to update withdrawal status. Please try again.");
    } finally {
      setLoading(false);
      setConfirmDialogOpen(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!withdrawal) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Withdrawal Details</DialogTitle>
            <DialogDescription>
              View and manage withdrawal information.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={withdrawal.user?.image || ""}
                  alt={withdrawal.user?.name || "User"}
                />
                <AvatarFallback>
                  {getInitials(
                    withdrawal.user?.name || withdrawal.user?.email || "User"
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">
                  {withdrawal.user?.name || "N/A"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {withdrawal.user?.email || "N/A"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Wallet Address</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            copyToClipboard(withdrawal.walletAddress)
                          }
                        >
                          {copied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{copied ? "Copied!" : "Copy to clipboard"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm break-all">{withdrawal.walletAddress}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Amount</p>
                <p className="text-sm">
                  {formatCurrency(withdrawal.amount, withdrawal.currency)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Convenience Fee</p>
                <p className="text-sm">
                  {formatCurrency(withdrawal.convienceFee, withdrawal.currency)}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Net Amount</p>
                <p className="text-sm font-bold">
                  {formatCurrency(
                    withdrawal.amount - withdrawal.convienceFee,
                    withdrawal.currency
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Currency</p>
                <p className="text-sm">{withdrawal.currency}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge className={STATUS_COLORS[withdrawal.status]}>
                  {withdrawal.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm">
                  {formatDateTime(withdrawal.createdAt)}
                </p>
              </div>

              {withdrawal.reference && (
                <div className="col-span-2">
                  <p className="text-sm font-medium">Reference</p>
                  <p className="text-sm break-all">{withdrawal.reference}</p>
                </div>
              )}

              {withdrawal.transactionId && (
                <div className="col-span-2">
                  <p className="text-sm font-medium">Transaction ID</p>
                  <p className="text-sm break-all">
                    {withdrawal.transactionId}
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
                  placeholder="Enter transaction ID (for successful withdrawals)"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Remark</label>
                <Textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Add a remark or note about this withdrawal"
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
                  Update Withdrawal
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
                ? "Are you sure you want to mark this withdrawal as successful? This confirms funds have been sent to the user."
                : "Are you sure you want to mark this withdrawal as failed? This will notify the user."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={updateWithdrawalStatusHandler}>
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
