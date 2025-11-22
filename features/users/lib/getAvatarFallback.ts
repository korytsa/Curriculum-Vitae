type AvatarFallbackArgs = {
	firstName?: string | null;
	email?: string | null;
};

export function getAvatarFallback({ firstName, email }: AvatarFallbackArgs) {
	const normalizedFirst = firstName?.trim();
	if (normalizedFirst) {
		return normalizedFirst[0]?.toUpperCase() || "";
	}
	const normalizedEmail = email?.trim();
	return normalizedEmail ? normalizedEmail[0]?.toUpperCase() || "" : "";
}


