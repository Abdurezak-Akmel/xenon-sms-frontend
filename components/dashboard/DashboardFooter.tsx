"use client";

import { ArrowDownRight } from "lucide-react";

type DashboardStyles = Record<string, string>;

export function DashboardFooter({ styles }: { styles: DashboardStyles }) {
  return (
    <footer className={styles.footer}>
      <span>Xenon Platform Administration</span>
      <span>
        <ArrowDownRight size={13} /> School operations, all in one place
      </span>
    </footer>
  );
}
