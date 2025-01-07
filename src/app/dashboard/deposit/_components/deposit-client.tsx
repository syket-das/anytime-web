"use client";

import { useState } from "react";
import { AdminBank } from "@prisma/client";
import { AdminBankCard } from "./admin-bank-card";
import DepositForm from "./deposit-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface DepositClientProps {
  adminBanks: AdminBank[];
}

export function DepositClient({ adminBanks }: DepositClientProps) {
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);

  const selectedBank = adminBanks.find((bank) => bank.id === selectedBankId);

  return (
    <div className="grid grid-cols-1  gap-8">
      <div className="flex flex-col gap-4 w-full mt-8">
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>
            BKASH, NAGAD, ROCKET, SURECASH, AND OTHER MOBILE BANKING
          </AlertTitle>
          <AlertDescription>
            If you are depositing via mobile banking, platform charges will be
            deducted from your deposit amount. Please add the charges with your
            deposit amount.
          </AlertDescription>
        </Alert>
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Available Payment Methods</h2>
          <span className="text-sm text-muted-foreground">
            Select a payment method to continue
          </span>
        </div>
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
          {adminBanks.map((bank) => (
            <AdminBankCard
              key={bank.id}
              bank={bank}
              isSelected={bank.id === selectedBankId}
              onSelect={setSelectedBankId}
            />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Deposit Details</h2>
          <span className="text-sm text-muted-foreground">
            Fill in your deposit information
          </span>
        </div>
        <DepositForm selectedBank={selectedBank || null} />
      </div>
    </div>
  );
}
