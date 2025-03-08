"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createExchangeRate,
  updateExchangeRate,
} from "@/actions/admin-actions";
import { Loader2 } from "lucide-react";

interface ExchangeRateDialogProps {
  rate: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  onSuccess: () => void;
}

export function ExchangeRateDialog({
  rate,
  open,
  onOpenChange,
  isEditing,
  onSuccess,
}: ExchangeRateDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [from, setFrom] = useState<string>(rate?.from || "USDT");
  const [to, setTo] = useState<string>(rate?.to || "INR");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      if (isEditing && rate) {
        await updateExchangeRate(rate.id, formData);
      } else {
        await createExchangeRate(formData);
      }

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Failed to save exchange rate:", error);
      setError("Failed to save exchange rate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Exchange Rate" : "Add Exchange Rate"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the exchange rate details below."
              : "Fill in the details to add a new exchange rate."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from">From Currency</Label>
              <Select
                name="from"
                defaultValue={rate?.from || "USDT"}
                onValueChange={setFrom}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USDT">USDT</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                  <SelectItem value="BDT">BDT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to">To Currency</Label>
              <Select
                name="to"
                defaultValue={rate?.to || "INR"}
                onValueChange={setTo}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USDT">USDT</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                  <SelectItem value="BDT">BDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate">Exchange Rate</Label>
            <Input
              id="rate"
              name="rate"
              type="number"
              step="0.0001"
              min="0.0001"
              defaultValue={rate?.rate || "1.0000"}
              required
            />
            <p className="text-sm text-muted-foreground">
              1 {from} = ? {to}
            </p>
          </div>

          {error && (
            <div className="text-sm font-medium text-red-500">{error}</div>
          )}

          {from === to && (
            <div className="text-sm font-medium text-amber-500">
              Warning: From and To currencies are the same.
            </div>
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
            <Button type="submit" disabled={loading || from === to}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update" : "Add"} Rate
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
