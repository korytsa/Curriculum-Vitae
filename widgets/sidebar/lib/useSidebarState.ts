import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useUsers } from "@/features/users";
import { accessTokenVar, setAccessToken } from "@/shared/config/apollo";
import { decodeToken } from "@/shared/lib/jwt";
import { buildUserMenuItems } from "../config/userMenuItems";
import { getUserDisplayName, getUserInitials } from "./userDisplay";

const SIDEBAR_WIDTH_EXPANDED = "200px";
const SIDEBAR_WIDTH_COLLAPSED = "60px";
const STORAGE_KEY = "sidebar-collapsed";

interface SidebarState {
  t: ReturnType<typeof useTranslation>["t"];
  locale?: string;
  normalizedPath: string;
  isCollapsed: boolean | null;
  toggleCollapse: () => void;
  applyLocaleToPath: (path: string) => string;
  currentUserName: string | null;
  currentUserInitials: string;
  userMenuItems: ReturnType<typeof buildUserMenuItems>;
}

export function useSidebarState(): SidebarState {
  const pathname = usePathname();
  const params = useParams();
  const locale =
    typeof params?.locale === "string"
      ? params.locale
      : Array.isArray(params?.locale)
        ? params?.locale[0]
        : undefined;

  const segments = pathname.split("/").filter(Boolean);
  const firstSegmentAfterLocale = locale ? segments[1] : segments[0];
  const normalizedPath = firstSegmentAfterLocale
    ? `/${firstSegmentAfterLocale}`
    : "/";

  const { t } = useTranslation();
  const { users } = useUsers();
  const router = useRouter();

  const [isCollapsed, setIsCollapsed] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const value = stored === "true";
    setIsCollapsed(value);

    const width = value ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;
    document.documentElement.style.setProperty("--sidebar-width", width);
  }, []);

  useEffect(() => {
    if (isCollapsed === null) return;
    const width = isCollapsed
      ? SIDEBAR_WIDTH_COLLAPSED
      : SIDEBAR_WIDTH_EXPANDED;
    document.documentElement.style.setProperty("--sidebar-width", width);
    localStorage.setItem(STORAGE_KEY, String(isCollapsed));
  }, [isCollapsed]);

  const applyLocaleToPath = (path: string) =>
    locale ? `/${locale}${path}` : path;

  const token = accessTokenVar();
  const decodedToken = token ? decodeToken(token) : null;
  const currentUserId = decodedToken?.sub?.toString();
  const currentUser = currentUserId
    ? users.find((user: any) => user.id === currentUserId)
    : null;

  const id = currentUser?.id;
  const initialsFallback = t("features.sidebar.avatar.initials");
  const currentUserName = getUserDisplayName(currentUser);
  const currentUserInitials = getUserInitials(currentUser, initialsFallback);

  const handleLogout = () => {
    setAccessToken(null);
    router.push(applyLocaleToPath("/login"));
  };

  const userMenuItems = buildUserMenuItems({
    id,
    applyLocaleToPath,
    handleLogout,
  });

  return {
    t,
    locale,
    normalizedPath,
    isCollapsed,
    toggleCollapse: () => setIsCollapsed((prev) => !prev),
    applyLocaleToPath,
    currentUserName,
    currentUserInitials,
    userMenuItems,
  };
}
