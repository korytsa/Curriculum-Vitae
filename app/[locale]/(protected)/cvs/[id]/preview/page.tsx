"use client";

import { useTranslation } from "react-i18next";

export default function CvPreviewPage() {
  const { t } = useTranslation();

  return (
    <div className="mt-10 text-center text-sm text-neutral-400">
      {t("cvs.details.placeholders.preview", {
        defaultValue: "CV Preview",
      })}
    </div>
  );
}
