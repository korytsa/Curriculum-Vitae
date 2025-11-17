'use client'

import { useTranslation } from 'react-i18next'

export default function Home({
  params,
}: {
  params: { locale: string }
}) {
  const { t } = useTranslation()

  return (
    <main>
      <h1>{t('title')}</h1>
    </main>
  )
}
