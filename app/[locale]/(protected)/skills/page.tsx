"use client";

import { useState } from "react";
import {
  useSkills,
  useDisplayCategories,
  useDeleteSkill,
} from "@/features/skills";
import { SkillsPageView } from "./ui/SkillsPageView";

export default function SkillsPage() {
  const [showAddSkillForm, setShowAddSkillForm] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedSkillIds, setSelectedSkillIds] = useState<Set<string>>(
    new Set()
  );

  const { skillsData, skillsLoading, refetchSkills } = useSkills();
  const displayCategories = useDisplayCategories(skillsData);
  const { deleteSkill, loading: deleteLoading } = useDeleteSkill();

  const handleToggleDeleteMode = () => {
    if (isDeleteMode) {
      setIsDeleteMode(false);
      setSelectedSkillIds(new Set());
    } else {
      setIsDeleteMode(true);
    }
  };

  const handleToggleSkillSelection = (skillId: string) => {
    setSelectedSkillIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(skillId)) {
        newSet.delete(skillId);
      } else {
        newSet.add(skillId);
      }
      return newSet;
    });
  };

  const handleDeleteSelectedSkills = async () => {
    if (selectedSkillIds.size === 0) return;

    try {
      const skillNames: string[] = Array.from(selectedSkillIds);

      if (skillNames.length === 0) return;

      await deleteSkill({ name: skillNames });
      setIsDeleteMode(false);
      setSelectedSkillIds(new Set());
      await refetchSkills?.();
    } catch (error) {
      console.error("Error deleting skills:", error);
    }
  };

  return (
    <SkillsPageView
      skillsLoading={skillsLoading}
      displayCategories={displayCategories}
      showAddSkillForm={showAddSkillForm}
      isDeleteMode={isDeleteMode}
      selectedSkillIds={selectedSkillIds}
      deleteLoading={deleteLoading}
      onOpenAddForm={() => setShowAddSkillForm(true)}
      onToggleDeleteMode={handleToggleDeleteMode}
      onToggleSkillSelection={handleToggleSkillSelection}
      onDeleteSelectedSkills={handleDeleteSelectedSkills}
      onCloseAddForm={() => setShowAddSkillForm(false)}
    />
  );
}
