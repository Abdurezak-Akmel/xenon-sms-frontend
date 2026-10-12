"use client";

import { Chart } from "./Chart";

export type PlatformGrowthData = {
  title: string;
  subtitle: string;
  labels: string[];
  data: number[];
  currentValue: string | number;
  currentChange: string;
};

export function PlatformGrowth({
  className,
  growth,
}: {
  className?: string;
  growth: PlatformGrowthData;
}) {
  return (
    <Chart
      className={className}
      {...growth}
    />
  );
}
