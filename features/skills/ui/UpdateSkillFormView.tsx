'use client';

import { Input, Modal } from '@/shared/ui';
import type { FormikProps } from 'formik';
import type { CategoryOption } from '../model/types';

interface UpdateSkillFormValues {
  skillId: string;
  skillName: string;
  categoryId: string;
}

interface UpdateSkillFormViewProps {
  formik: FormikProps<UpdateSkillFormValues>;
  categoryOptions: CategoryOption[];
  allSkillsForSelect: Array<{ id: string; name: string }>;
  error: Error | undefined;
  loading: boolean;
  open: boolean;
  onCancel: () => void;
  onSkillSelect: (skillId: string) => void;
}

export function UpdateSkillFormView({
  formik,
  categoryOptions,
  allSkillsForSelect,
  error,
  loading,
  open,
  onCancel,
  onSkillSelect,
}: UpdateSkillFormViewProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Update skill"
      primaryAction={{
        label: 'CONFIRM',
        onClick: () => formik.handleSubmit(),
        disabled: loading || !formik.isValid || formik.isSubmitting || !formik.values.skillId,
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
        <div className="space-y-1">
          <label
            htmlFor="skillId"
            className="text-xs uppercase tracking-[0.2em] text-gray-400"
          >
            Select Skill
          </label>
          <select
            id="skillId"
            value={formik.values.skillId}
            onChange={(e) => onSkillSelect(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="" className="text-black">
              Select a skill...
            </option>
            {allSkillsForSelect.map((skill) => (
              <option key={skill.id} value={skill.id} className="text-black">
                {skill.name}
              </option>
            ))}
          </select>
          {formik.touched.skillId && formik.errors.skillId ? (
            <p className="mt-1 text-sm text-red-400">{formik.errors.skillId}</p>
          ) : null}
        </div>

        <div>
          <Input
            id="skillName"
            label="New Skill Name"
            placeholder="Enter new skill name"
            {...formik.getFieldProps('skillName')}
            required
            disabled={!formik.values.skillId}
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
            Category (optional)
          </label>
          <select
            id="categoryId"
            {...formik.getFieldProps('categoryId')}
            className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            disabled={!formik.values.skillId}
          >
            <option value="" className="text-black">
              Keep current category
            </option>
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

