"use client";

import { useTranslation } from "react-i18next";

export default function LanguagesPage() {
	const { t } = useTranslation();

	return (
		<section>
			<h1 className="font-medium text-neutral-500 mb-1.5">{t("languages.heading")}</h1>
		</section>
	);
}
