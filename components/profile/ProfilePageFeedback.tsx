import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

import styles from "../../app/super_admin/profile/page.module.css";

interface ProfilePageFeedbackProps {
  message: string;
  loading?: boolean;
  onRetry?: () => void;
}

export function ProfilePageFeedback({
  message,
  loading = false,
  onRetry,
}: ProfilePageFeedbackProps) {
  return (
    <Card variant="default" padding="lg">
      <CardContent className={styles.feedbackContent}>
        <p
          className={loading ? styles.loadingMessage : styles.errorMessage}
          role={loading ? "status" : "alert"}
        >
          {message}
        </p>
        {!loading && onRetry && (
          <Button type="button" variant="outline" onClick={onRetry}>
            Try again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
