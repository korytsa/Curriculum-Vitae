"use client";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "../../public/locales/en/common.json";
import ruTranslations from "../../public/locales/ru/common.json";

const previewI18n = i18n.createInstance();

previewI18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslations,
    },
    ru: {
      translation: ruTranslations,
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default previewI18n;
