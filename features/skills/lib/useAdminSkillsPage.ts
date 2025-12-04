"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useAdminSkills } from "../model/useAdminSkills";
import { useAdminCreateSkill, useAdminUpdateSkill } from "../model/useSkillMutations";
import { useAdminDeleteSkill } from "./useAdminDeleteSkill";
import { useAdminSkillsTable } from "./useAdminSkillsTable";
import { ADMIN_SKILL_FORM_INITIAL_STATE } from "./constants";
import type { UseAdminSkillsPageResult, AdminSkillFormState, AdminSkill } from "../types";

export function useAdminSkillsPage(): UseAdminSkillsPageResult {
  const { t } = useTranslation();
  const { adminSkillsData, adminSkillsLoading, refetchAdminSkills } = useAdminSkills();
  const { createSkill, loading: createLoading } = useAdminCreateSkill();
  const { updateSkill, loading: updateLoading } = useAdminUpdateSkill();
  const { deleteSkillModal, handleDeleteRequest, loading: deleteLoading } = useAdminDeleteSkill(refetchAdminSkills);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<AdminSkill | null>(null);
  const [formState, setFormState] = useState<AdminSkillFormState>(ADMIN_SKILL_FORM_INITIAL_STATE);

  const allSkills: AdminSkill[] = (adminSkillsData?.skills as AdminSkill[]) || [];

  const handleOpenCreateForm = () => {
    setFormState(ADMIN_SKILL_FORM_INITIAL_STATE);
    setShowCreateForm(true);
  };

  const handleCloseCreateForm = () => {
    setFormState(ADMIN_SKILL_FORM_INITIAL_STATE);
    setShowCreateForm(false);
  };

  const handleOpenUpdateForm = (skill: AdminSkill) => {
    setSelectedSkill(skill);
    setFormState({
      name: skill.name || "",
      typeId: skill.category_parent_name || "",
      categoryId: skill.category_name || "",
    });
    setShowUpdateForm(true);
  };

  const handleCloseUpdateForm = () => {
    setSelectedSkill(null);
    setFormState(ADMIN_SKILL_FORM_INITIAL_STATE);
    setShowUpdateForm(false);
  };

  const handleFieldChange = <K extends keyof AdminSkillFormState>(field: K, value: AdminSkillFormState[K]) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const isValid = formState.name.trim() !== "" && formState.typeId !== "" && formState.categoryId !== "";

  const handleCreateSubmit = async () => {
    if (!isValid || createLoading) return;

    await createSkill({
      name: formState.name.trim(),
      categoryId: formState.categoryId || undefined,
    });
    toast.success(t("admin.skills.messages.createSuccess"));
    handleCloseCreateForm();
    await refetchAdminSkills();
  };

  const handleUpdateSubmit = async () => {
    if (!isValid || updateLoading || !selectedSkill) return;

    await updateSkill({
      skillId: selectedSkill.id,
      name: formState.name.trim(),
      categoryId: formState.categoryId || undefined,
    });
    toast.success(t("admin.skills.messages.updateSuccess"));
    handleCloseUpdateForm();
    await refetchAdminSkills();
  };

  const { searchInputProps, tableProps } = useAdminSkillsTable({
    skills: allSkills,
    isLoading: adminSkillsLoading || deleteLoading,
    onEdit: handleOpenUpdateForm,
    onDelete: handleDeleteRequest,
  });

  return {
    searchInputProps,
    tableProps,
    heading: t("admin.skills.heading"),
    createButtonLabel: t("admin.skills.actions.create"),
    handleOpenCreateForm,
    createModal: {
      open: showCreateForm,
      onClose: handleCloseCreateForm,
      formState,
      onFieldChange: handleFieldChange,
      onSubmit: handleCreateSubmit,
      isLoading: createLoading,
      isValid,
    },
    updateModal: {
      open: showUpdateForm,
      onClose: handleCloseUpdateForm,
      formState,
      onFieldChange: handleFieldChange,
      onSubmit: handleUpdateSubmit,
      isLoading: updateLoading,
      isValid,
    },
    deleteSkillModal,
    refetchAdminSkills,
  };
}
