'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { MessageSquare, Send, Facebook, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react'

interface CommentSectionProps {
  articleId: string
}

export function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?articleId=${articleId}`)
      if (res.ok) {
        const data = await res.json()
        setComments(data.comments || [])
      }
    } catch (error) {}
  }

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setCurrentUser(data.user)
      }
    } catch (error) {}
  }

  useEffect(() => {
    fetchComments()
    fetchUser()
  }, [articleId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    setIsSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, body: commentText }),
      })

      const data = await res.json()
      if (res.ok) {
        setMessage({ type: 'success', text: 'Thank you! Your comment has been submitted.' })
        setCommentText('')
        fetchComments()
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to submit comment.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error submitting comment.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFacebookLogin = async () => {
    window.location.href = `/api/auth/facebook?redirect=/article/${articleId}`
  }

  return (
    <section className="bg-white rounded-2xl shadow border border-slate-200 p-6 md:p-8 space-y-6" aria-labelledby="comments-heading">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h2 id="comments-heading" className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand-700" />
          <span>Reader Comments ({comments.length})</span>
        </h2>
      </div>

      {/* Submission Form / Auth Call to action */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 p-4 md:p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Commenting as <span className="text-brand-700">{currentUser.name}</span> ({currentUser.email || 'Facebook Account'})
            </span>
          </div>

          <textarea
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your perspective or experience..."
            required
            className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-700"
            aria-label="Write a comment"
          ></textarea>

          {message && (
            <div
              className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{message.text}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-lg shadow flex items-center gap-2 transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center space-y-4">
          <p className="text-sm text-slate-700 font-medium">
            Join the conversation! Please sign in or create an account to post comments.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleFacebookLogin}
              className="px-4 py-2 bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold text-xs rounded-lg shadow flex items-center gap-2 transition"
            >
              <Facebook className="w-4 h-4 fill-white" />
              <span>Continue with Facebook</span>
            </button>
            <Link
              href={`/login?redirect=/article/${articleId}`}
              className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-lg shadow transition"
            >
              Sign In with Email
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-lg transition"
            >
              Register Account
            </Link>
          </div>
        </div>
      )}

      {/* List of Comments */}
      <div className="space-y-4 divide-y divide-slate-100">
        {comments.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-4">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="pt-4 first:pt-0 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{comment.user.name}</span>
                  {comment.user.facebookId && (
                    <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                      <Facebook className="w-2.5 h-2.5" /> FB Verified
                    </span>
                  )}
                </div>
                <span className="text-slate-400">
                  {new Date(comment.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{comment.body}</p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
