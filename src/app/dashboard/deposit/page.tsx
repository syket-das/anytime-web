"use client";
import { Clipboard, OctagonX, RocketIcon, ScanBarcode } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import { QRCode } from "react-qrcode-logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTransactionStore } from "@/store/transactionStore";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function Page() {
  const [transactionId, setTransactionId] = useState("");

  const {
    getBalance,
    balance,
    depositWallets,
    getDepositWallets,
    deposit,
  }: any = useTransactionStore((state) => state);

  useEffect(() => {
    getBalance();
    getDepositWallets();
  }, []);

  const handleVerify = async () => {
    if (!transactionId) {
      toast.error("Please enter a valid transaction id");
      return;
    }

    try {
      await deposit(transactionId);

      toast.success("Transaction verified successfully", {
        position: "top-center",
      });
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-center",
      });
    }
  };

  return (
    <div className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-2">
      <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 ">
        <Badge variant="outline" className="absolute right-3 top-3">
          Output
        </Badge>
        <div className="flex-1 flex flex-col  items-center">
          <QRCode value={depositWallets[0]?.address} qrStyle="squares" />
          <p className="text-sm font-extrabold mt-4 animate-pulse">
            BEP20 - USDT
          </p>

          <div className="flex items-center gap-2 mt-4  pl-2 rounded">
            <p className="text-sm font-medium">{depositWallets[0]?.address}</p>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(depositWallets[0]?.address);
                toast.success("Address copied to clipboard", {
                  position: "top-center",
                });
              }}
              variant="outline"
              size="icon"
            >
              <Clipboard className="" size={20} />
            </Button>
          </div>

          <div className="flex flex-col gap-4 w-full mt-8">
            <Alert variant="destructive">
              <OctagonX className="h-4 w-4" />
              <AlertTitle>BEP20 - USDT Only</AlertTitle>
              <AlertDescription>
                Please do not send any other token to this address as it will
                not get credited to your account
              </AlertDescription>
            </Alert>
            <Alert>
              <ScanBarcode className="h-4 w-4" />
              <AlertTitle>Scan & Pay</AlertTitle>
              <AlertDescription>
                Scan the QR code or copy the address to deposit usdt in your
                wallet
              </AlertDescription>
            </Alert>

            <Alert>
              <ScanBarcode className="h-4 w-4" />
              <AlertTitle>Gas Fee</AlertTitle>
              <AlertDescription>
                Please make sure to add the correct gas fee to recieve the excat
                amount in your wallet
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
      <div
        className="relative  flex-col items-start gap-8 md:flex "
        x-chunk="dashboard-03-chunk-0"
      >
        <div className="grid w-full items-start gap-6">
          <fieldset className="grid gap-6 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">
              Transaction Verification
            </legend>
            <div className="grid gap-3">
              <Label htmlFor="hash">Transaction Id/ Hash</Label>

              <Input
                onChange={(e) => setTransactionId(e.target.value)}
                value={transactionId}
                id="hash"
                placeholder="Enter trxhash or transaction id "
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="You are a..."
                className="min-h-[9.5rem]"
              />
            </div>

            <div className="grid gap-3 lg:grid-cols-3">
              <Button
                onClick={handleVerify}
                variant="default"
                className="w-full"
              >
                Verify
              </Button>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}

export default Page;
