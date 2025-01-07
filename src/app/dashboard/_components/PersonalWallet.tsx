"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useTransactionStore } from "@/store/transactionStore";

const PersonalWallet = () => {
  const { getBalance, balance, depositWallets, getDepositWallets }: any =
    useTransactionStore((state) => state);

  React.useEffect(() => {
    getBalance();
    getDepositWallets();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Personal Wallet</CardTitle>
        <CardDescription>Manage your personal wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex  gap-2 w-full justify-center">
          <p className="text-3xl  font-bold">{balance?.toFixed(2)} </p>
          <p className="text-muted-foreground text-sm mt-auto font-bold">BDT</p>
        </div>
        <p className="text-center text-sm text-muted-foreground border rounded-full px-4 py-1 w-fit mx-auto my-2">
          Available Balance
        </p>
      </CardContent>
      <CardFooter className="block">
        <p className="font-bold text-center text-sm text-muted-foreground">
          This is your personal wallet balance. You can deposit money to your
          wallet
        </p>
      </CardFooter>
    </Card>
  );
};

export default PersonalWallet;
