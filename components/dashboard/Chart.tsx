"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChartSeries {
  label: string;
  data: number[];
  color?: string;
}

export interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  labels?: string[];
  data?: number[];
  series?: ChartSeries[];
  currentValue?: string | number;
  currentChange?: string;
  yMin?: number;
  yMax?: number;
}

const defaultMonths = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export function Chart({
  title = "Attendance rate",
  subtitle = "Monthly average",
  labels = defaultMonths,
  data = [64, 72, 69, 82, 76, 88, 91, 86, 94, 89, 96, 92],
  currentValue = "94.8%",
  currentChange = "+2.4%",
  className,
  ...props
}: ChartProps) {
  const points = React.useMemo(() => {
    if (!data || data.length === 0) return "";
    const min = Math.min(...data, 0);
    const max = Math.max(...data, 100);
    const range = max - min || 1;
    return data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - ((value - min) / range) * 85;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [data]);

  return (
    <div className={cn("panel p-5", className)} {...props}>
      <div className="panel-heading flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold text-(--foreground)">{title}</h2>
          <p className="text-xs text-(--muted) mt-0.5">{subtitle}</p>
        </div>
      </div>

      <div className="chart-legend flex items-center justify-between mt-4">
        <span className="text-xs text-(--muted) flex items-center gap-1.5">
          <i className="legend-dot blue size-2 rounded-full bg-(--blue)" /> Rate
        </span>
        <div>
          <strong className="text-base font-bold text-(--foreground)">{currentValue}</strong>
          {currentChange && (
            <small className="text-xs text-(--green) font-medium ml-1.5">{currentChange}</small>
          )}
        </div>
      </div>

      <div className="chart-wrap flex mt-4 h-40">
        <div className="chart-y flex flex-col justify-between text-[10px] text-(--muted) pb-4 w-9">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>
        <div className="chart-area flex-1 relative">
          <div className="chart-grid absolute inset-0 bottom-4 flex flex-col justify-between pointer-events-none">
            <i className="border-t border-dashed border-(--line) block" />
            <i className="border-t border-dashed border-(--line) block" />
            <i className="border-t border-dashed border-(--line) block" />
            <i className="border-t border-dashed border-(--line) block" />
            <i className="border-t border-dashed border-(--line) block" />
          </div>
          <svg
            className="line-chart absolute inset-0 w-full h-[calc(100%-16px)] overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-label="Chart trend"
          >
            <defs>
              <linearGradient id="chartFillGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--blue)" stopOpacity=".25" />
                <stop offset="100%" stopColor="var(--blue)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {points && (
              <>
                <polygon
                  points={`0,100 ${points} 100,100`}
                  fill="url(#chartFillGrad)"
                />
                <polyline
                  points={points}
                  fill="none"
                  stroke="var(--blue)"
                  strokeWidth="2.4"
                  vectorEffect="non-scaling-stroke"
                />
              </>
            )}
          </svg>
          <div className="chart-x absolute left-0 right-0 bottom-0 flex justify-between text-[10px] text-(--muted)">
            {labels.map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
