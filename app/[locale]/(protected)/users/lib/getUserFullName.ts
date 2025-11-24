import type { User } from "../types";

export const getUserFullName = (user?: User | null) => {
  if (!user) return null;

  const firstName = user.profile.first_name?.trim() || "";
  const lastName = user.profile.last_name?.trim() || "";
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || null;
};

