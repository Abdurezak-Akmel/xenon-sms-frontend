"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { DashboardPanel } from "./DashboardPanel";

type DashboardStyles = Record<string, string>;

export type SubscriptionPlan = {
  name: string;
  count: number;
  percentage: number;
  styleKey: "enterprise" | "growth" | "starter";
};

export function SubscriptionOverview({
  total,
  plans,
  styles,
}: {
  total: number;
  plans: SubscriptionPlan[];
  styles: DashboardStyles;
}) {
  return (
    <DashboardPanel
      className={styles.subscriptionPanel}
      headingClassName={styles.panelHeading}
      id="subscriptions"
      title="Subscription overview"
      subtitle="Plan distribution across schools"
      action={
        <button
          type="button"
          className={styles.moreButton}
          aria-label="More subscription options"
        >
          •••
        </button>
      }
    >
      <div className={styles.subscriptionTotal}>
        <strong>{total}</strong>
        <span>total subscriptions</span>
      </div>
      <div
        className={styles.planBar}
        aria-label={plans
          .map(({ count, name }) => `${count} ${name}`)
          .join(", ")}
      >
        {plans.map((plan) => (
          <span
            key={plan.name}
            className={styles[`${plan.styleKey}Segment`]}
            style={{ flex: plan.count }}
          />
        ))}
      </div>
      <div className={styles.planRows}>
        {plans.map((plan) => (
          <div key={plan.name}>
            <span>
              <i className={styles[`${plan.styleKey}Dot`]} />
              {plan.name}
            </span>
            <strong>
              {plan.count} <small>{plan.percentage}%</small>
            </strong>
          </div>
        ))}
      </div>
      <Link href="/super_admin/tenants" className={styles.textLink}>
        View subscriptions <ArrowRight size={14} />
      </Link>
    </DashboardPanel>
  );
}
