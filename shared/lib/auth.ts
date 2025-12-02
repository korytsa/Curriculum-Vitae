"use client";

let isRedirectingToLogin = false;

export function redirectToLogin() {
  if (typeof window === "undefined" || isRedirectingToLogin) {
    return;
  }

  isRedirectingToLogin = true;

  const currentPath = window.location.pathname || "/";
  const segments = currentPath.split("/").filter(Boolean);
  const localeCandidate = segments[0];
  const locale =
    typeof localeCandidate === "string" && localeCandidate.length <= 5
      ? localeCandidate
      : "en";

  const loginPath = `/${locale}/login`;

  if (window.location.pathname !== loginPath) {
    window.location.href = loginPath;
  } else {
    window.location.reload();
  }
}
