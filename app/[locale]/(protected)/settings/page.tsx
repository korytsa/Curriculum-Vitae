"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Select, type SelectOption } from "@/shared/ui/select";
import {
  applyThemePreference,
  getStoredThemePreference,
  type ThemePreference,
} from "@/shared/lib/theme";

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "en";

  const [appearance, setAppearance] = useState<ThemePreference>("system");
  const [language, setLanguage] = useState(locale);
  useEffect(() => {
    const storedPreference = getStoredThemePreference();
    if (storedPreference) {
      setAppearance(storedPreference);
    }
  }, []);

  useEffect(() => {
    setLanguage(locale);
  }, [locale]);

  const appearanceOptions: SelectOption[] = [
    {
      value: "system",
      label: t("settings.appearance.options.system"),
    },
    {
      value: "light",
      label: t("settings.appearance.options.light"),
    },
    {
      value: "dark",
      label: t("settings.appearance.options.dark"),
    },
  ];

  const languageOptions: SelectOption[] = [
    {
      value: "en",
      label: t("settings.language.options.en"),
    },
    {
      value: "ru",
      label: t("settings.language.options.ru"),
    },
  ];

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    if (value === locale) {
      return;
    }

    i18n.changeLanguage(value);

    const restOfPath =
      pathname && pathname.startsWith(`/${locale}`)
        ? pathname.slice(locale.length + 1)
        : pathname || "";

    const normalizedRest =
      restOfPath.length > 0
        ? restOfPath.startsWith("/")
          ? restOfPath
          : `/${restOfPath}`
        : "";

    router.push(`/${value}${normalizedRest}`);
  };

  const handleAppearanceChange = (value: string) => {
    const preference = (value as ThemePreference) || "system";
    setAppearance(preference);
    applyThemePreference(preference);
  };

  return (
    <section className="text-white">
      <div className="flex flex-wrap items-start justify-between gap-16">
        <div className="mt-1">
          <h1 className="font-semibold text-neutral-500">{t("settings.heading")}</h1>
        </div>

        <div className="flex-1 flex  mt-16">
          <div className="space-y-8 w-full max-w-[720px]">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                {t("settings.appearance.title")}
              </p>
              <Select
                value={appearance}
                onChange={handleAppearanceChange}
                options={appearanceOptions}
                align="bottom"
              />
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                {t("settings.language.title")}
              </p>
              <Select
                value={language}
                onChange={handleLanguageChange}
                options={languageOptions}
                align="bottom"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
