'use client'

import '../globals.css'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/shared/lib/i18n'
import { useEffect } from 'react'

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  useEffect(() => {
    i18n.changeLanguage(params.locale)
  }, [params.locale])

  return (
    <html lang={params.locale}>
      <body>
        <I18nextProvider i18n={i18n}>
          {children}
        </I18nextProvider>
      </body>
    </html>
  )
}
