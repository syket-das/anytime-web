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

const ActionButtons = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Personal Wallet</CardTitle>
        <CardDescription>Manage your personal wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex  gap-2 w-full justify-center">
          <p className="text-3xl  font-bold">800 </p>
          <p className="text-muted-foreground text-sm mt-auto font-bold">
            USDT
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground border rounded-full px-4 py-1 w-fit mx-auto my-2">
          Available Balance
        </p>
      </CardContent>
      <CardFooter className="block">
        <p className="font-bold">Your Wallet Address</p>
        <div className="flex gap-2 items-center justify-between  rounded pl-2">
          <p className="text-muted-foreground truncate">
            0x8e8e2bahshjksjsjsj7474646hsdbjksdbksdksdhkjhk
          </p>
          <Button variant="outline" size="sm" className="">
            <Copy className="text-muted-foreground" size={16} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ActionButtons;
