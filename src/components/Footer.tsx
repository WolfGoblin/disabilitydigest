import React from 'react'
import Link from 'next/link'
import { ShieldCheck, Heart, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="bg-brand-700 text-white p-2 rounded-lg font-black text-xl">DD</div>
              <span className="font-black text-xl tracking-tight text-white uppercase font-sans">
                DISABILITY <span className="text-amber-400">DIGEST</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zimbabwe & Pan-African independent news, rights advocacy, service directories, and community reporting dedicated to persons with disabilities.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700 w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>WCAG 2.1 AA Compliant</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Categories
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/category/policy" className="hover:text-amber-400 transition">Policy & Rights</Link></li>
              <li><Link href="/category/health" className="hover:text-amber-400 transition">Health & Rehabilitation</Link></li>
              <li><Link href="/category/education" className="hover:text-amber-400 transition">Education & Training</Link></li>
              <li><Link href="/category/accessibility" className="hover:text-amber-400 transition">Accessibility & Tech</Link></li>
              <li><Link href="/category/opinion" className="hover:text-amber-400 transition">Opinion & Community</Link></li>
              <li><Link href="/category/regional-news" className="hover:text-amber-400 transition">Regional News</Link></li>
            </ul>
          </div>

          {/* Governance & Info */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Information
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-amber-400 transition">About Disability Digest</Link></li>
              <li><Link href="/contact" className="hover:text-amber-400 transition">Contact Us & News Desk</Link></li>
              <li><Link href="/privacy" className="hover:text-amber-400 transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-amber-400 transition">Terms of Use</Link></li>
              <li><a href="/sitemap.xml" className="hover:text-amber-400 transition">Sitemap (XML)</a></li>
              <li><a href="/api/rss" className="hover:text-amber-400 transition">RSS News Feed</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3 text-xs">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Editorial Desk
            </h3>
            <div className="flex items-start gap-2 text-slate-400">
              <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <span>Harare & Bulawayo, Zimbabwe</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Mail className="w-4 h-4 text-brand-400 shrink-0" />
              <span>editor@disabilitydigest.org</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Phone className="w-4 h-4 text-brand-400 shrink-0" />
              <span>+263 (0) 242 700000</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Disability Digest. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with accessible design & care for Zimbabwe & Southern Africa.
          </p>
        </div>
      </div>
    </footer>
  )
}
