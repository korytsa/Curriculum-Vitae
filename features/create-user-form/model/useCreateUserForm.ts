import { useState } from 'react'
import { useFormik, type FormikProps } from 'formik'
import { useCreateUser } from '@/features/auth'

export type CreateUserFormRole = 'Admin' | 'Employee'

export interface CreateUserFormValues {
  email: string
  password: string
  firstName: string
  lastName: string
  departmentId: string
  positionId: string
  role: CreateUserFormRole
}

export interface CreateUserFormHook {
  formik: FormikProps<CreateUserFormValues>
  successMessage: string | null
  loading: boolean
  errorMessage: string | null
}

export function useCreateUserForm(): CreateUserFormHook {
  const { createUser, loading, error } = useCreateUser()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const formik = useFormik<CreateUserFormValues>({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      departmentId: '',
      positionId: '',
      role: 'Employee',
    },
    validateOnMount: true,
    validate: (values) => {
      const errors: Partial<Record<keyof CreateUserFormValues, string>> = {}

      if (!values.email.trim()) {
        errors.email = 'Email is required'
      } else if (!emailRegex.test(values.email.trim())) {
        errors.email = 'Invalid email address'
      }

      if (!values.password.trim()) {
        errors.password = 'Password is required'
      }

      return errors
    },
    onSubmit: async (values, helpers) => {
      setSuccessMessage(null)

      await createUser(
        values.email.trim(),
        values.password,
        {
          first_name: values.firstName,
          last_name: values.lastName,
        },
        values.role,
        {
          departmentId: values.departmentId.trim() || undefined,
          positionId: values.positionId.trim() || undefined,
        }
      )

      setSuccessMessage(`User ${values.email} created as ${values.role}.`)
      helpers.resetForm()
    },
  })

  return {
    formik,
    successMessage,
    loading,
    errorMessage: error?.message ?? null,
  }
}

