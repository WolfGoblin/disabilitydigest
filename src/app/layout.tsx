import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AccessibilityToolbar } from '@/components/AccessibilityToolbar'

export const metadata: Metadata = {
  title: 'Disability Digest — News & Rights Platform',
  description: 'Independent news, rights advocacy, service directories, and community stories covering disability across Zimbabwe and Africa.',
  keywords: 'Disability Digest, Zimbabwe, Disability Rights, WCAG Accessibility, Pan-African Disability, Sign Language, Wheelchair Access',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <AccessibilityToolbar />
        <Header />
        <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
