"use client";

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

export default function ExchangeCalculator() {
  return (
    <Card className=" h-full">
      <CardHeader className="p-4 pb-0">
        <CardTitle>Exchnage Calculator</CardTitle>
        <CardDescription>Calculate your exchanges here</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-baseline gap-4 p-4 pt-0 ">
        <div className="flex flex-col md:flex-row items-center justify-between  my-4 w-full gap-4 flex-1">
          <Input placeholder="INR" className="w-full" />
          <ArrowLeftRight className="h-8 w-8 mx-auto" />
          <Input placeholder="USDT" className="w-full" />
        </div>

        <div className="my-2 flex justify-center gap-4 items-center w-full">
          <Button variant="default" size="default">
            <ArrowDown className="h-6 w-6" /> Deposit
          </Button>
          <Button variant="default" size="default">
            <ArrowUp className="h-6 w-6" /> Withdraw
          </Button>
          <Button variant="default" size="default">
            <ArrowUpDown className="h-6 w-6" /> Exchange
          </Button>
        </div>
      </CardContent>
      <CardFooter className="p-4">
        {" "}
        <div className="flex justify-between items-center w-full ">
          <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
            89
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
                {
                  date: "2024-01-01",
                  steps: 2000,
                },
                {
                  date: "2024-01-02",
                  steps: 2100,
                },
                {
                  date: "2024-01-03",
                  steps: 2200,
                },
                {
                  date: "2024-01-04",
                  steps: 1300,
                },
                {
                  date: "2024-01-05",
                  steps: 1400,
                },
                {
                  date: "2024-01-06",
                  steps: 2500,
                },
                {
                  date: "2024-01-07",
                  steps: 1600,
                },
              ]}
            >
              <Bar
                dataKey="steps"
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
