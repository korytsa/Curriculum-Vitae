import { useTranslation } from "react-i18next";
import { Select } from "@/shared/ui";
import { isSupportedLanguage, SUPPORTED_LANGUAGES } from "../lib/utils";
import { usePreviewI18n } from "./PreviewI18nProvider";
import type { SupportedLanguage } from "../types";

const getLanguageOptionKey = (language: SupportedLanguage) => `settings.language.options.${language}`;

export function LanguageSelectControl() {
  const { t } = useTranslation();
  const { changeLanguage, currentLanguage } = usePreviewI18n();

  const handleChange = async (nextValue: string) => {
    if (!isSupportedLanguage(nextValue)) {
      return;
    }
    await changeLanguage(nextValue);
  };

  const options = SUPPORTED_LANGUAGES.map((language) => ({
    value: language,
    label: t(getLanguageOptionKey(language)),
  }));

  return (
    <div className="w-full sm:w-40">
      <Select label={t("settings.language.title")} options={options} value={currentLanguage as SupportedLanguage} onChange={handleChange} align="bottom" />
    </div>
  );
}
