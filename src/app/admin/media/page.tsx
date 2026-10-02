'use client'

import React, { useState, useEffect } from 'react'
import { Image as ImageIcon, Upload, Check, AlertCircle, Copy } from 'lucide-react'

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState<any[]>([])
  const [url, setUrl] = useState('')
  const [altText, setAltText] = useState('')
  const [filename, setFilename] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media')
      if (res.ok) {
        const data = await res.json()
        setMediaItems(data.media || [])
      }
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url || !altText.trim()) {
      setMessage({ type: 'error', text: 'Image URL and WCAG Alt Text are required.' })
      return
    }

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, altText, filename: filename || 'media-asset.jpg' }),
      })

      const data = await res.json()
      if (res.ok) {
        setMessage({ type: 'success', text: 'Media asset registered successfully!' })
        setUrl('')
        setAltText('')
        setFilename('')
        fetchMedia()
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to upload media' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Connection error' })
    }
  }

  const copyUrl = (mediaUrl: string) => {
    navigator.clipboard.writeText(mediaUrl)
    alert('Media URL copied to clipboard!')
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900">Media Library</h1>
        <p className="text-xs text-slate-500">Manage uploaded images with WCAG 2.1 AA Alt Text enforcement</p>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Upload className="w-4 h-4 text-brand-700" /> Register New Media Asset
        </h2>

        {message && (
          <div
            className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {message.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Image URL *</label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              WCAG Alt Text (Mandatory) *
            </label>
            <input
              type="text"
              required
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Detailed description for screen readers..."
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Filename / Label</label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="accessibility-ramp.jpg"
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2 transition"
        >
          <Upload className="w-4 h-4" /> Save Media Asset
        </button>
      </form>

      {/* Grid of Media */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900">Existing Media Assets ({mediaItems.length})</h2>

        {loading ? (
          <div className="text-xs text-slate-500 text-center py-6">Loading media gallery...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {mediaItems.map((m) => (
              <div key={m.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="h-36 bg-slate-100 overflow-hidden relative">
                  <img src={m.url} alt={m.altText} className="w-full h-full object-cover" />
                </div>
                <div className="p-3 space-y-2">
                  <p className="text-xs font-bold text-slate-900 truncate">{m.filename}</p>
                  <p className="text-[11px] text-slate-500 italic line-clamp-2">Alt: {m.altText}</p>
                  <button
                    onClick={() => copyUrl(m.url)}
                    className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] rounded flex items-center justify-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy Image URL
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
