'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export interface PasswordInputProps {
  id: string
  label: string
  placeholder?: string
  className?: string
}

export function PasswordInput({ id, label, placeholder = 'Enter your password', className }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          className="w-full h-12 px-4 pr-12 bg-[#2F2F2F] border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  )
}

