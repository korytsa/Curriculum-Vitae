import { useLayoutEffect, useRef, useState } from "react";
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
  userMenuItems: ReturnType<typeof buildUserMenuItems>;
  isUserLoading: boolean;
}

export function useSidebarState({
  initialIsCollapsed = false,
  hasInitialPreference = false,
}: UseSidebarStateParams = {}): SidebarState {
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
  const { users, loading: isUserLoading } = useUsers();
  const router = useRouter();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(initialIsCollapsed);
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

    const width = isCollapsed
      ? SIDEBAR_WIDTH_COLLAPSED
      : SIDEBAR_WIDTH_EXPANDED;
    document.documentElement.style.setProperty("--sidebar-width", width);
    document.cookie = `${STORAGE_KEY}=${String(
      isCollapsed
    )}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}`;

    try {
      localStorage.setItem(STORAGE_KEY, String(isCollapsed));
    } catch {}
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
    isUserLoading,
  };
}
