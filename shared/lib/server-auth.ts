import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { decodeToken, type DecodedToken } from "./jwt";

type RequireAdminAccessParams = {
	locale: string;
	fallbackPath?: string;
};

type ServerUserResult = {
	token: string | null;
	user: DecodedToken | null;
};

const ACCESS_TOKEN_COOKIE = "access_token";

const normalizePath = (path: string) => {
	if (!path) return "";
	return path.startsWith("/") ? path : `/${path}`;
};

export function getServerUser(): ServerUserResult {
	const token = cookies().get(ACCESS_TOKEN_COOKIE)?.value || null;

	if (!token) {
		return { token: null, user: null };
	}

	const decoded = decodeToken(token);

	return {
		token,
		user: decoded,
	};
}

export function requireAuth(locale: string): DecodedToken {
	const { token, user } = getServerUser();

	if (!token || !user) {
		redirect(`/${locale}/login`);
	}

	return user;
}

export function requireAdminAccess({ locale, fallbackPath = "/users" }: RequireAdminAccessParams): DecodedToken {
	const user = requireAuth(locale);

	if (user.role !== "Admin") {
		redirect(`/${locale}${normalizePath(fallbackPath)}`);
	}

	return user;
}
