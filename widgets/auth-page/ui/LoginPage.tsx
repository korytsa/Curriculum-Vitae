'use client'

import { LoginForm } from '@/features/login-form'
import { AuthTabs } from './AuthTabs'

export function LoginPage() {
  return (
    <div className="min-h-screen bg-[#1F1F1F] flex flex-col">
      <AuthTabs />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-white">Welcome back</h1>
            <p className="text-lg text-white/80">Hello again! Log in to continue</p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  )
}

