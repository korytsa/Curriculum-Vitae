'use client';

import { Input, Modal } from '@/shared/ui';
import type { FormikProps } from 'formik';
import type { CategoryOption } from '../model/types';

interface AddSkillFormValues {
  skillName: string;
  categoryId: string;
}

interface AddSkillFormViewProps {
  formik: FormikProps<AddSkillFormValues>;
  categoryOptions: CategoryOption[];
  error: Error | undefined;
  loading: boolean;
  open: boolean;
  onCancel: () => void;
}

export function AddSkillFormView({
  formik,
  categoryOptions,
  error,
  loading,
  open,
  onCancel,
}: AddSkillFormViewProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Add skill"
      primaryAction={{
        label: 'CONFIRM',
        onClick: () => formik.handleSubmit(),
        disabled: loading || !formik.isValid || formik.isSubmitting,
      }}
      secondaryAction={{
        label: 'CANCEL',
        onClick: () => {
          formik.resetForm();
          onCancel();
        },
      }}
    >
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm mb-4">
          {error.message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Input
            id="skillName"
            label="Skill name"
            placeholder="Enter skill name"
            {...formik.getFieldProps('skillName')}
            required
          />
          {formik.touched.skillName && formik.errors.skillName ? (
            <p className="mt-1 text-sm text-red-400">{formik.errors.skillName}</p>
          ) : null}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="categoryId"
            className="text-xs uppercase tracking-[0.2em] text-gray-400"
          >
            Category
          </label>
          <select
            id="categoryId"
            {...formik.getFieldProps('categoryId')}
            className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id} className="text-black">
                {category.name}
              </option>
            ))}
          </select>
          {formik.touched.categoryId && formik.errors.categoryId ? (
            <p className="mt-1 text-sm text-red-400">{formik.errors.categoryId}</p>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}

