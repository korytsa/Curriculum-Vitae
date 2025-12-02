"use client";

import { Plus } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { Button, ConfirmDeleteModal, SearchInput, Table } from "@/shared/ui";
import { CreateProjectModal } from "./components/CreateProjectModal";
import { useProjectsPage } from "./lib/useProjectsPage";
import type { ProjectsPageProps } from "./types";

export default function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = params;
  const { t } = useTranslation();
  const { searchInputProps, tableProps, addProjectLabel, handleAddProject, createProjectModal, deleteProjectModal } = useProjectsPage({
    locale,
  });

  return (
    <>
      <section className="pr-4">
        <div className="mb-1 flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <h1 className="font-semibold text-neutral-500 mt-1">{t("projectsHeading")}</h1>
            <div className="w-full sm:w-[325px]">
              <SearchInput {...searchInputProps} />
            </div>
          </div>
          <Button
            type="button"
            className="bg-transparent font-medium text-red-500 hover:bg-[#413535]"
            icon={<Plus className="h-5 w-5" />}
            iconPosition="left"
            onClick={handleAddProject}
          >
            {addProjectLabel}
          </Button>
        </div>
        <Table {...tableProps} />
      </section>
      <CreateProjectModal
        open={createProjectModal.open}
        onClose={createProjectModal.onClose}
        onSubmit={createProjectModal.onSubmit}
        initialProject={createProjectModal.initialProject}
        mode={createProjectModal.mode}
      />
      <ConfirmDeleteModal
        open={deleteProjectModal.open}
        onClose={deleteProjectModal.onClose}
        onConfirm={deleteProjectModal.onConfirm}
        isLoading={deleteProjectModal.isLoading}
        errorMessage={deleteProjectModal.errorMessage}
        title={t("cvs.projectsPage.deleteModal.title")}
      >
        <p className="font-normal">
          <Trans
            i18nKey="cvs.projectsPage.deleteModal.message"
            values={{ name: deleteProjectModal.projectName ?? "" }}
            components={{ strong: <span className="font-semibold" /> }}
          />
        </p>
      </ConfirmDeleteModal>
    </>
  );
}
