import { useLayoutEffect, useRef, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useUsers } from "@/features/users";
import { accessTokenVar, setAccessToken } from "@/shared/config/apollo";
import { decodeToken } from "@/shared/lib/jwt";
import { buildUserMenuItems } from "../config/userMenuItems";
import { getUserDisplayName, getUserInitials } from "./userDisplay";
import type { MenuItem } from "../config/menuItems";
import { adminPrimaryMenuItems, adminSecondaryMenuItems, employeeMenuItems } from "../config/menuItems";

const SIDEBAR_WIDTH_EXPANDED = "200px";
const SIDEBAR_WIDTH_COLLAPSED = "60px";
const STORAGE_KEY = "sidebar-collapsed";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

type UseSidebarStateParams = {
  initialIsCollapsed?: boolean;
  hasInitialPreference?: boolean;
};

interface SidebarState {
  t: ReturnType<typeof useTranslation>["t"];
  locale?: string;
  normalizedPath: string;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  applyLocaleToPath: (path: string) => string;
  currentUserName: string | null;
  currentUserInitials: string;
  currentUserAvatar: string | null;
  userMenuItems: ReturnType<typeof buildUserMenuItems>;
  isUserLoading: boolean;
  hasCurrentUser: boolean;
  isAdmin: boolean;
  primaryMenuItems: MenuItem[];
  secondaryMenuItems: MenuItem[];
  employeeMenuItems: MenuItem[];
}

export function useSidebarState({ initialIsCollapsed = false, hasInitialPreference = false }: UseSidebarStateParams = {}): SidebarState {
  const pathname = usePathname() || "/";
  const params = useParams();
  const locale = getLocaleFromParams(params);
  const normalizedPath = getNormalizedPath(pathname, locale);

  const { t } = useTranslation();
  const { users, loading: isUserLoading } = useUsers();
  const router = useRouter();

  const { isCollapsed, toggleCollapse } = useCollapseState(initialIsCollapsed, hasInitialPreference);

  const applyLocaleToPath = (path: string) => (locale ? `/${locale}${path}` : path);

  const token = accessTokenVar();
  const decodedToken = token ? decodeToken(token) : null;
  const currentUserId = decodedToken?.sub?.toString();
  const isAdmin = decodedToken?.role === "Admin";

  const { id, currentUserName, currentUserInitials, currentUserAvatar, hasCurrentUser } = getCurrentUserData({
    users,
    currentUserId,
    t,
  });

  const handleLogout = () => {
    setAccessToken(null);
    router.push(applyLocaleToPath("/login"));
  };

  const userMenuItems = buildUserMenuItems({
    id,
    applyLocaleToPath,
    handleLogout,
    translate: t,
  });

  return {
    t,
    locale,
    normalizedPath,
    isCollapsed,
    toggleCollapse,
    applyLocaleToPath,
    currentUserName,
    currentUserInitials,
    currentUserAvatar,
    userMenuItems,
    isUserLoading,
    hasCurrentUser,
    isAdmin,
    primaryMenuItems: adminPrimaryMenuItems,
    secondaryMenuItems: adminSecondaryMenuItems,
    employeeMenuItems,
  };
}

function useCollapseState(initialIsCollapsed: boolean, hasInitialPreference: boolean) {
  const [isCollapsed, setIsCollapsed] = useState(initialIsCollapsed);
  const hasPreferenceRef = useRef(hasInitialPreference);

  useLayoutEffect(() => {
    if (hasPreferenceRef.current) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setIsCollapsed(stored === "true");
      }
    } catch {}

    hasPreferenceRef.current = true;
  }, []);

  useLayoutEffect(() => {
    if (typeof document === "undefined") return;

    const width = isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;
    document.documentElement.style.setProperty("--sidebar-width", width);
    document.cookie = `${STORAGE_KEY}=${String(isCollapsed)}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}`;

    try {
      localStorage.setItem(STORAGE_KEY, String(isCollapsed));
    } catch {}
  }, [isCollapsed]);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return { isCollapsed, toggleCollapse };
}

function getLocaleFromParams(params: ReturnType<typeof useParams>) {
  const locale = params?.locale;
  if (typeof locale === "string") return locale;
  if (Array.isArray(locale)) return locale[0];
  return undefined;
}

function getNormalizedPath(pathname: string, locale?: string) {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegmentAfterLocale = locale ? segments[1] : segments[0];
  return firstSegmentAfterLocale ? `/${firstSegmentAfterLocale}` : "/";
}

type CurrentUserDataParams = {
  users: Array<any> | undefined;
  currentUserId?: string;
  t: ReturnType<typeof useTranslation>["t"];
};

function getCurrentUserData({ users, currentUserId, t }: CurrentUserDataParams) {
  const list = Array.isArray(users) ? users : [];
  const currentUser = currentUserId ? list.find((user: any) => user.id === currentUserId) : null;

  const initialsFallback = t("features.sidebar.avatar.initials");
  const currentUserName = getUserDisplayName(currentUser);
  const currentUserInitials = getUserInitials(currentUser, initialsFallback);
  const currentUserAvatar = currentUser?.profile?.avatar || null;

  return {
    id: currentUser?.id,
    currentUserName,
    currentUserInitials,
    currentUserAvatar,
    hasCurrentUser: Boolean(currentUser),
  };
}
