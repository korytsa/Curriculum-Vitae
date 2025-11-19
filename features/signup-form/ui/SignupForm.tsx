'use client'

import { useFormik } from 'formik'
import { useRouter, usePathname } from 'next/navigation'
import { Button, Input } from '@/shared/ui'
import { useSignup } from '@/features/auth'

export function SignupForm() {
  const { signup, loading, error } = useSignup()
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname?.split('/')[1] || 'en'

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => {
      const errors: Partial<typeof values> = {}

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
    onSubmit: async (values) => {
      await signup(values.email.trim(), values.password)
    },
  })

  return (
    <form className="space-y-6" onSubmit={formik.handleSubmit}>
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
          {error.message}
        </div>
      )}
      <div>
        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="Email"
          {...formik.getFieldProps('email')}
          required
        />
        {formik.touched.email && formik.errors.email ? (
          <p className="mt-1 text-sm text-red-400">{formik.errors.email}</p>
        ) : null}
      </div>

      <div>
        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="Password"
          {...formik.getFieldProps('password')}
          required
        />
        {formik.touched.password && formik.errors.password ? (
          <p className="mt-1 text-sm text-red-400">{formik.errors.password}</p>
        ) : null}
      </div>

      <Button variant="primary" className="w-full" type="submit" disabled={loading || !formik.isValid || formik.isSubmitting}>
        {loading || formik.isSubmitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
      </Button>

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-white/60 hover:text-white transition-colors"
          onClick={() => router.push(`/${locale}/login`)}
        >
          I HAVE AN ACCOUNT
        </button>
      </div>
    </form>
  )
}

