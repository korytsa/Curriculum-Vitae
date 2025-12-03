"use client";

import { useTranslation } from "react-i18next";
import { Input, TextArea, MultiSelectEnvironmentField } from "@/shared/ui";
import { FORM_FIELDS, TECHNOLOGY_OPTIONS } from "@/features/projects";
import type { AdminProjectFormProps } from "./types";

export function AdminProjectForm({ formState, onFieldChange }: AdminProjectFormProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        <Input label={t("cvs.projectsPage.modal.fields.name")} value={formState.name} onChange={(event) => onFieldChange("name", event.currentTarget.value)} />
        <Input label={t("cvs.projectsPage.modal.fields.domain")} value={formState.domain} onChange={(event) => onFieldChange("domain", event.currentTarget.value)} />
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
      <TextArea
        id="project-description"
        label={t("cvs.projectsPage.modal.fields.description")}
        value={formState.description}
        rows={FORM_FIELDS.descriptionRows}
        onChange={(event) => onFieldChange("description", event.currentTarget.value)}
      />
      <MultiSelectEnvironmentField
        label={t("cvs.projectsPage.modal.fields.environment")}
        values={formState.environment}
        onChange={(values) => onFieldChange("environment", values)}
        placeholder={t("cvs.projectsPage.modal.fields.environmentPlaceholder")}
        options={[...TECHNOLOGY_OPTIONS]}
      />
    </div>
  );
}
