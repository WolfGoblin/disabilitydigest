'use client'

import React, { useState, useEffect } from 'react'
import { MessageSquare, Check, X, ShieldAlert, Trash2 } from 'lucide-react'

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<any[]>([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?status=${filter}`)
      if (res.ok) {
        const data = await res.json()
        setComments(data.comments || [])
      }
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [filter])

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) fetchComments()
    } catch (err) {}
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this comment?')) return
    try {
      const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' })
      if (res.ok) fetchComments()
    } catch (err) {}
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Comment Moderation Center</h1>
          <p className="text-xs text-slate-500">Review, approve, reject, or flag reader comments for spam</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          {['ALL', 'APPROVED', 'PENDING', 'REJECTED', 'SPAM'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition ${
                filter === st ? 'bg-brand-700 text-white shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-xs text-slate-500">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs">
          No comments found for status filter "{filter}".
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{comment.user?.name}</span>
                  <span className="text-slate-400">({comment.user?.email || 'Facebook Account'})</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      comment.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : comment.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {comment.status}
                  </span>
                </div>
                <span className="text-slate-400">
                  {new Date(comment.createdAt).toLocaleString('en-GB')}
                </span>
              </div>

              <div className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 font-sans">
                {comment.body}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500 font-medium">
                  On article: <span className="font-bold text-slate-700">{comment.article?.title}</span>
                </span>

                <div className="flex items-center gap-2">
                  {comment.status !== 'APPROVED' && (
                    <button
                      onClick={() => handleStatusUpdate(comment.id, 'APPROVED')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[11px] flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Approve
                    </button>
                  )}
                  {comment.status !== 'REJECTED' && (
                    <button
                      onClick={() => handleStatusUpdate(comment.id, 'REJECTED')}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-[11px] flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> Reject
                    </button>
                  )}
                  {comment.status !== 'SPAM' && (
                    <button
                      onClick={() => handleStatusUpdate(comment.id, 'SPAM')}
                      className="px-2.5 py-1 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded text-[11px] flex items-center gap-1"
                    >
                      <ShieldAlert className="w-3 h-3" /> Flag Spam
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-1 text-rose-600 hover:bg-rose-100 rounded"
                    title="Delete Comment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
