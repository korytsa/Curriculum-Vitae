"use client";

import { useTranslation } from "react-i18next";
import { SignupForm } from "@/features/signup-form";
import { AuthTabs } from "./AuthTabs";

export function SignupPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#1F1F1F] flex flex-col">
      <AuthTabs />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-white">
              {t("features.authPage.signupPage.title")}
            </h1>
            <p className="text-lg text-white/80">
              {t("features.authPage.signupPage.subtitle")}
            </p>
          </div>

          <SignupForm />
        </div>
      </div>
    </div>
  );
}

