import React from 'react'
import { db } from '@/lib/db'
import { ArticleCard } from '@/components/ArticleCard'
import { Search } from 'lucide-react'

export const revalidate = 0

interface SearchPageProps {
  searchParams: { q?: string }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''

  const articles = query
    ? await db.article.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: query } },
            { excerpt: { contains: query } },
            { body: { contains: query } },
          ],
        },
        orderBy: { publishedAt: 'desc' },
        include: {
          author: { select: { name: true } },
          categories: { include: { category: true } },
        },
      })
    : []

  return (
    <div className="space-y-8">
      <header className="bg-white p-6 md:p-8 rounded-2xl shadow border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
          <Search className="w-4 h-4" />
          <span>Site Search</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900">
          {query ? `Search Results for "${query}"` : 'Search Disability Digest'}
        </h1>

        <form action="/search" method="GET" className="max-w-xl">
          <div className="relative">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search by keywords, title, or topic..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-700"
              aria-label="Search articles"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
          </div>
        </form>
      </header>

      {query && (
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
            Found {articles.length} result(s)
          </p>

          {articles.length === 0 ? (
            <div className="bg-white p-12 rounded-xl text-center border border-slate-200 text-slate-500">
              No matching articles found. Try searching for broader terms like "rights", "policy", or "accessibility".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
