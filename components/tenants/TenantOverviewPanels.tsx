import type { LucideIcon } from "lucide-react";
import type { Tenant } from "@/services/tenancy/tenant.service";

function DetailItem({
  label,
  value,
  icon: Icon,
  styles,
}: {
  label: string;
  value: string | null | undefined;
  icon?: LucideIcon;
  styles: Record<string, string>;
}) {
  return (
    <div className={styles.detailItem}>
      {Icon && (
        <span className={styles.detailIcon}>
          <Icon size={15} />
        </span>
      )}
      <span className={styles.detailCopy}>
        <small>{label}</small>
        <strong>{value?.trim() || "Not provided"}</strong>
      </span>
    </div>
  );
}

function DataPanel({
  title,
  description,
  data,
  icon: Icon,
  styles,
}: {
  title: string;
  description: string;
  data: Record<string, unknown>;
  icon: LucideIcon;
  styles: Record<string, string>;
}) {
  const entries = Object.entries(data);

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeading}>
        <span className={styles.panelIcon}>
          <Icon size={17} />
        </span>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      {entries.length ? (
        <dl className={styles.dataList}>
          {entries.map(([key, value]) => (
            <div className={styles.dataRow} key={key}>
              <dt>{key.replace(/([A-Z])/g, " $1")}</dt>
              <dd>
                {typeof value === "string"
                  ? value
                  : (JSON.stringify(value) ?? "—")}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className={styles.emptyData}>No custom settings configured.</p>
      )}
    </section>
  );
}

export function TenantOverviewPanels({
  tenant,
  icons,
  styles,
}: {
  tenant: Tenant;
  icons: {
    organization: LucideIcon;
    regional: LucideIcon;
    email: LucideIcon;
    phone: LucideIcon;
    address: LucideIcon;
    country: LucideIcon;
    timezone: LucideIcon;
    currency: LucideIcon;
    settings: LucideIcon;
    retention: LucideIcon;
  };
  styles: Record<string, string>;
}) {
  return (
    <>
      <div className={styles.detailsGrid}>
        <section className={styles.panel}>
          <div className={styles.panelHeading}>
            <span className={styles.panelIcon}>
              <icons.organization size={17} />
            </span>
            <div>
              <h2>Organization details</h2>
              <p>Identity and contact information</p>
            </div>
          </div>
          <div className={styles.detailList}>
            <DetailItem
              label="Display name"
              value={tenant.displayName}
              styles={styles}
            />
            <DetailItem
              label="Legal name"
              value={tenant.legalName}
              styles={styles}
            />
            <DetailItem
              label="Tenant code"
              value={tenant.code}
              styles={styles}
            />
            <DetailItem
              label="Email address"
              value={tenant.email}
              icon={icons.email}
              styles={styles}
            />
            <DetailItem
              label="Phone number"
              value={tenant.phone}
              icon={icons.phone}
              styles={styles}
            />
            <DetailItem
              label="Address"
              value={tenant.address}
              icon={icons.address}
              styles={styles}
            />
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeading}>
            <span className={styles.panelIcon}>
              <icons.regional size={17} />
            </span>
            <div>
              <h2>Regional settings</h2>
              <p>Localization used across this workspace</p>
            </div>
          </div>
          <div className={styles.detailList}>
            <DetailItem
              label="Country code"
              value={tenant.countryCode}
              icon={icons.country}
              styles={styles}
            />
            <DetailItem
              label="Timezone"
              value={tenant.timezone}
              icon={icons.timezone}
              styles={styles}
            />
            <DetailItem
              label="Currency"
              value={tenant.currencyCode}
              icon={icons.currency}
              styles={styles}
            />
          </div>
        </section>
      </div>

      <div className={styles.detailsGrid}>
        <DataPanel
          title="Workspace settings"
          description="Custom preferences configured for this school"
          data={tenant.settings}
          icon={icons.settings}
          styles={styles}
        />
        <DataPanel
          title="Data retention"
          description="Retention policy configured for this workspace"
          data={tenant.retentionPolicy}
          icon={icons.retention}
          styles={styles}
        />
      </div>
    </>
  );
}
