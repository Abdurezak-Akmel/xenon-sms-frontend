import styles from "../../app/super_admin/profile/page.module.css";

export function ProfilePageHeader() {
  return (
    <header className={styles.pageHeader}>
      <div>
        <p className={styles.eyebrow}>ACCOUNT</p>
        <h1>My profile</h1>
        <p>Manage your platform administrator details and account security.</p>
      </div>
    </header>
  );
}
