"use client";

import { useTranslation } from "react-i18next";

export default function CvsPage() {
	const { t } = useTranslation();

	return (
		<section>
			<h1 className="font-semibold text-neutral-500 mt-1">{t("cvs.heading")}</h1>
		</section>
	);
}
