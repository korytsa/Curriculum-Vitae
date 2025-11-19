"use client";

import { Plus, Trash2 } from "lucide-react";
import { Loader } from "@/shared/ui";
import {
  CategoryBlock,
  AddSkillForm,
  UpdateSkillForm,
  DeleteSkillModal,
} from "@/features/skills";
import type { SkillCategory } from "@/features/skills";

interface SkillsPageViewProps {
  skillsLoading: boolean;
  displayCategories: SkillCategory[];
  showAddSkillForm: boolean;
  showUpdateSkillForm: boolean;
  showDeleteModal: boolean;
  categoryOptions: Array<{ id: string; name: string }>;
  displayCategoriesForUpdate: SkillCategory[];
  allSkillsForSelect: Array<{ id: string; name: string }>;
  onOpenAddForm: () => void;
  onOpenUpdateForm: () => void;
  onOpenDeleteModal: () => void;
  onCloseAddForm: () => void;
  onCloseUpdateForm: () => void;
  onCloseDeleteModal: () => void;
}

export function SkillsPageView({
  skillsLoading,
  displayCategories,
  showAddSkillForm,
  showUpdateSkillForm,
  showDeleteModal,
  categoryOptions,
  displayCategoriesForUpdate,
  allSkillsForSelect,
  onOpenAddForm,
  onOpenUpdateForm,
  onOpenDeleteModal,
  onCloseAddForm,
  onCloseUpdateForm,
  onCloseDeleteModal,
}: SkillsPageViewProps) {
  return (
    <section className="px-6 py-8 text-white space-y-10">
      <div className="flex justify-between items-start gap-16">
        <h1 className="text-sm font-semibold text-gray-400 tracking-[0.2em] uppercase">
          Skills
        </h1>

        <div className="flex-1 space-y-16 mt-16">
          {skillsLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader size="lg" />
            </div>
          ) : (
            displayCategories.map((category) => (
              <CategoryBlock key={category.id} category={category} />
            ))
          )}

          {!skillsLoading && (
            <div className="flex flex-wrap items-center justify-end gap-10 pr-4 lg:pr-20 text-sm uppercase tracking-wide">
              <button
                type="button"
                onClick={onOpenAddForm}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-gray-400 text-xs md:text-sm tracking-[0.2em] hover:text-gray-200 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Skill
              </button>
              <button
                type="button"
                onClick={onOpenUpdateForm}
                className="flex items-center gap-2 text-blue-500 text-xs md:text-sm tracking-[0.2em] hover:text-blue-300 transition-colors"
              >
                Update Skill
              </button>
              <button
                type="button"
                onClick={onOpenDeleteModal}
                className="flex items-center gap-2 text-red-500 text-xs md:text-sm tracking-[0.2em] hover:text-red-300 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Remove Skills
              </button>
            </div>
          )}

          <AddSkillForm
            open={showAddSkillForm}
            categoryOptions={categoryOptions}
            onSuccess={onCloseAddForm}
            onCancel={onCloseAddForm}
          />

          <UpdateSkillForm
            open={showUpdateSkillForm}
            categoryOptions={categoryOptions}
            displayCategories={displayCategoriesForUpdate}
            allSkillsForSelect={allSkillsForSelect}
            onSuccess={onCloseUpdateForm}
            onCancel={onCloseUpdateForm}
          />

          <DeleteSkillModal
            open={showDeleteModal}
            allSkillsForSelect={allSkillsForSelect}
            onClose={onCloseDeleteModal}
            onSuccess={onCloseDeleteModal}
          />
        </div>
      </div>
    </section>
  );
}
