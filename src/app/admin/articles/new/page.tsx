'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Send, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react'

export default function NewArticlePage() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [featuredImageUrl, setFeaturedImageUrl] = useState('')
  const [featuredImageAlt, setFeaturedImageAlt] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [status, setStatus] = useState('PUBLISHED')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories)
          if (data.categories.length > 0) {
            setSelectedCategory(data.categories[0].id)
          }
        }
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !content) {
      setError('Title and content are required')
      return
    }

    if (featuredImageUrl && !featuredImageAlt.trim()) {
      setError('WCAG compliance requires ALT text description for featured images')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          featuredImageUrl,
          featuredImageAlt,
          status,
          categoryIds: selectedCategory ? [selectedCategory] : [],
        }),
      })

      const data = await res.json()
      if (res.ok) {
        router.push('/admin/articles')
      } else {
        setError(data.error || 'Failed to create article')
      }
    } catch (err) {
      setError('Connection error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900">Create & Publish Article</h1>
        <p className="text-xs text-slate-500">Publish news, policy updates, or community stories</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Article Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
            placeholder="e.g. Zimbabwe Passes Updated Public Building Accessibility Standards"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Primary Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-700"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Publishing Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-700"
            >
              <option value="PUBLISHED">Published Immediately</option>
              <option value="DRAFT">Save as Draft</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Short Excerpt / Summary</label>
          <textarea
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
            placeholder="Brief 1-2 sentence summary for search and homepage previews..."
          />
        </div>

        {/* Featured Image URL & ALT text */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-brand-700" />
            <span>Featured Image & WCAG Accessibility Alt Text</span>
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Image URL</label>
              <input
                type="url"
                value={featuredImageUrl}
                onChange={(e) => setFeaturedImageUrl(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs"
                placeholder="https://images.unsplash.com/photo-..."
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Image Alt Text (Required for WCAG 2.1 AA)
              </label>
              <input
                type="text"
                value={featuredImageAlt}
                onChange={(e) => setFeaturedImageAlt(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs"
                placeholder="Descriptive text for screen readers..."
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Article Body Content (HTML / Text) *</label>
          <textarea
            rows={12}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
            placeholder="<p>Write your article paragraphs here...</p>"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2 transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : 'Save & Publish'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
