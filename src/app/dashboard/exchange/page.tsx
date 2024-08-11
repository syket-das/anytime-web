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

const page = () => {
  return (
    <div className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-2">
      <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 ">
        <Badge variant="outline" className="absolute left-3 top-3">
          Todays Exchange Rate
        </Badge>

        <div className="w-full mb-8 relative flex justify-center">
          <Button
            variant="outline"
            size={"icon"}
            className="absolute right-12 -top-4 rounded-full"
          >
            <RefreshCcw className="h-5 w-5" />
          </Button>
          <div className="flex flex-col items-center">
            <p className="text-3xl  font-extrabold mt-4 animate-pulse">80</p>
            <p className="text-sm font-extrabold mt-4 animate-pulse">
              1 USDT = 80 INR
            </p>

            <div className=""></div>
          </div>
        </div>

        <Badge variant="default" className="py-2">
          Available Cards
        </Badge>

        <div className=" mt-8 grid grid-cols-2 gap-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <div
        className="relative  flex-col items-start gap-8 md:flex "
        x-chunk="dashboard-03-chunk-0"
      >
        <Alert variant="destructive">
          <OctagonX className="h-4 w-4" />
          <AlertTitle>BEP20 - USDT Only</AlertTitle>
          <AlertDescription>
            Please do not send any other token to this address as it will not
            get credited to your account
          </AlertDescription>
        </Alert>
        <form className="grid w-full items-start gap-6">
          <fieldset className="grid gap-6 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">
              Transaction Verification
            </legend>
            <div className="grid gap-3">
              <Label htmlFor="hash">Transaction Id/ Hash</Label>

              <Input
                id="hash"
                placeholder="0x4b0897b0513fdc7c541b6d9d7e929c4e5364d2db"
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
              <Button variant="default" className="w-full">
                Verify
              </Button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default page;
