"use client";

import { Plus } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { Button, ConfirmDeleteModal, SearchInput, Table } from "@/shared/ui";
import type { SearchInputProps, TableProps } from "@/shared/ui";
import type { CvProject } from "@/shared/graphql/generated";

export type ProjectsPageLayoutProps = {
  searchInputProps: SearchInputProps<CvProject>;
  tableProps: TableProps<CvProject>;
  addProjectLabel: string;
  onAddProject: () => void;
  deleteModal: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    isLoading: boolean;
    errorMessage?: string | null;
    projectName?: string;
  };
  heading?: string;
  renderModal: () => React.ReactNode;
};

export function ProjectsPageLayout({ searchInputProps, tableProps, addProjectLabel, onAddProject, deleteModal, heading, renderModal }: ProjectsPageLayoutProps) {
  const { t } = useTranslation();

  return (
    <>
      <section className="pr-4">
        <div className="mb-1 flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            {heading && <h1 className="font-semibold text-neutral-500 mt-1">{heading}</h1>}
            <div className="w-full sm:w-[325px]">
              <SearchInput {...searchInputProps} />
            </div>
          </div>
          <Button
            type="button"
            className="bg-transparent font-medium text-red-500 hover:bg-[#413535]"
            icon={<Plus className="h-5 w-5" />}
            iconPosition="left"
            onClick={onAddProject}
          >
            {addProjectLabel}
          </Button>
        </div>
        <Table {...tableProps} />
      </section>
      {renderModal()}
      <ConfirmDeleteModal
        open={deleteModal.open}
        onClose={deleteModal.onClose}
        onConfirm={deleteModal.onConfirm}
        isLoading={deleteModal.isLoading}
        errorMessage={deleteModal.errorMessage}
        title={t("cvs.projectsPage.deleteModal.title")}
      >
        <p className="font-normal">
          <Trans i18nKey="cvs.projectsPage.deleteModal.message" values={{ name: deleteModal.projectName ?? "" }} components={{ strong: <span className="font-semibold" /> }} />
        </p>
      </ConfirmDeleteModal>
    </>
  );
}
