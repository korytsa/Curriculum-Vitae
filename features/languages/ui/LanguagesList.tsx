"use client";

import { cn } from "@/shared/lib";
import type { LanguageItem } from "../model/types";
import { PROFICIENCY_COLOR_CLASSES } from "../model/constants";

interface LanguagesListProps {
  languages: LanguageItem[];
  isDeleteMode?: boolean;
  selectedLanguageNames?: Set<string>;
  onToggleLanguageSelection?: (languageName: string) => void;
}

export function LanguagesList({
  languages,
  isDeleteMode = false,
  selectedLanguageNames = new Set(),
  onToggleLanguageSelection,
}: LanguagesListProps) {
  if (languages.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-x-16 gap-y-10 text-base md:text-lg sm:grid-cols-2 xl:grid-cols-3">
      {languages.map((language) => {
        const isSelected = selectedLanguageNames.has(language.name);
        const levelColor =
          PROFICIENCY_COLOR_CLASSES[language.proficiency] ?? "text-gray-400";

        return (
          <div
            key={language.id}
            className={cn(
              "flex items-center gap-10 transition-colors",
              isDeleteMode && "cursor-pointer",
              isDeleteMode && isSelected && "text-red-400"
            )}
            onClick={() =>
              isDeleteMode && onToggleLanguageSelection?.(language.name)
            }
            role={isDeleteMode ? "button" : undefined}
            tabIndex={isDeleteMode ? 0 : undefined}
            onKeyDown={(event) => {
              if (!isDeleteMode) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onToggleLanguageSelection?.(language.name);
              }
            }}
          >
            <span className={cn("tracking-wide", levelColor)}>
              {language.proficiency}
            </span>
            <span className="text-[var(--color-text-muted)]">
              {language.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
