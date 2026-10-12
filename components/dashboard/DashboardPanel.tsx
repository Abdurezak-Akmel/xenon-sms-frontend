"use client";

import type { ReactNode } from "react";

import { cn } from "@/route_protection/ProtectedRoute";

export interface DashboardPanelProps {
  children: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
  headingClassName?: string;
  id?: string;
}

export function DashboardPanel({
  children,
  title,
  subtitle,
  action,
  className,
  headingClassName,
  id,
}: DashboardPanelProps) {
  return (
    <section className={cn("panel", className)} id={id}>
      <div className={headingClassName}>
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
