'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Facebook, LogIn, AlertCircle } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (res.ok) {
        if (data.user.role === 'ADMIN' || data.user.role === 'EDITOR') {
          window.location.href = '/admin'
        } else {
          window.location.href = redirect
        }
      } else {
        setError(data.error || 'Invalid credentials')
      }
    } catch (err) {
      setError('Connection error')
    } finally {
      setLoading(false)
    }
  }

  const handleFacebookLogin = () => {
    window.location.href = `/api/auth/facebook?redirect=${encodeURIComponent(redirect)}`
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Facebook Login Button */}
      <button
        onClick={handleFacebookLogin}
        type="button"
        className="w-full py-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 transition"
      >
        <Facebook className="w-4 h-4 fill-white" />
        <span>Continue with Facebook</span>
      </button>

      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink mx-4 text-[11px] text-slate-400 font-bold uppercase">Or email sign in</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
            placeholder="reader@disabilitydigest.org"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 transition disabled:opacity-50"
        >
          <LogIn className="w-4 h-4" />
          <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
        </button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto my-8 bg-white p-8 rounded-2xl shadow-lg border border-slate-200 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-slate-900">Sign In to Disability Digest</h1>
        <p className="text-xs text-slate-500">Access your reader profile and post comments</p>
      </div>

      <Suspense fallback={<div className="text-xs text-center py-4 text-slate-500">Loading form...</div>}>
        <LoginForm />
      </Suspense>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
        Don't have an account?{' '}
        <Link href="/register" className="font-bold text-brand-700 hover:underline">
          Register Here
        </Link>
      </div>
    </div>
  )
}
