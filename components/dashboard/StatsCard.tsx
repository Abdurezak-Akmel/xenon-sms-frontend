"use client";

import * as React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/route_protection/ProtectedRoute";

export type StatsCardTone =
  | "blue"
  | "green"
  | "orange"
  | "red"
  | "violet"
  | "teal"
  | "neutral";

export type StatsCardTrend = "up" | "down" | "neutral" | "none";

export interface StatsCardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  /** The metric label or card title */
  title?: React.ReactNode;
  /** Alias for title to maintain backward compatibility */
  label?: React.ReactNode;
  /** Main stat value (e.g. "1,248", "$48,290", 94.8%) */
  value: React.ReactNode;
  /** Icon component or JSX element */
  icon?: LucideIcon | React.ReactNode;
  /** Color theme for icon badge and subtle accents */
  tone?: StatsCardTone;
  /** Trend direction for percentage/change indicator */
  trend?: StatsCardTrend;
  /** Change percentage or text (e.g. "+8.2%", "Needs review") */
  change?: React.ReactNode;
  /** Descriptive context for the change (e.g. "vs last month") */
  changeLabel?: React.ReactNode;
  /** Secondary subtitle or helper text */
  description?: React.ReactNode;
  /** Optional badge displayed in the header */
  badge?: React.ReactNode;
  /** Custom action button or menu node in the top right */
  action?: React.ReactNode;
  /** Callback when the default action button (3-dots) is clicked */
  onAction?: () => void;
  /** Accessible label for the default action button */
  actionLabel?: string;
  /** Shows skeleton shimmer placeholder during loading states */
  loading?: boolean;
  /** Optional custom footer or mini chart below the main stat */
  footer?: React.ReactNode;
}

const toneClasses: Record<StatsCardTone, string> = {
  blue: "bg-[#edf3ff] text-[#3267d6] dark:bg-[#1e3765] dark:text-[#6a9bf7]",
  green: "bg-[#e8f6ee] text-[#2f9a67] dark:bg-[#183929] dark:text-[#52c98d]",
  orange: "bg-[#fff2df] text-[#d98128] dark:bg-[#3d2a13] dark:text-[#f3a456]",
  red: "bg-[#fdeaea] text-[#d95757] dark:bg-[#3d1818] dark:text-[#f27e7e]",
  violet: "bg-[#f0ebff] text-[#7957c7] dark:bg-[#2c1b52] dark:text-[#aa8bf5]",
  teal: "bg-[#daf2f1] text-[#358684] dark:bg-[#143433] dark:text-[#5cc8c5]",
  neutral: "bg-(--background) text-(--muted)",
};

export function StatsCard({
  title,
  label,
  value,
  icon,
  tone = "blue",
  trend,
  change,
  changeLabel,
  description,
  badge,
  action,
  onAction,
  actionLabel,
  loading = false,
  footer,
  className,
  onClick,
  ...props
}: StatsCardProps) {
  const displayTitle = title ?? label;

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) {
      return icon;
    }
    // Icon is a Lucide component
    const IconComponent = icon as LucideIcon;
    return <IconComponent className="size-4.5" strokeWidth={2} />;
  };

  const isClickable = Boolean(onClick);

  return (
    <article
      className={cn(
        "metric-card relative flex flex-col justify-between overflow-hidden rounded-xl border border-(--line) bg-(--card) p-4.5 text-(--foreground) shadow-[var(--shadow)] transition-all duration-200",
        isClickable &&
          "cursor-pointer hover:-translate-y-0.5 hover:shadow-md hover:border-(--blue)/40",
        className,
      )}
      onClick={onClick}
      {...props}
    >
      <div className="flex items-start justify-between gap-3 w-full">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {icon && (
            <div
              className={cn(
                "metric-icon flex size-9.5 shrink-0 items-center justify-center rounded-lg transition-transform",
                toneClasses[tone],
              )}
            >
              {renderIcon()}
            </div>
          )}

          <div className="metric-copy min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-xs font-medium text-(--muted)">
                {displayTitle}
              </span>
              {badge && <div className="shrink-0">{badge}</div>}
            </div>

            {loading ? (
              <div className="my-2 h-7 w-24 animate-pulse rounded bg-(--line)" />
            ) : (
              <strong className="block text-2xl font-bold tracking-tight text-(--foreground) my-1">
                {value}
              </strong>
            )}

            {(change || changeLabel || description) && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {change && (
                  <small
                    className={cn(
                      "inline-flex items-center gap-0.5 font-semibold text-[11px]",
                      trend === "up" && "text-(--green)",
                      trend === "down" && "text-(--red)",
                      (trend === "neutral" || !trend) && "text-(--muted)",
                    )}
                  >
                    {trend === "up" && (
                      <ArrowUpRight className="size-3.5 shrink-0" />
                    )}
                    {trend === "down" && (
                      <ArrowDownRight className="size-3.5 shrink-0" />
                    )}
                    {trend === "neutral" && (
                      <Minus className="size-3 shrink-0" />
                    )}
                    <span>{change}</span>
                  </small>
                )}

                {changeLabel && (
                  <span className="text-[11px] text-(--muted)">
                    {changeLabel}
                  </span>
                )}

                {description && !change && !changeLabel && (
                  <span className="text-[11px] text-(--muted)">
                    {description}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {(action || onAction) && (
          <div className="shrink-0">
            {action ? (
              action
            ) : (
              <button
                type="button"
                className="icon-button subtle flex size-7 items-center justify-center rounded-md text-(--muted) hover:bg-(--background) hover:text-(--foreground) transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction?.();
                }}
                aria-label={
                  actionLabel ||
                  `Options for ${typeof displayTitle === "string" ? displayTitle : "metric"}`
                }
              >
                <MoreHorizontal className="size-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {footer && (
        <div className="mt-3 pt-3 border-t border-(--line) w-full">
          {footer}
        </div>
      )}
    </article>
  );
}
