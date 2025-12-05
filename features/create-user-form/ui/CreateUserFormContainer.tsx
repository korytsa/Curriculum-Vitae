import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib";
import { useCreateUserForm } from "../model/useCreateUserForm";
import { CreateUserFormView } from "./CreateUserFormView";

interface CreateUserFormContainerProps {
  showHeading?: boolean;
  className?: string;
  onSuccess?: (message: string) => void;
}

export function CreateUserFormContainer({
  showHeading = true,
  className,
  onSuccess,
}: CreateUserFormContainerProps) {
  const { formik, successMessage, errorMessage, loading } = useCreateUserForm({
    onSuccess,
  });
  const { t } = useTranslation();

  return (
    <div className={cn("space-y-8", !showHeading && "space-y-6", className)}>
      {showHeading ? (
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-white">
            {t("features.createUserForm.heading")}
          </h1>
          <p className="text-white/70 text-base">
            {t("features.createUserForm.description")}
          </p>
        </div>
      ) : null}

      <CreateUserFormView
        formik={formik}
        successMessage={successMessage}
        errorMessage={errorMessage}
        loading={loading}
      />
    </div>
  );
}
