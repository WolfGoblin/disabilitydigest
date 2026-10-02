'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, Plus, Trash2, Edit, ExternalLink } from 'lucide-react'

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles?status=ALL')
      if (res.ok) {
        const data = await res.json()
        setArticles(data.articles || [])
      }
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return

    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchArticles()
      } else {
        alert('Failed to delete article')
      }
    } catch (err) {
      alert('Error deleting article')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Manage Articles</h1>
          <p className="text-xs text-slate-500">Create, edit, or publish news and policy articles</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" /> Write Article
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8 text-xs text-slate-500">Loading articles list...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs">
          No articles created yet. Click "Write Article" to publish your first story.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Author</th>
                <th className="p-3">Category</th>
                <th className="p-3">Status</th>
                <th className="p-3">Published</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900 max-w-xs truncate">{art.title}</td>
                  <td className="p-3 text-slate-600">{art.author?.name || 'Unknown'}</td>
                  <td className="p-3 text-slate-600">
                    {art.categories?.[0]?.category?.name || 'Uncategorized'}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        art.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {art.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">
                    {art.publishedAt ? new Date(art.publishedAt).toLocaleDateString('en-GB') : '—'}
                  </td>
                  <td className="p-3 text-right space-x-2">
                    {art.status === 'PUBLISHED' && (
                      <Link
                        href={`/article/${art.slug}`}
                        target="_blank"
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 inline-block"
                        title="View Public Article"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    <button
                      onClick={() => handleDelete(art.id)}
                      className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded inline-block"
                      title="Delete Article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
