"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadButton } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { createDeposit } from "@/actions/depositActions";
import { AdminBank } from "@prisma/client";
import { toast } from "@/components/ui/use-toast";

interface DepositFormProps {
  selectedBank: AdminBank | null;
}

export default function DepositForm({ selectedBank }: DepositFormProps) {
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBank) {
      toast({
        title: "No bank selected",
        description: "Please select a bank account first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("adminBankId", selectedBank.id);
    formData.append("imageUrl", imageUrl);
    formData.append("transactionId", transactionId || "NA");

    try {
      const result = await createDeposit(formData);
      if (result.success) {
        toast({
          title: "Deposit submitted",
          description: "Your deposit request has been submitted successfully.",
        });
        router.push("/deposits");
      } else {
        throw new Error("Failed to create deposit");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit deposit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (BDT)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter deposit amount"
              required
              min="100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transactionId">Transaction ID (Optional)</Label>
            <Input
              id="transactionId"
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter transaction ID or leave empty for NA"
            />
          </div>

          {}

          <div className="space-y-2">
            <Label>Upload Payment Proof</Label>
            <div className="grid gap-4">
              <CldUploadButton
                uploadPreset="qig2a425"
                onSuccess={(result: any) => {
                  console.log("upload success", result);
                  setImageUrl(result.info.url);
                  toast({
                    title: "Image uploaded",
                    description:
                      "Your payment proof has been uploaded successfully.",
                  });
                }}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                Upload Image
              </CldUploadButton>
              {imageUrl && (
                <div className="rounded-md border p-2">
                  <img
                    src={imageUrl}
                    alt="Payment proof"
                    className="rounded-md max-h-[500px] w-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {selectedBank && (
            <div className="rounded-md bg-muted p-4">
              <p className="font-medium">Selected Bank Account</p>
              <p className="text-sm text-muted-foreground">
                {selectedBank.type} - {selectedBank.accountNo}
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !imageUrl || !selectedBank}
            className="w-full"
          >
            {isLoading ? "Processing..." : "Submit Deposit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
