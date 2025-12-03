"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import previewI18n from "@/shared/lib/preview-i18n";
import type { SupportedLanguage } from "../types";

interface PreviewI18nContextValue {
  changeLanguage: (language: SupportedLanguage) => Promise<void>;
  currentLanguage: SupportedLanguage;
}

const PreviewI18nContext = createContext<PreviewI18nContextValue | null>(null);

export function PreviewI18nProvider({ children, initialLanguage = "en" }: { children: ReactNode; initialLanguage?: SupportedLanguage }) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(initialLanguage);

  const changeLanguage = async (language: SupportedLanguage) => {
    await previewI18n.changeLanguage(language);
    setCurrentLanguage(language);
  };

  useEffect(() => {
    previewI18n.changeLanguage(initialLanguage);
    setCurrentLanguage(initialLanguage);
  }, [initialLanguage]);

  const value: PreviewI18nContextValue = {
    changeLanguage,
    currentLanguage,
  };

  return (
    <PreviewI18nContext.Provider value={value}>
      <I18nextProvider i18n={previewI18n}>{children}</I18nextProvider>
    </PreviewI18nContext.Provider>
  );
}

export function usePreviewI18n(): PreviewI18nContextValue {
  const context = useContext(PreviewI18nContext);
  if (!context) {
    throw new Error("usePreviewI18n must be used within PreviewI18nProvider");
  }
  return context;
}
