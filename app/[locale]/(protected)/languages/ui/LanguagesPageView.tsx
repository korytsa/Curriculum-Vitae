"use client";

import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AddLanguageForm, LanguagesList } from "@/features/languages";
import type { LanguageItem } from "@/features/languages";
import { Button, Loader } from "@/shared/ui";
import { cn } from "@/shared/lib";

interface LanguagesPageViewProps {
  languagesLoading: boolean;
  languages: LanguageItem[];
  showAddLanguageForm: boolean;
  isDeleteMode: boolean;
  selectedLanguageNames: Set<string>;
  deleteLoading?: boolean;
  onOpenAddForm: () => void;
  onToggleDeleteMode: () => void;
  onToggleLanguageSelection: (languageName: string) => void;
  onDeleteSelectedLanguages: () => void;
  onCloseAddForm: () => void;
  showHeading?: boolean;
}

export function LanguagesPageView({
  languagesLoading,
  languages,
  showAddLanguageForm,
  isDeleteMode,
  selectedLanguageNames,
  deleteLoading,
  onOpenAddForm,
  onToggleDeleteMode,
  onToggleLanguageSelection,
  onDeleteSelectedLanguages,
  onCloseAddForm,
  showHeading = true,
}: LanguagesPageViewProps) {
  const { t } = useTranslation();

  const hasLanguages = languages.length > 0;

  return (
    <section className="text-white space-y-10">
      <div className="flex justify-between items-start gap-16">
        {showHeading && hasLanguages && (
          <h1 className="font-semibold text-neutral-500 mt-1">
            {t("languages.heading")}
          </h1>
        )}

        <div className="flex-1 mt-16">
          {languagesLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader size="lg" />
            </div>
          ) : (
            <LanguagesList
              languages={languages}
              isDeleteMode={isDeleteMode}
              selectedLanguageNames={selectedLanguageNames}
              onToggleLanguageSelection={onToggleLanguageSelection}
            />
          )}

          <div
            className={cn(
              "flex flex-wrap items-center gap-10 pr-4 lg:pr-20 text-sm uppercase tracking-wide mt-8",
              hasLanguages ? "justify-end" : "justify-center"
            )}
          >
            <Button
              type="button"
              variant="ghost"
              className="flex items-center gap-2 rounded-full px-4 py-2 text-gray-400 text-xs md:text-sm tracking-[0.2em] hover:text-gray-200 transition-colors"
              icon={<Plus className="h-4 w-4" />}
              onClick={onOpenAddForm}
              disabled={
                languagesLoading ||
                isDeleteMode ||
                showAddLanguageForm ||
                deleteLoading
              }
            >
              {t("features.languages.page.actions.add")}
            </Button>

            {hasLanguages && (
              <Button
                type="button"
                variant="ghost"
                className="flex items-center gap-2 text-red-500 text-xs md:text-sm tracking-[0.2em] hover:text-red-300 transition-colors"
                icon={<Trash2 className="h-4 w-4" />}
                onClick={
                  isDeleteMode && selectedLanguageNames.size > 0
                    ? onDeleteSelectedLanguages
                    : onToggleDeleteMode
                }
                disabled={
                  languagesLoading ||
                  deleteLoading ||
                  showAddLanguageForm ||
                  (isDeleteMode && selectedLanguageNames.size === 0)
                }
              >
                {t("features.languages.page.actions.delete")}
                {isDeleteMode && selectedLanguageNames.size > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-red-500 text-white rounded-full text-xs font-semibold">
                    {selectedLanguageNames.size}
                  </span>
                )}
              </Button>
            )}
          </div>

          <AddLanguageForm
            open={showAddLanguageForm}
            onSuccess={onCloseAddForm}
            onCancel={onCloseAddForm}
          />
        </div>
      </div>
    </section>
  );
}
