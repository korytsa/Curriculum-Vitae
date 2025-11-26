import { makeVar } from "@apollo/client";

const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const setCookie = (name: string, value: string, maxAgeSeconds = 60 * 60 * 24) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; sameSite=Strict`;
};

const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const accessTokenVar = makeVar<string | null>(getCookie("access_token"));

export const setAccessToken = (token: string | null) => {
  if (token) {
    setCookie("access_token", token);
  } else {
    deleteCookie("access_token");
  }
  accessTokenVar(token);
};

