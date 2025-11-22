"use client";

import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, Loader } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { CategoryBlock, AddSkillForm } from "@/features/skills";
import type { SkillCategory } from "@/features/skills";

interface SkillsPageViewProps {
  skillsLoading: boolean;
  displayCategories: SkillCategory[];
  showAddSkillForm: boolean;
  isDeleteMode: boolean;
  selectedSkillIds: Set<string>;
  deleteLoading?: boolean;
  onOpenAddForm: () => void;
  onToggleDeleteMode: () => void;
  onToggleSkillSelection: (skillId: string) => void;
  onDeleteSelectedSkills: () => void;
  onCloseAddForm: () => void;
}

export function SkillsPageView({
  skillsLoading,
  displayCategories,
  showAddSkillForm,
  isDeleteMode,
  selectedSkillIds,
  deleteLoading,
  onOpenAddForm,
  onToggleDeleteMode,
  onToggleSkillSelection,
  onDeleteSelectedSkills,
  onCloseAddForm,
}: SkillsPageViewProps) {
  const { t } = useTranslation();

  const hasSkills = displayCategories.some(
    (cat) =>
      cat.skills.length > 0 ||
      cat.children?.some((child) => child.skills.length > 0)
  );

  return (
    <section className="px-6 py-8 text-white space-y-10">
      <div className="flex justify-between items-start gap-16">
        <h1 className="text-sm font-semibold text-gray-400 tracking-[0.2em] uppercase">
          {t("skills.heading")}
        </h1>

        <div className="flex-1 mt-16">
          {skillsLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader size="lg" />
            </div>
          ) : (
            <div className="space-y-16">
              {displayCategories.length > 0 &&
                displayCategories.map((category) => (
                  <CategoryBlock
                    key={category.id}
                    category={category}
                    isDeleteMode={isDeleteMode}
                    selectedSkillIds={selectedSkillIds}
                    onToggleSkillSelection={onToggleSkillSelection}
                  />
                ))}
            </div>
          )}

          <div
            className={cn(
              "flex flex-wrap items-center gap-10 pr-4 lg:pr-20 text-sm uppercase tracking-wide mt-8",
              hasSkills ? "justify-end" : "justify-center"
            )}
          >
            <Button
              type="button"
              variant="ghost"
              className="flex items-center gap-2 rounded-full px-4 py-2 text-gray-400 text-xs md:text-sm tracking-[0.2em] hover:text-gray-200 transition-colors"
              icon={<Plus className="h-4 w-4" />}
              onClick={onOpenAddForm}
              disabled={
                skillsLoading ||
                isDeleteMode ||
                showAddSkillForm ||
                deleteLoading
              }
            >
              {t("features.skills.page.actions.add")}
            </Button>
            {hasSkills && (
              <Button
                type="button"
                variant="ghost"
                className="flex items-center gap-2 text-red-500 text-xs md:text-sm tracking-[0.2em] hover:text-red-300 transition-colors"
                icon={<Trash2 className="h-4 w-4" />}
                onClick={
                  isDeleteMode && selectedSkillIds.size > 0
                    ? onDeleteSelectedSkills
                    : onToggleDeleteMode
                }
                disabled={
                  skillsLoading ||
                  deleteLoading ||
                  showAddSkillForm ||
                  (isDeleteMode && selectedSkillIds.size === 0)
                }
              >
                {t("features.skills.page.actions.delete")}
                {isDeleteMode && selectedSkillIds.size > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-red-500 text-white rounded-full text-xs font-semibold">
                    {selectedSkillIds.size}
                  </span>
                )}
              </Button>
            )}
          </div>

          <AddSkillForm
            open={showAddSkillForm}
            onSuccess={onCloseAddForm}
            onCancel={onCloseAddForm}
          />
        </div>
      </div>
    </section>
  );
}
