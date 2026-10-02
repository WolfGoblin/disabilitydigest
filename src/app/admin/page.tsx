import React from 'react'
import Link from 'next/link'
import { db } from '@/lib/db'
import { FileText, MessageSquare, Users, Image as ImageIcon, Plus, ArrowRight, ShieldCheck } from 'lucide-react'

export const revalidate = 0

export default async function AdminDashboardPage() {
  const [totalArticles, publishedArticles, pendingComments, totalUsers] = await Promise.all([
    db.article.count(),
    db.article.count({ where: { status: 'PUBLISHED' } }),
    db.comment.count({ where: { status: 'PENDING' } }),
    db.user.count(),
  ])

  const recentArticles = await db.article.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { name: true } } },
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Dashboard Overview</h1>
          <p className="text-xs text-slate-500">Welcome to Disability Digest editorial management desk</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2 transition w-fit"
        >
          <Plus className="w-4 h-4" /> Write Article
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Total Articles</span>
            <FileText className="w-5 h-5 text-brand-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalArticles}</div>
          <div className="text-[11px] text-slate-500">{publishedArticles} Published</div>
        </div>

        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Pending Comments</span>
            <MessageSquare className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{pendingComments}</div>
          <div className="text-[11px] text-slate-500">Awaiting Moderation</div>
        </div>

        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Registered Readers</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalUsers}</div>
          <div className="text-[11px] text-slate-500">Readers & Editors</div>
        </div>

        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Accessibility Status</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">WCAG AA</div>
          <div className="text-[11px] text-slate-500">All checks active</div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="text-base font-bold text-slate-900">Recently Created Articles</h2>
          <Link href="/admin/articles" className="text-xs font-bold text-brand-700 flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Author</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentArticles.map((art) => (
                <tr key={art.id} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">{art.title}</td>
                  <td className="p-3 text-slate-600">{art.author.name}</td>
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
                    {new Date(art.createdAt).toLocaleDateString('en-GB')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
