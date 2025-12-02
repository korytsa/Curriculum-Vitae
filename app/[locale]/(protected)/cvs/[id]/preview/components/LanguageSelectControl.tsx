import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Select } from "@/shared/ui";
import { isSupportedLanguage, SUPPORTED_LANGUAGES } from "../lib/utils";
import type { SupportedLanguage } from "../types";

const getLanguageOptionKey = (language: SupportedLanguage) => `settings.language.options.${language}`;

export function LanguageSelectControl() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = params?.locale as string | undefined;
  const defaultLanguage: SupportedLanguage = locale && isSupportedLanguage(locale) ? locale : SUPPORTED_LANGUAGES[0];
  const [value, setValue] = useState<SupportedLanguage>(defaultLanguage);

  useEffect(() => {
    setValue(defaultLanguage);
  }, [defaultLanguage]);

  const handleChange = (nextValue: string) => {
    if (!isSupportedLanguage(nextValue)) {
      return;
    }
    setValue(nextValue);
  };

  const options = SUPPORTED_LANGUAGES.map((language) => ({
    value: language,
    label: t(getLanguageOptionKey(language)),
  }));

  return (
    <div className="w-full sm:w-40">
      <Select label={t("settings.language.title")} options={options} value={value} onChange={handleChange} align="bottom" />
    </div>
  );
}
