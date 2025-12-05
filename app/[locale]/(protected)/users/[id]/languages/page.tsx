"use client";

import { useState } from "react";
import {
  useLanguages,
  useDisplayLanguages,
  useDeleteLanguage,
} from "@/features/languages";
import { LanguagesPageView } from "@/app/[locale]/(protected)/languages/ui/LanguagesPageView";

export default function UserLanguagesTabPage() {
  const [showAddLanguageForm, setShowAddLanguageForm] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedLanguageNames, setSelectedLanguageNames] = useState<
    Set<string>
  >(new Set());

  const { languagesData, languagesLoading, refetchLanguages } = useLanguages();
  const languages = useDisplayLanguages(languagesData);
  const { deleteLanguage, loading: deleteLoading } = useDeleteLanguage();

  const handleToggleDeleteMode = () => {
    if (isDeleteMode) {
      setIsDeleteMode(false);
      setSelectedLanguageNames(new Set());
    } else {
      setIsDeleteMode(true);
    }
  };

  const handleToggleLanguageSelection = (languageName: string) => {
    setSelectedLanguageNames((prev) => {
      const next = new Set(prev);
      if (next.has(languageName)) {
        next.delete(languageName);
      } else {
        next.add(languageName);
      }
      return next;
    });
  };

  const handleDeleteSelectedLanguages = async () => {
    if (selectedLanguageNames.size === 0) return;

    await deleteLanguage({ name: Array.from(selectedLanguageNames) });
    setIsDeleteMode(false);
    setSelectedLanguageNames(new Set());
    await refetchLanguages?.();
  };

  return (
    <LanguagesPageView
      languagesLoading={languagesLoading}
      languages={languages}
      showAddLanguageForm={showAddLanguageForm}
      isDeleteMode={isDeleteMode}
      selectedLanguageNames={selectedLanguageNames}
      deleteLoading={deleteLoading}
      onOpenAddForm={() => setShowAddLanguageForm(true)}
      onToggleDeleteMode={handleToggleDeleteMode}
      onToggleLanguageSelection={handleToggleLanguageSelection}
      onDeleteSelectedLanguages={handleDeleteSelectedLanguages}
      onCloseAddForm={() => setShowAddLanguageForm(false)}
      showHeading={false}
    />
  );
}
