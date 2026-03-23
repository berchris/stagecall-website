import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'StageCall — Every call, on time. Every time.',
  description:
    'StageCall keeps your production on schedule. Countdown timers and instant alerts for every crew team, delivered the moment they need them.',
  openGraph: {
    title: 'StageCall — Every call, on time. Every time.',
    description: 'Countdown timers and instant alerts for every crew team.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  )
}
