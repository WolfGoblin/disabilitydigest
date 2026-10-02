import React from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export const metadata = {
  title: 'Contact Us | Disability Digest',
}

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="bg-white p-8 rounded-2xl shadow border border-slate-200 space-y-2">
        <h1 className="text-3xl font-black text-slate-900">Contact the Editorial Desk</h1>
        <p className="text-sm text-slate-600">Have a news tip, press release, or accessibility feedback? Get in touch with our editorial team.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow border border-slate-200 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Send a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
              <input type="text" required className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input type="email" required className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Message / Tip</label>
              <textarea rows={4} required className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-sm"></textarea>
            </div>
            <button type="submit" className="px-6 py-3 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-lg shadow flex items-center gap-2">
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-base font-bold text-amber-400 uppercase tracking-wider">Office Details</h2>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                <span>Disability Digest Bureau, Harare, Zimbabwe</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>editor@disabilitydigest.org</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+263 (0) 242 700000</span>
              </div>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-4">
            Available Monday – Friday, 8:00am – 5:00pm CAT.
          </div>
        </div>
      </div>
    </div>
  )
}
