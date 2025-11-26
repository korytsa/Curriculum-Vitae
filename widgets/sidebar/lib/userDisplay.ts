type SidebarUser =
  | {
      email?: string | null;
      profile?: {
        first_name?: string | null;
        last_name?: string | null;
      };
    }
  | null
  | undefined;

const normalize = (value?: string | null) =>
  typeof value === "string" && value.length > 0 ? value : null;

export const getUserDisplayName = (
  user: SidebarUser,
  fallback: string | null = null
): string | null => {
  if (!user) return fallback;

  const firstName = normalize(user.profile?.first_name);
  const lastName = normalize(user.profile?.last_name);
  const email = normalize(user.email);

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  return email || firstName || lastName || fallback;
};

export const getUserInitials = (
  user: SidebarUser,
  fallback: string
): string => {
  if (!user) return fallback.charAt(0).toUpperCase();

  const firstName = normalize(user.profile?.first_name);
  const email = normalize(user.email);
  const fallbackSource = fallback.charAt(0);

  if (firstName) {
    return firstName[0]!.toUpperCase();
  }

  return (email?.[0] || fallbackSource).toUpperCase();
};
