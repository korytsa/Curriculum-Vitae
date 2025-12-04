"use client";

import { useTranslation } from "react-i18next";
import { Input, Select } from "@/shared/ui";
import { TYPE_OPTIONS, CATEGORY_OPTIONS } from "../../lib/constants";
import type { AdminSkillFormProps } from "../../types";

export function AdminSkillForm({ formState, onFieldChange }: AdminSkillFormProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <Input
        id="name"
        name="name"
        type="text"
        label={t("admin.skills.form.labels.name")}
        value={formState.name}
        onChange={(event) => onFieldChange("name", event.currentTarget.value)}
      />

      <Select
        id="typeId"
        label={t("admin.skills.form.labels.type")}
        value={formState.typeId}
        onChange={(value) => {
          onFieldChange("typeId", value);
          onFieldChange("categoryId", "");
        }}
        options={TYPE_OPTIONS}
        align="bottom"
      />

      <Select
        id="categoryId"
        label={t("admin.skills.form.labels.category")}
        value={formState.categoryId}
        onChange={(value) => onFieldChange("categoryId", value)}
        options={CATEGORY_OPTIONS}
        align="bottom"
      />
    </div>
  );
}
