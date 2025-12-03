"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import type { SearchInputProps } from "@/shared/ui";
import { AdminSkillsPageView } from "./AdminSkillsPageView";
import { AdminSkillsTable } from "./AdminSkillsTable";
import { AdminCreateSkillForm } from "./AdminCreateSkillForm";
import { AdminUpdateSkillForm } from "./AdminUpdateSkillForm";
import { useAdminSkills } from "../model/useAdminSkills";
import { useAdminDeleteSkill } from "../model/useAdminDeleteSkill";
import type { AdminSkill, AdminSkillTableRow } from "../model/adminTypes";

const ADMIN_SKILLS_SEARCH_FIELDS = ["name", "type", "category"] as const;

export function AdminSkillsPageContainer() {
  const { t } = useTranslation();
  const { adminSkillsData, adminSkillsLoading, refetchAdminSkills } = useAdminSkills();
  const { deleteSkill, loading: deleteLoading } = useAdminDeleteSkill();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<AdminSkill | null>(null);
  const [filteredSkills, setFilteredSkills] = useState<AdminSkill[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResetKey, setSearchResetKey] = useState(0);

  const allSkills = useMemo(() => adminSkillsData?.skills || [], [adminSkillsData?.skills]);

  const tableRows: AdminSkillTableRow[] = useMemo(() => {
    return allSkills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      type: skill.category_parent_name || skill.category?.name || "",
      category: skill.category_name || skill.category?.name || "",
      categoryId: skill.category?.id || null,
    }));
  }, [allSkills]);

  useEffect(() => {
    setFilteredSkills(allSkills);
  }, [allSkills]);

  const handleSearchResults = (results: AdminSkillTableRow[]) => {
    const resultIds = new Set(results.map((r) => r.id));
    setFilteredSkills(allSkills.filter((skill) => resultIds.has(skill.id)));
  };

  const handleResetSearch = () => {
    setSearchResetKey((prev) => prev + 1);
    setFilteredSkills(allSkills);
    setSearchQuery("");
  };

  const isSearchActive = searchQuery.trim().length > 0;

  const searchInputProps: SearchInputProps<AdminSkillTableRow> = {
    data: tableRows,
    fields: [...ADMIN_SKILLS_SEARCH_FIELDS],
    onResults: handleSearchResults,
    onQueryChange: setSearchQuery,
    resetKey: searchResetKey,
    hasError: isSearchActive && filteredSkills.length === 0,
    placeholder: t("admin.skills.search.placeholder"),
  };

  const handleOpenCreateForm = () => setShowCreateForm(true);
  const handleCloseCreateForm = () => setShowCreateForm(false);

  const handleOpenUpdateForm = (skill: AdminSkill) => {
    setSelectedSkill(skill);
    setShowUpdateForm(true);
  };
  const handleCloseUpdateForm = () => {
    setSelectedSkill(null);
    setShowUpdateForm(false);
  };

  const handleCreateSuccess = async () => {
    toast.success(t("admin.skills.messages.createSuccess"));
    handleCloseCreateForm();
    await refetchAdminSkills();
  };

  const handleUpdateSuccess = async () => {
    toast.success(t("admin.skills.messages.updateSuccess"));
    handleCloseUpdateForm();
    await refetchAdminSkills();
  };

  const handleDelete = async (skill: AdminSkill) => {
    if (!confirm(t("admin.skills.messages.deleteConfirm", { name: skill.name }))) {
      return;
    }

    try {
      await deleteSkill({ skillId: skill.id });
      toast.success(t("admin.skills.messages.deleteSuccess"));
      await refetchAdminSkills();
    } catch (error) {
      toast.error(t("admin.skills.messages.deleteError"));
    }
  };

  return (
    <>
      <AdminSkillsPageView
        heading={t("admin.skills.heading")}
        createButtonLabel={t("admin.skills.actions.create")}
        searchInputProps={searchInputProps}
        onOpenCreateForm={handleOpenCreateForm}
      >
        <AdminSkillsTable skills={filteredSkills} loading={adminSkillsLoading || deleteLoading} onEdit={handleOpenUpdateForm} onDelete={handleDelete} />
      </AdminSkillsPageView>

      <AdminCreateSkillForm open={showCreateForm} onSuccess={handleCreateSuccess} onCancel={handleCloseCreateForm} />

      <AdminUpdateSkillForm open={showUpdateForm} skill={selectedSkill} onSuccess={handleUpdateSuccess} onCancel={handleCloseUpdateForm} />
    </>
  );
}
