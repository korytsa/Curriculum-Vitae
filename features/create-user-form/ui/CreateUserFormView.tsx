import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input } from "@/shared/ui";
import type { FormikProps } from "formik";
import type { CreateUserFormValues } from "../model/useCreateUserForm";

const selectClass =
  "w-full h-11 rounded-md border border-[#555555] bg-transparent px-4 text-white focus-visible:outline-none focus:ring-2 focus:ring-white/30 appearance-none text-sm";

interface CreateUserFormViewProps {
  formik: FormikProps<CreateUserFormValues>;
  successMessage: string | null;
  errorMessage: string | null;
  loading: boolean;
}

export function CreateUserFormView({
  formik,
  successMessage,
  errorMessage,
  loading,
}: CreateUserFormViewProps) {
  const { t } = useTranslation();

  const roleOptions = useMemo(
    () => [
      { label: t("features.createUserForm.roles.employee"), value: "Employee" },
      { label: t("features.createUserForm.roles.admin"), value: "Admin" },
    ],
    [t]
  );

  return (
    <form
      className="space-y-6 bg-[#1C1C1C] border border-white/10 rounded-2xl px-8 py-8 shadow-lg"
      onSubmit={formik.handleSubmit}
    >
      {errorMessage ? (
        <div className="p-3 bg-red-500/10 border border-red-600 rounded-lg text-red-300 text-sm">
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div className="p-3 bg-green-500/10 border border-green-600 rounded-lg text-green-200 text-sm">
          {successMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            id="email"
            name="email"
            type="email"
            label={t("features.createUserForm.labels.email")}
            placeholder={t("features.createUserForm.placeholders.email")}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.email && formik.errors.email ? (
            <p className="mt-1 text-sm text-red-400">{formik.errors.email}</p>
          ) : null}
        </div>
        <div>
          <Input
            id="password"
            name="password"
            type="password"
            label={t("features.createUserForm.labels.password")}
            placeholder={t("features.createUserForm.placeholders.password")}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.password && formik.errors.password ? (
            <p className="mt-1 text-sm text-red-400">
              {formik.errors.password}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="firstName"
          name="firstName"
          type="text"
          label={t("features.createUserForm.labels.firstName")}
          placeholder={t("features.createUserForm.placeholders.firstName")}
          value={formik.values.firstName}
          onChange={formik.handleChange}
        />
        <Input
          id="lastName"
          name="lastName"
          type="text"
          label={t("features.createUserForm.labels.lastName")}
          placeholder={t("features.createUserForm.placeholders.lastName")}
          value={formik.values.lastName}
          onChange={formik.handleChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="departmentId"
          name="departmentId"
          type="text"
          label={t("features.createUserForm.labels.departmentId")}
          placeholder={t("features.createUserForm.placeholders.numericId")}
          value={formik.values.departmentId}
          onChange={formik.handleChange}
        />
        <Input
          id="positionId"
          name="positionId"
          type="text"
          label={t("features.createUserForm.labels.positionId")}
          placeholder={t("features.createUserForm.placeholders.numericId")}
          value={formik.values.positionId}
          onChange={formik.handleChange}
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs uppercase tracking-widest text-white/60">
          {t("features.createUserForm.labels.role")}
        </label>
        <select
          className={selectClass}
          id="role"
          name="role"
          value={formik.values.role}
          onChange={formik.handleChange}
        >
          {roleOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-black"
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading || !formik.isValid || formik.isSubmitting}
        >
          {loading || formik.isSubmitting
            ? t("features.createUserForm.buttons.creating")
            : t("features.createUserForm.buttons.create")}
        </Button>
      </div>
    </form>
  );
}
