import type { Metadata } from 'next'
import LandingPage from '@/components/LandingPage'
import { dictionaries } from '@/lib/i18n'

const t = dictionaries.en

export const metadata: Metadata = {
  title: t.meta.title,
  description: t.meta.description,
  alternates: {
    canonical: '/en',
    languages: { nl: '/', en: '/en', 'x-default': '/' },
  },
  openGraph: {
    title: t.meta.title,
    description: t.meta.ogDescription,
    type: 'website',
    locale: 'en_US',
  },
}

export default function Page() {
  return <LandingPage lang="en" />
}
