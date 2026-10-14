import type { LucideIcon } from "lucide-react";

export type TenantStat = {
  label: string;
  value: string | number;
  helper?: string;
  tone: "blue" | "green" | "orange" | "red";
  helperTone?: "positive" | "negative";
  icon: LucideIcon;
  helperIcon?: LucideIcon;
};

export function TenantStatsCards({
  stats,
  loading,
  className,
}: {
  stats: TenantStat[];
  loading: boolean;
  className?: string;
}) {
  return (
    <section
      className={`metrics-grid mb-4 ${className ?? ""}`}
      aria-label="School workspace summary"
    >
      {stats.map(
        ({
          label,
          value,
          helper,
          tone,
          helperTone,
          icon: Icon,
          helperIcon: HelperIcon,
        }) => (
          <article key={label} className="metric-card">
            <div className={`metric-icon ${tone}`}>
              <Icon size={18} />
            </div>
            <div className="metric-copy">
              <span>{label}</span>
              <strong>{loading ? "—" : value}</strong>
              {helper && (
                <small className={helperTone}>
                  {HelperIcon && <HelperIcon size={12} />} {helper}
                </small>
              )}
            </div>
          </article>
        ),
      )}
    </section>
  );
}
