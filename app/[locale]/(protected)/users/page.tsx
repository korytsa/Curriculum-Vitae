"use client";

import { useTranslation } from "react-i18next";

export default function UsersPage() {
	const { t } = useTranslation();

	return (
		<section>
			<h1 className="font-semibold text-neutral-500 mb-3">{t("users.heading")}</h1>
		</section>
	);
}
