"use client";

import { useTranslation } from "react-i18next";

export default function UserLanguagesTabPage() {
  const { t } = useTranslation();

  return <div className="p-6">{t("users.details.placeholders.languages")}</div>;
}
