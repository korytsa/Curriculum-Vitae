import { Notification } from "./notification";

export interface FormStatusProps {
  successMessage?: string | null;
  errorMessage?: string | null;
  noticeMessage?: string | null;
  className?: string;
  onDismissSuccess?: () => void;
  onDismissError?: () => void;
  onDismissNotice?: () => void;
}

export function FormStatus({
  successMessage,
  errorMessage,
  noticeMessage,
  className,
  onDismissSuccess,
  onDismissError,
  onDismissNotice,
}: FormStatusProps) {
  if (!successMessage && !errorMessage && !noticeMessage) {
    return null;
  }

  return (
    <div className={className}>
      {errorMessage ? (
        <Notification
          variant="error"
          message={errorMessage}
          onClose={onDismissError}
          className="mb-3"
        />
      ) : null}

      {successMessage ? (
        <Notification
          variant="success"
          message={successMessage}
          onClose={onDismissSuccess}
          className={noticeMessage ? "mb-3" : undefined}
        />
      ) : null}

      {noticeMessage ? (
        <Notification
          variant="info"
          message={noticeMessage}
          onClose={onDismissNotice}
        />
      ) : null}
    </div>
  );
}

