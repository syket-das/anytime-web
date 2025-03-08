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
import { Textarea } from "@/components/ui/textarea";
import { createAdminBank, updateAdminBank } from "@/actions/admin-actions";
import { Loader2 } from "lucide-react";

interface AdminBankDialogProps {
  bank: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  onSuccess: () => void;
}

export function AdminBankDialog({
  bank,
  open,
  onOpenChange,
  isEditing,
  onSuccess,
}: AdminBankDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      if (isEditing && bank) {
        await updateAdminBank(bank.id, formData);
      } else {
        await createAdminBank(formData);
      }

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Failed to save admin bank:", error);
      setError("Failed to save admin bank. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Admin Bank" : "Add Admin Bank"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the admin bank details below."
              : "Fill in the details to add a new admin bank."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Bank Type</Label>
              <Input
                id="type"
                name="type"
                defaultValue={bank?.type || ""}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNo">Account Number</Label>
              <Input
                id="accountNo"
                name="accountNo"
                defaultValue={bank?.accountNo || ""}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                name="accountName"
                defaultValue={bank?.accountName || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Input
                id="branch"
                name="branch"
                defaultValue={bank?.branch || ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullDetails">Full Details</Label>
            <Textarea
              id="fullDetails"
              name="fullDetails"
              defaultValue={bank?.fullDetails || ""}
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
              {isEditing ? "Update" : "Add"} Bank
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
