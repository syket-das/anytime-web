import { AdminBank } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface AdminBankCardProps {
  bank: AdminBank;
  isSelected: boolean;
  onSelect: (bankId: string) => void;
}

export function AdminBankCard({
  bank,
  isSelected,
  onSelect,
}: AdminBankCardProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The account number has been copied to your clipboard.",
    });
  };

  return (
    <Card
      className={`relative transition-all hover:border-primary ${
        isSelected ? "border-2 border-primary" : ""
      }`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>{bank.type}</span>
          {isSelected && <Check className="h-5 w-5 text-primary" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Account Number</p>
              <p className="font-mono text-sm">{bank.accountNo}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(bank.accountNo)}
              className="h-8 w-8"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-between  space-x-4">
            {bank.accountName && (
              <div>
                <p className="text-sm font-medium">Account Name</p>
                <p className="text-sm text-muted-foreground">
                  {bank.accountName}
                </p>
              </div>
            )}
            {bank.branch && (
              <div>
                <p className="text-sm font-medium">Branch</p>
                <p className="text-sm text-muted-foreground">{bank.branch}</p>
              </div>
            )}
          </div>

          {bank.fullDetails && (
            <div>
              <p className="text-sm font-medium">Full Details</p>
              <p className="text-sm text-muted-foreground">
                {bank.fullDetails}
              </p>
            </div>
          )}

          <Button
            className="w-full"
            variant="outline"
            onClick={() => onSelect(bank.id)}
          >
            {isSelected ? "Selected" : "Select This Account"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
