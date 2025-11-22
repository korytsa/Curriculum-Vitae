import { MdChevronRight } from "react-icons/md";
import type { User } from "../types";
import { UserActionsMenu } from "./UserActionsMenu";

interface UserRowActionsProps {
  row: User;
  currentUserId?: string | null;
  onNavigate: (userId: string) => void;
}

export function UserRowActions({
  row,
  currentUserId,
  onNavigate,
}: UserRowActionsProps) {
  if (row.id === currentUserId) {
    return <UserActionsMenu user={row} onViewProfile={onNavigate} />;
  }

  const handleNavigate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onNavigate(row.id);
  };

  const labelTarget = row.profile.first_name || row.email;

  return (
    <button
      type="button"
      onClick={handleNavigate}
      className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10"
      aria-label={`Navigate to ${labelTarget} profile`}
    >
      <MdChevronRight className="w-5 h-5 text-white/80" />
    </button>
  );
}
