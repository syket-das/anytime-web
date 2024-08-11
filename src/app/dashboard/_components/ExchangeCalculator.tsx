"use client";
import { useEffect, useState } from "react";

import { Bar, BarChart, Rectangle, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components//ui/card";
import { ChartContainer } from "@/components//ui/chart";
import { Input } from "@/components/ui/input";
import { ArrowDown, ArrowLeftRight, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRate } from "@/store/rateStore";
import { format, set } from "date-fns";
import { useRouter } from "next/navigation";

export default function ExchangeCalculator() {
  const router = useRouter();
  const { rates, lastRate, getRates, loading }: any = useRate((state) => state);
  const [inr, setInr] = useState(0);
  const [usdt, setUsdt] = useState(0);

  if (loading || !lastRate) return <Card className=" h-full">Loading...</Card>;

  return (
    <Card className=" h-full">
      <CardHeader className="p-4 pb-0">
        <CardTitle>Exchnage Calculator</CardTitle>
        <CardDescription>Calculate your exchanges here</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-baseline gap-4 p-4 pt-0 ">
        <div className="flex flex-col md:flex-row items-center justify-between  my-4 w-full gap-4 flex-1">
          <Input
            value={inr}
            onChange={(e) => {
              setInr(e.target.value as any);
              setUsdt((e.target.value as any) / lastRate.rate);
            }}
            placeholder="INR"
            className="w-full"
          />
          <ArrowLeftRight className="h-8 w-8 mx-auto" />
          <Input
            value={usdt}
            onChange={(e) => {
              setUsdt(e.target.value as any);
              setInr((e.target.value as any) * lastRate.rate);
            }}
            placeholder="USDT"
            className="w-full"
          />
        </div>

        <div className="my-2 flex justify-center gap-4 items-center w-full">
          <Button
            variant="default"
            size="default"
            onClick={() => {
              router.push("/dashboard/deposit");
            }}
          >
            <ArrowDown className="h-6 w-6" /> Deposit
          </Button>
          <Button
            variant="default"
            size="default"
            onClick={() => {
              router.push("/dashboard/withdraw");
            }}
          >
            <ArrowUp className="h-6 w-6" /> Withdraw
          </Button>
          <Button
            variant="default"
            size="default"
            onClick={() => {
              router.push("/dashboard/exchange");
            }}
          >
            <ArrowUpDown className="h-6 w-6" /> Exchange
          </Button>
        </div>
      </CardContent>
      <CardFooter className="p-4">
        {" "}
        <div className="flex justify-between items-center w-full ">
          <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
            {lastRate?.rate}
            <span className="text-sm font-normal text-muted-foreground">
              INR = 1 USDT
            </span>
          </div>
          <ChartContainer
            config={{
              steps: {
                label: "Steps",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="ml-auto w-[72px]"
          >
            <BarChart
              accessibilityLayer
              margin={{
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }}
              data={[
                ...rates.map((rate: any) => ({
                  date: format(rate.createdAt, "yyyy-MM-dd"),
                  rate: rate.rate,
                })),
              ]}
            >
              <Bar
                dataKey="rate"
                fill="var(--color-steps)"
                radius={2}
                fillOpacity={0.2}
                activeIndex={6}
                activeBar={<Rectangle fillOpacity={0.8} />}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                hide
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardFooter>
    </Card>
  );
}
