"use client";

import { decodeToken } from "./jwt";

export function useIsAdmin(): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  const match = document.cookie.match(/(?:^|;\s*)access_token=([^;]+)/);
  const token = match?.[1];
  const decoded = token ? decodeToken(token) : null;

  return decoded?.role === "Admin";
}
