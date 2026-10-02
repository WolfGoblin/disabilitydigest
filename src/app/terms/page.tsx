import React from 'react'

export const metadata = {
  title: 'Terms of Use | Disability Digest',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow border border-slate-200 space-y-6">
      <h1 className="text-3xl font-black text-slate-900">Terms of Use</h1>
      <p className="text-xs text-slate-500">Effective Date: September 2026</p>

      <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
        <p>By accessing Disability Digest, you agree to comply with our community guidelines and terms of service.</p>

        <h2 className="font-bold text-slate-900 text-base">1. Community Commenting Standards</h2>
        <p>Comments containing hate speech, discrimination, harassment, abusive language, or commercial spam will be removed immediately by administrators and may result in account suspension.</p>

        <h2 className="font-bold text-slate-900 text-base">2. Intellectual Property</h2>
        <p>All articles, images, and content published on Disability Digest are protected under copyright law. Re-publication requires proper attribution and written authorization.</p>
      </div>
    </div>
  )
}
