import React from 'react'
import { ShieldCheck, Target, Heart, Eye } from 'lucide-react'

export const metadata = {
  title: 'About Us | Disability Digest',
  description: 'Disability Digest is a dedicated news and publishing platform covering disability rights, policy, health, education, and community stories in Zimbabwe and Africa.',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header className="bg-brand-700 text-white p-8 md:p-12 rounded-3xl shadow-xl space-y-4">
        <span className="bg-amber-400 text-slate-950 font-bold text-xs uppercase px-3 py-1 rounded-full">
          About Disability Digest
        </span>
        <h1 className="text-3xl md:text-5xl font-black uppercase font-sans tracking-tight">
          Empowering Communities Through Independent Journalism
        </h1>
        <p className="text-brand-100 text-base md:text-lg leading-relaxed">
          Disability Digest is Zimbabwe's premier independent news platform dedicated to promoting disability inclusion, reporting on policy enforcement, and celebrating human rights achievements.
        </p>
      </header>

      <section className="bg-white p-8 rounded-2xl shadow border border-slate-200 space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 border-b pb-3">Our Core Objectives</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <Target className="w-8 h-8 text-brand-700" />
            <h3 className="font-bold text-slate-900">Policy & Legal Advocacy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Monitoring national legislation, the UN Convention on the Rights of Persons with Disabilities (UNCRPD), and the African Disability Protocol.
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <Eye className="w-8 h-8 text-brand-700" />
            <h3 className="font-bold text-slate-900">Digital & Built Accessibility</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Advocating for accessible public infrastructure, WCAG digital standards, and inclusive public transport systems across urban and rural centers.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 space-y-3">
          <h3 className="font-bold text-slate-900 text-lg">Accessibility Commitment</h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Our platform is engineered from the ground up to comply with WCAG 2.1 AA accessibility guidelines. We feature dynamic font resizers, high contrast modes, screen-reader optimized landmarks, keyboard navigation support, and compressed page weights for fast access on variable 3G mobile networks.
          </p>
        </div>
      </section>
    </div>
  )
}
