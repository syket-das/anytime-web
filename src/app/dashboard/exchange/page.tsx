"use client";
import {
  Clipboard,
  CreditCard,
  OctagonX,
  RefreshCcw,
  RocketIcon,
  ScanBarcode,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRate } from "@/store/rateStore";
import { useEffect, useState } from "react";
import { useBankStore } from "@/store/bankStore";
import { UserBank } from "@prisma/client";
import calculateInrAmountFromUsdt from "@/utils/calculateInrAmountFromUsdt";
import { useTransactionStore } from "@/store/transactionStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { rates, lastRate, getRates, loading }: any = useRate((state) => state);
  const { banks, getBanks }: any = useBankStore((state) => state);
  const { exchange, getBalance, balance }: any = useTransactionStore(
    (state) => state
  );

  const [selectedBank, setSelectedBank] = useState<UserBank | null>(null);
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    getRates();
    getBanks();
    getBalance();
  }, []);

  const handleExchange = async () => {
    try {
      if (!selectedBank?.id || !amount || !lastRate) {
        toast.error("Please select a bank and enter the amount to exchange");
        return;
      }

      if (amount > balance) {
        toast.error("Insufficient balance");
        return;
      }

      await exchange({
        fromAmount: amount,
        toAmount: amount
          ? calculateInrAmountFromUsdt(amount, lastRate.rate)
          : undefined,
        userBankId: selectedBank.id,
        rateId: lastRate.id,
      });
      toast.success("Transaction initiated successfully");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-2">
      <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 ">
        <Badge variant="outline" className="absolute left-3 top-3">
          Todays Exchange Rate
        </Badge>

        <div className="w-full mb-8 relative flex justify-center">
          <Button
            onClick={() => getRates()}
            variant="outline"
            size={"icon"}
            className="absolute right-12 -top-4 rounded-full"
          >
            <RefreshCcw className="h-5 w-5" />
          </Button>
          <div className="flex flex-col items-center">
            <p className="text-3xl  font-extrabold mt-4 ">
              {loading ? "..." : lastRate ? lastRate.rate : "N/A"}
            </p>
            <p className="text-sm font-extrabold mt-4 ">
              1 USDT = {loading ? "..." : lastRate ? lastRate.rate : "N/A"} INR
            </p>

            <div className=""></div>
          </div>
        </div>

        <Badge variant="default" className="py-2">
          Select Bank Account
        </Badge>

        <div className=" mt-8 grid grid-cols-2 gap-8">
          {banks.map((bank: UserBank) => (
            <Card
              className={`${
                selectedBank?.id === bank.id
                  ? "border-blue-500  ring-1 ring-green-500"
                  : "border-transparent"
              } cursor-pointer`}
              key={bank.id}
              onClick={() => setSelectedBank(bank)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {bank.bankName}
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {bank.accountNo.slice(0, 4)} **** ****{" "}
                  {bank.accountNo.slice(12, -1)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {bank.IFSC} - {bank.branch}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div
        className="relative  flex-col items-start gap-8 md:flex "
        x-chunk="dashboard-03-chunk-0"
      >
        <Alert variant="destructive" className="my-4">
          <OctagonX className="h-4 w-4" />
          <AlertTitle>
            Convinience Fee might be charged for the transaction
          </AlertTitle>
          <AlertDescription>
            Depending on the bank and the amount, a convinience fee might be
            charged for the transaction to be processed. It will be deducted
            from the amount you receive.
          </AlertDescription>
        </Alert>
        <div className="grid w-full items-start gap-6">
          <fieldset className="grid gap-6 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">
              Process Transaction
            </legend>
            <div className="grid gap-3">
              <p className="text-lg font-bold text-pretty text-center">
                You will receive{" "}
                {amount ? calculateInrAmountFromUsdt(amount, lastRate.rate) : 0}{" "}
                INR
              </p>
              <Label htmlFor="hash">Amount (USDT)</Label>

              <Input
                id="hash"
                placeholder="Enter the amount in usdt"
                onChange={(e) => setAmount(Number(e.target.value))}
                value={String(amount)}
                type="number"
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
                onClick={handleExchange}
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
};

export default Page;
