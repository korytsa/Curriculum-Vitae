'use client'

import { useRouter, usePathname } from 'next/navigation'

export function AuthTabs() {
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname?.includes('/login')

  return (
    <nav className="flex justify-center gap-8 pt-8 pb-4">
      <button
        onClick={() => {
          const locale = pathname?.split('/')[1] || 'en'
          router.push(`/${locale}/login`)
        }}
        className={`text-sm font-semibold uppercase tracking-wide transition-colors ${
          isLoginPage
            ? 'text-red-500 border-b-2 border-red-500 pb-2'
            : 'text-white hover:text-gray-300'
        }`}
      >
        LOG IN
      </button>
      <button
        onClick={() => {
          const locale = pathname?.split('/')[1] || 'en'
          router.push(`/${locale}/signup`)
        }}
        className={`text-sm font-semibold uppercase tracking-wide transition-colors ${
          !isLoginPage
            ? 'text-red-500 border-b-2 border-red-500 pb-2'
            : 'text-white hover:text-gray-300'
        }`}
      >
        SIGN UP
      </button>
    </nav>
  )
}

