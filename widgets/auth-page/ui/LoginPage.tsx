"use client";

import { useTranslation } from "react-i18next";
import { LoginForm } from "@/features/login-form";
import { AuthTabs } from "./AuthTabs";

export function LoginPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#353535] flex flex-col">
      <AuthTabs />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-white">
              {t("features.authPage.loginPage.title")}
            </h1>
            <p className="text-lg text-white/80">
              {t("features.authPage.loginPage.subtitle")}
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}

