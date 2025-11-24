"use client";

import { useTranslation } from "react-i18next";

export default function CvProjectsPage() {
  const { t } = useTranslation();

  return (
    <div className="mt-10 text-center text-sm text-neutral-400">
      {t("cvs.details.placeholders.projects", {
        defaultValue: "CV Projects",
      })}
    </div>
  );
}
