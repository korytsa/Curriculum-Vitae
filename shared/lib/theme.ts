const THEME_STORAGE_KEY = "theme-preference";
const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

export type ThemeMode = "light" | "dark";
export type ThemePreference = ThemeMode | "system";

const isBrowser = typeof window !== "undefined";

const isValidPreference = (value: string | null): value is ThemePreference => {
  return value === "light" || value === "dark" || value === "system";
};

export const getStoredThemePreference = (): ThemePreference | null => {
  if (!isBrowser) return null;
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (!stored) return null;
  return isValidPreference(stored) ? stored : null;
};

export const resolveTheme = (
  preference: ThemePreference,
  fallback: ThemeMode = "dark"
): ThemeMode => {
  if (!isBrowser) {
    return preference === "system" ? fallback : preference;
  }

  if (preference === "system") {
    return window.matchMedia(COLOR_SCHEME_QUERY).matches ? "dark" : "light";
  }

  return preference;
};

export const applyThemePreference = (
  preference: ThemePreference,
  { persist = true }: { persist?: boolean } = {}
) => {
  if (!isBrowser) return;

  const theme = resolveTheme(preference);
  const root = document.documentElement;
  root.dataset.theme = theme;

  if (persist) {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  }
};

export const getInitialThemePreference = (): ThemePreference => {
  if (!isBrowser) return "system";
  return getStoredThemePreference() ?? "system";
};

export const listenToSystemThemeChanges = (
  callback: (mode: ThemeMode) => void
) => {
  if (!isBrowser) return undefined;

  const media = window.matchMedia(COLOR_SCHEME_QUERY);
  const handler = () => {
    callback(media.matches ? "dark" : "light");
  };

  media.addEventListener("change", handler);
  return () => media.removeEventListener("change", handler);
};

export const ensureThemePreferenceApplied = () => {
  const preference = getInitialThemePreference();
  applyThemePreference(preference, { persist: false });
  return preference;
};
