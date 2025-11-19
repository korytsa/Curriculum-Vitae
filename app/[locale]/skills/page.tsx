'use client';

import { useState } from 'react';
import {
  useSkills,
  useCategoryOptions,
  useDisplayCategories,
  useAllSkillsForSelect,
} from '@/features/skills';
import { SkillsPageView } from './ui/SkillsPageView';

export default function SkillsPage() {
  const [showAddSkillForm, setShowAddSkillForm] = useState(false);
  const [showUpdateSkillForm, setShowUpdateSkillForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { categoriesData, skillsData, skillsLoading } = useSkills();
  const categoryOptions = useCategoryOptions(categoriesData);
  const displayCategories = useDisplayCategories(skillsData);
  const allSkillsForSelect = useAllSkillsForSelect(displayCategories);

  return (
    <SkillsPageView
      skillsLoading={skillsLoading}
      displayCategories={displayCategories}
      showAddSkillForm={showAddSkillForm}
      showUpdateSkillForm={showUpdateSkillForm}
      showDeleteModal={showDeleteModal}
      categoryOptions={categoryOptions}
      displayCategoriesForUpdate={displayCategories}
      allSkillsForSelect={allSkillsForSelect}
      onOpenAddForm={() => setShowAddSkillForm(true)}
      onOpenUpdateForm={() => setShowUpdateSkillForm(true)}
      onOpenDeleteModal={() => setShowDeleteModal(true)}
      onCloseAddForm={() => setShowAddSkillForm(false)}
      onCloseUpdateForm={() => setShowUpdateSkillForm(false)}
      onCloseDeleteModal={() => setShowDeleteModal(false)}
    />
  );
}
