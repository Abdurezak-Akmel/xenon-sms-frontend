"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

type DashboardStyles = Record<string, string>;

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  styles: DashboardStyles;
  action?: {
    href: string;
    label: string;
  };
}

export function DashboardHeader({
  title,
  subtitle,
  styles,
  action,
}: DashboardHeaderProps) {
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    // Format date as: TUESDAY, OCTOBER 6, 2026
    const formatter = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    setCurrentDate(formatter.format(new Date()).toUpperCase());
  }, []);

  return (
    <header className={styles.pageHeading}>
      <div>
        {/* Render dynamically; fallback gracefully before hydration */}
        <p className={styles.eyebrow}>{currentDate || "LOADING DATE..."}</p>
        <h1>{title}</h1>
        <p className={styles.pageSubtitle}>{subtitle}</p>
      </div>
      {action && (
        <Link href={action.href} className={styles.primaryButton}>
          <Plus size={16} /> {action.label}
        </Link>
      )}
    </header>
  );
}
