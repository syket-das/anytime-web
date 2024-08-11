"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components//ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components//ui/chart";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export default function ExchangeRate() {
  return (
    <Card className="flex flex-col h-full relative">
      <CardHeader>
        <CardTitle>Today{`'s`} Exchange Rate</CardTitle>
        <CardDescription className="text-2xl">89</CardDescription>
      </CardHeader>

      <Button
        size={"icon"}
        variant={"ghost"}
        className="absolute top-4 right-4 rounded-full"
      >
        <RefreshCcw className="h-5 w-5" />
      </Button>

      <CardContent className="flex flex-1 items-center">
        <ChartContainer
          config={{
            resting: {
              label: "Resting",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="w-full"
        >
          <LineChart
            accessibilityLayer
            margin={{
              left: 14,
              right: 14,
              top: 10,
            }}
            data={[
              {
                date: "2024-01-01",
                resting: 62,
              },
              {
                date: "2024-01-02",
                resting: 72,
              },
              {
                date: "2024-01-03",
                resting: 35,
              },
              {
                date: "2024-01-04",
                resting: 62,
              },
              {
                date: "2024-01-05",
                resting: 52,
              },
              {
                date: "2024-01-06",
                resting: 62,
              },
              {
                date: "2024-01-07",
                resting: 70,
              },
            ]}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="hsl(var(--muted-foreground))"
              strokeOpacity={0.5}
            />
            <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                });
              }}
            />
            <Line
              dataKey="resting"
              type="natural"
              fill="var(--color-resting)"
              stroke="var(--color-resting)"
              strokeWidth={2}
              dot={false}
              activeDot={{
                fill: "var(--color-resting)",
                stroke: "var(--color-resting)",
                r: 4,
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    });
                  }}
                />
              }
              cursor={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
