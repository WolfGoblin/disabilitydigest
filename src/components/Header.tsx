'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Menu, X, User, Shield, LogOut, FileText } from 'lucide-react'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user)
      })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    window.location.href = '/'
  }

  const navCategories = [
    { name: 'Policy & Rights', href: '/category/policy' },
    { name: 'Health & Rehab', href: '/category/health' },
    { name: 'Education', href: '/category/education' },
    { name: 'Accessibility & Tech', href: '/category/accessibility' },
    { name: 'Opinion', href: '/category/opinion' },
    { name: 'Regional News', href: '/category/regional-news' },
  ]

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      {/* Brand & Main White Top Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Official Big & Clear Image Logo */}
          <Link href="/" className="flex items-center group focus:outline-none focus:ring-2 focus:ring-brand-700 rounded-lg p-0.5">
            <img
              src="/logo.png"
              alt="Disability Digest Logo"
              className="h-14 sm:h-16 md:h-20 lg:h-22 w-auto max-w-[280px] sm:max-w-[360px] md:max-w-[440px] object-contain group-hover:scale-105 transition duration-300"
            />
          </Link>

          {/* Search Bar - High Contrast Desktop */}
          <form
            action="/search"
            method="GET"
            className="hidden md:flex items-center flex-1 max-w-md mx-4"
            role="search"
          >
            <div className="relative w-full">
              <input
                type="search"
                name="q"
                placeholder="Search news, rights, policies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 text-slate-900 placeholder-slate-500 rounded-full text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:bg-white"
                aria-label="Search articles"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5 pointer-events-none" />
            </div>
          </form>

          {/* Actions / Auth */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'ADMIN' || user.role === 'EDITOR' ? (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-slate-950 font-bold rounded-lg text-xs hover:bg-amber-300 transition shadow"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Panel</span>
                  </Link>
                ) : null}
                <div className="hidden sm:flex flex-col text-right text-xs">
                  <span className="font-bold text-slate-900 leading-tight">{user.name}</span>
                  <span className="text-[10px] text-brand-700 font-bold uppercase tracking-wider">{user.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1"
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs font-bold text-brand-700 hover:text-brand-900 hover:bg-slate-100 rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-lg shadow transition"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Primary Category Navigation Bar */}
      <nav aria-label="Primary category navigation" className="bg-brand-800 border-t border-brand-600/50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1 overflow-x-auto py-1">
          <Link
            href="/"
            className="px-3 py-2 text-xs font-semibold text-brand-100 hover:text-white hover:bg-brand-700/60 rounded-md transition"
          >
            Home
          </Link>
          {navCategories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="px-3 py-2 text-xs font-semibold text-brand-100 hover:text-white hover:bg-brand-700/60 rounded-md transition whitespace-nowrap"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/about"
            className="px-3 py-2 text-xs font-semibold text-amber-300 hover:text-white hover:bg-brand-700/60 rounded-md transition ml-auto"
          >
            About Us
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-900 border-t border-brand-700 px-4 pt-3 pb-6 space-y-3">
          <form action="/search" method="GET" className="mb-4">
            <div className="relative">
              <input
                type="search"
                name="q"
                placeholder="Search news & policies..."
                className="w-full pl-10 pr-4 py-2 bg-brand-800 text-white rounded-lg text-sm border border-brand-700"
              />
              <Search className="w-4 h-4 text-brand-300 absolute left-3 top-3" />
            </div>
          </form>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-brand-400 tracking-wider block px-2">Categories</span>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-brand-800"
            >
              Home
            </Link>
            {navCategories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-brand-800"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-brand-800 pt-3 space-y-1">
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-brand-200">
              About Us
            </Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-brand-200">
              Contact Us
            </Link>
            <Link href="/privacy" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-brand-200">
              Privacy Policy
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
