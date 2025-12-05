"use client";

import { useTranslation } from "react-i18next";
import { EnvironmentField, Input, Select, TextArea } from "@/shared/ui";
import type { UserProjectFormProps } from "./types";

export function UserProjectForm({ formState, projectOptions, mode, isProjectListLoading, onFieldChange }: UserProjectFormProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        <Select
          align="bottom"
          label={t("cvs.projectsPage.modal.fields.project")}
          options={projectOptions}
          value={formState.projectId}
          onChange={(value) => onFieldChange("projectId", value)}
          disabled={mode === "update" || isProjectListLoading}
        />
        <Input label={t("cvs.projectsPage.modal.fields.domain")} value={formState.domain} readOnly disabled />
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Input
          type="date"
          label={t("cvs.projectsPage.modal.fields.startDate")}
          value={formState.startDate}
          onChange={(event) => onFieldChange("startDate", event.currentTarget.value)}
        />
        <Input type="date" label={t("cvs.projectsPage.modal.fields.endDate")} value={formState.endDate} onChange={(event) => onFieldChange("endDate", event.currentTarget.value)} />
      </div>
      <TextArea id="project-description" label={t("cvs.projectsPage.modal.fields.description")} value={formState.description} rows={5} readOnly />
      <EnvironmentField label={t("cvs.projectsPage.modal.fields.environment")} values={formState.environment} />
      <TextArea
        id="project-responsibilities"
        label={t("cvs.projectsPage.modal.fields.responsibilities")}
        placeholder={t("cvs.projectsPage.modal.fields.responsibilitiesPlaceholder")}
        value={formState.responsibilities}
        onChange={(event) => onFieldChange("responsibilities", event.currentTarget.value)}
      />
    </div>
  );
}
