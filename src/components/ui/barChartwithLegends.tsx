"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type BarChartData = Record<string, number | string>;
type BarConfig = {
  label: string;
  color: string;
};

interface BarChartProps {
  data: BarChartData[];
  config: Record<string, BarConfig>;
  title?: string;
  description?: string;
  trendingValue?: number;
  footerText?: string;
}

export function Component({
  data,
  config,
  title = "Bar Chart - Stacked + Legend",
  description = "",
  trendingValue,
  footerText,
}: BarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            {Object.keys(config).map((key, index, array) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={`var(--color-${key})`}
                radius={[
                  index === 0 ? 4 : 0,
                  index === 0 ? 4 : 0,
                  index === array.length - 1 ? 4 : 0,
                  index === array.length - 1 ? 4 : 0,
                ]}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
      {(trendingValue || footerText) && (
        <CardFooter className="flex-col items-start gap-2 text-md">
          {trendingValue && (
            <div className="flex gap-2 font-medium leading-none">
              Trending {trendingValue > 0 ? "up" : "down"} by{" "}
              {Math.abs(trendingValue)}% this month{" "}
              <TrendingUp className="h-4 w-4" />
            </div>
          )}
          {footerText && (
            <div className="leading-none text-muted-foreground">
              {footerText}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
