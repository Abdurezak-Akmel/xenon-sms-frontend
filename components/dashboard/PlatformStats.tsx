"use client";

import type { LucideIcon } from "lucide-react";

import { StatsCard } from "./StatsCard";

type DashboardStyles = Record<string, string>;

export type PlatformStat = {
  title: string;
  value: string;
  icon: LucideIcon;
  tone: "blue" | "green" | "orange" | "red" | "violet" | "teal" | "neutral";
  trend: "up" | "down" | "neutral" | "none";
  change: string;
  changeLabel: string;
};

export function PlatformStats({
  stats,
  styles,
}: {
  stats: PlatformStat[];
  styles: DashboardStyles;
}) {
  return (
    <section className={styles.statsGrid} aria-label="Platform statistics">
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </section>
  );
}
