"use client";

import { useTranslation } from "react-i18next";

export default function LanguagesPage() {
	const { t } = useTranslation();

	return (
		<section>
			<h1 className="font-semibold text-neutral-500 mt-1">{t("languages.heading")}</h1>
		</section>
	);
}
