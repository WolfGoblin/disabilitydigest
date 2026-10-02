import React from 'react'

export const metadata = {
  title: 'Privacy Policy | Disability Digest',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow border border-slate-200 space-y-6">
      <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
      <p className="text-xs text-slate-500">Effective Date: September 2026</p>

      <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
        <p>Disability Digest values your privacy. This policy outlines how we collect, store, and protect reader information.</p>

        <h2 className="font-bold text-slate-900 text-base">1. Information We Collect</h2>
        <p>We collect basic account credentials (name, email address, hashed password, or Facebook OAuth user ID) solely for reader commenting and session management.</p>

        <h2 className="font-bold text-slate-900 text-base">2. Data Usage</h2>
        <p>Your email address is never sold or transferred to third parties. We use secure HTTP-only cookies to keep you signed in.</p>

        <h2 className="font-bold text-slate-900 text-base">3. Reader Rights</h2>
        <p>You may request deletion of your account and posted comments at any time by contacting editor@disabilitydigest.org.</p>
      </div>
    </div>
  )
}
