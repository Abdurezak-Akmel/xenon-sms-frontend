import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Globe2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function TenantPageHeader({
  onCreate,
  styles,
  title = "Schools",
  subtitle = "Manage school workspaces, organization details, and regional settings from one place.",
  eyebrow = "Platform administration / Schools",
  icon: Icon = Globe2,
  className,
  eyebrowClassName,
  contentClassName,
  details,
  action,
  decoration,
}: {
  onCreate?: () => void;
  styles: Record<string, string>;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  icon?: LucideIcon;
  className?: string;
  eyebrowClassName?: string;
  contentClassName?: string;
  details?: ReactNode;
  action?: ReactNode;
  decoration?: ReactNode;
}) {
  return (
    <header className={`page-heading ${className ?? styles.pageHeading}`}>
      <div className={contentClassName}>
        <p className={`eyebrow ${eyebrowClassName ?? styles.pageEyebrow}`}>
          <Icon size={13} />
          {eyebrow}
        </p>
        <h1>{title}</h1>
        <p className="subheading">{subtitle}</p>
        {details}
      </div>
      {action ??
        (onCreate && (
          <Button onClick={onCreate} className={styles.addButton}>
            <Plus size={16} /> Add a school
          </Button>
        ))}
      {decoration}
    </header>
  );
}
