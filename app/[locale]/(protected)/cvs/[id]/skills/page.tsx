"use client";

import { useTranslation } from "react-i18next";

export default function CvSkillsPage() {
  const { t } = useTranslation();

  return (
    <div className="mt-10 text-center text-sm text-neutral-400">
      {t("cvs.details.placeholders.skills", {
        defaultValue: "CV Skills",
      })}
    </div>
  );
}
