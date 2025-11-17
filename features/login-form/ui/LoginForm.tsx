'use client'

import { useState } from 'react'
import { Button } from '@/shared/ui'
import { useLogin } from '@/features/auth'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useLogin()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
          {error.message}
        </div>
      )}
      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium text-white">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full h-12 px-4 bg-[#2F2F2F] border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="Enter your email"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-medium text-white">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full h-12 px-4 bg-[#2F2F2F] border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder="Enter your password"
        />
      </div>

      <Button variant="primary" className="w-full" type="submit" disabled={loading}>
        {loading ? 'LOGGING IN...' : 'LOG IN'}
      </Button>

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-white/60 hover:text-white transition-colors"
        >
          FORGOT PASSWORD
        </button>
      </div>
    </form>
  )
}

