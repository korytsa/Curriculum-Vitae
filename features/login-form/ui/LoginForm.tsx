'use client'

import { useState } from 'react'
import { useFormik } from 'formik'
import { Button, Input } from '@/shared/ui'
import { useLogin, useForgotPassword } from '@/features/auth'

export function LoginForm() {
  const { login, loading, error } = useLogin()
  const { forgotPassword, loading: forgotLoading } = useForgotPassword()
  const [forgotFeedback, setForgotFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

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
      await login(values.email.trim(), values.password)
    },
  })

  return (
    <form className="space-y-6" onSubmit={formik.handleSubmit}>
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
          {error.message}
        </div>
      )}
      {forgotFeedback && (
        <div
          className={`p-3 rounded-lg text-sm ${
            forgotFeedback.type === 'success'
              ? 'bg-green-500/20 border border-green-500 text-green-300'
              : 'bg-red-500/20 border border-red-500 text-red-400'
          }`}
        >
          {forgotFeedback.message}
        </div>
      )}
      <div>
        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
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
          placeholder="Enter your password"
          {...formik.getFieldProps('password')}
          required
        />
        {formik.touched.password && formik.errors.password ? (
          <p className="mt-1 text-sm text-red-400">{formik.errors.password}</p>
        ) : null}
      </div>

      <Button variant="primary" className="w-full" type="submit" disabled={loading || !formik.isValid || formik.isSubmitting}>
        {loading || formik.isSubmitting ? 'LOGGING IN...' : 'LOG IN'}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={async () => {
            const trimmedEmail = formik.values.email.trim()
            if (!trimmedEmail) {
              setForgotFeedback({
                type: 'error',
                message: 'Please enter your email above so we know where to send the reset link.',
              })
              return
            }

            if (!emailRegex.test(trimmedEmail)) {
              setForgotFeedback({
                type: 'error',
                message: 'Please enter a valid email address.',
              })
              return
            }

            setForgotFeedback(null)

            try {
              await forgotPassword(trimmedEmail)
              setForgotFeedback({
                type: 'success',
                message: 'If this email exists, we just sent password reset instructions.',
              })
            } catch (forgotError) {
              const fallbackMessage =
                forgotError instanceof Error ? forgotError.message : 'Unable to send reset instructions right now.'
              setForgotFeedback({ type: 'error', message: fallbackMessage })
            }
          }}
          className="text-sm text-white/60 hover:text-white transition-colors disabled:opacity-60"
          disabled={forgotLoading}
        >
          {forgotLoading ? 'SENDING...' : 'FORGOT PASSWORD'}
        </button>
      </div>
    </form>
  )
}

