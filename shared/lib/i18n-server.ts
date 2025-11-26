import i18n, { type InitOptions } from "i18next";
import enTranslations from "../../public/locales/en/common.json";
import ruTranslations from "../../public/locales/ru/common.json";

const i18nServer = i18n.createInstance();

const initOptions: InitOptions = {
  resources: {
    en: {
      translation: enTranslations,
    },
    ru: {
      translation: ruTranslations,
    },
  },
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
};

let initialized = false;

export const initLocale = async (locale: string) => {
  if (!initialized) {
    await i18nServer.init(initOptions);
    initialized = true;
  }

  if (i18nServer.language === locale) {
    return;
  }

  await i18nServer.changeLanguage(locale);
};

