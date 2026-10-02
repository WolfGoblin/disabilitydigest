'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  MessageSquare,
  Users,
  Image as ImageIcon,
  Globe,
  LogOut,
  Shield,
  AlertCircle,
} from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setCurrentUser(data.user)
      })
      .finally(() => setLoading(false))
  }, [])

  const navItems = [
    { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'All Articles', href: '/admin/articles', icon: FileText },
    { name: 'Write New Article', href: '/admin/articles/new', icon: PlusCircle },
    { name: 'Comment Moderation', href: '/admin/comments', icon: MessageSquare },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
  ]

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500 font-medium text-sm">
        Verifying admin session credentials...
      </div>
    )
  }

  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'EDITOR')) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-center space-y-4">
        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Admin Access Required</h1>
        <p className="text-xs text-slate-600">
          You must be logged in as an authorized Editor or Admin to access the editorial management panel.
        </p>
        <Link
          href="/login?redirect=/admin"
          className="inline-block px-5 py-2.5 bg-brand-700 text-white font-bold text-xs rounded-xl shadow hover:bg-brand-800 transition"
        >
          Sign In to Admin Panel
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[70vh]">
      {/* Sidebar */}
      <aside className="md:col-span-3 bg-white p-5 rounded-2xl shadow border border-slate-200 space-y-6 h-fit">
        <div className="border-b border-slate-100 pb-4 space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" />
            <h2 className="font-black text-slate-900 text-base uppercase font-sans">
              EDITORIAL <span className="text-brand-700">PANEL</span>
            </h2>
          </div>
          <div className="text-xs text-slate-500">
            Logged in as <span className="font-bold text-slate-800">{currentUser.name}</span> ({currentUser.role})
          </div>
        </div>

        <nav className="space-y-1" aria-label="Admin Navigation">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-brand-700 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-slate-100 pt-4 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-brand-700 transition"
          >
            <Globe className="w-4 h-4" />
            <span>Return to Public Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="md:col-span-9 bg-white p-6 md:p-8 rounded-2xl shadow border border-slate-200">
        {children}
      </section>
    </div>
  )
}
