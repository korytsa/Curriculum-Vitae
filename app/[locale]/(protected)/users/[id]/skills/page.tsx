"use client";

import { useTranslation } from "react-i18next";

export default function UserSkillsTabPage() {
  const { t } = useTranslation();

  return <div className="p-6">{t("users.details.placeholders.skills")}</div>;
}
