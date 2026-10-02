'use client'

import React, { useState } from 'react'
import { Mail, CheckCircle2, Send, ShieldCheck } from 'lucide-react'

export function NewsletterSubscribe() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      setEmail('')
    }, 600)
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="bg-gradient-to-r from-brand-900 via-brand-700 to-brand-800 text-white rounded-3xl p-8 md:p-12 shadow-xl border border-brand-600 relative overflow-hidden my-12"
    >
      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-5">
        <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-bold text-xs uppercase px-3 py-1 rounded-full shadow mx-auto">
          <Mail className="w-3.5 h-3.5" />
          <span>Stay Informed & Connected</span>
        </div>

        <h2 id="newsletter-heading" className="text-2xl md:text-4xl font-black uppercase font-sans tracking-tight leading-tight">
          Subscribe to the Disability Digest Digest
        </h2>

        <p className="text-brand-100 text-xs md:text-sm leading-relaxed max-w-xl mx-auto">
          Get weekly news updates on disability rights, policy changes, healthcare developments, and community advocacy stories delivered directly to your inbox.
        </p>

        {submitted ? (
          <div className="bg-emerald-500/20 border border-emerald-400 text-emerald-100 p-4 rounded-2xl text-xs md:text-sm font-semibold flex items-center justify-center gap-2 max-w-md mx-auto animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Thank you for subscribing! You will receive our weekly digest updates.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <div className="relative w-full">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full pl-10 pr-4 py-3 bg-brand-950/80 text-white placeholder-brand-300 rounded-xl text-xs md:text-sm border border-brand-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="Email address for newsletter"
              />
              <Mail className="w-4 h-4 text-brand-300 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs md:text-sm rounded-xl shadow transition whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Subscribing...' : 'Subscribe Now'}</span>
            </button>
          </form>
        )}

        <div className="flex items-center justify-center gap-2 text-[11px] text-brand-200 pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>No spam. Unsubscribe anytime with 1-click.</span>
        </div>
      </div>
    </section>
  )
}
