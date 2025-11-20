import { cn } from "@/shared/lib";
import { IoCheckmarkCircle, IoClose, IoCloseCircle, IoInformationCircle } from "react-icons/io5";

type NotificationVariant = "success" | "error" | "info";

const variantStyles: Record<
  NotificationVariant,
  { container: string; icon: JSX.Element }
> = {
  success: {
    container: "bg-green-500/10 border border-green-500 text-green-200",
    icon: <IoCheckmarkCircle className="text-green-400" size={20} />,
  },
  error: {
    container: "bg-red-500/10 border border-red-500 text-red-200",
    icon: <IoCloseCircle className="text-red-400" size={20} />,
  },
  info: {
    container: "bg-blue-500/10 border border-blue-500 text-blue-200",
    icon: <IoInformationCircle className="text-blue-400" size={20} />,
  },
};

export interface NotificationProps {
  message: string;
  variant?: NotificationVariant;
  className?: string;
  onClose?: () => void;
}

export function Notification({
  message,
  variant = "info",
  className,
  onClose,
}: NotificationProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg px-4 py-3 text-sm shadow-lg",
        styles.container,
        className,
      )}
      role="alert"
      aria-live="assertive"
    >
      <span className="mt-0.5">{styles.icon}</span>
      <span className="flex-1">{message}</span>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="text-inherit opacity-70 hover:opacity-100 transition"
          aria-label="Close notification"
        >
          <IoClose size={16} />
        </button>
      ) : null}
    </div>
  );
}

