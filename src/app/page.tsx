import React from 'react'
import Link from 'next/link'
import { db } from '@/lib/db'
import { ArticleCard } from '@/components/ArticleCard'
import { NewsletterSubscribe } from '@/components/NewsletterSubscribe'
import { ArrowRight, Newspaper, Layers, ShieldCheck, HeartHandshake, Volume2 } from 'lucide-react'

export const revalidate = 0

export default async function HomePage() {
  const articles = await db.article.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    take: 7,
    include: {
      author: { select: { name: true } },
      categories: { include: { category: true } },
    },
  })

  const featuredArticle = articles[0]
  const recentArticles = articles.slice(1)

  const categories = await db.category.findMany({
    take: 6,
    include: {
      _count: { select: { articles: true } },
    },
  })

  return (
    <div className="space-y-12">
      {/* Welcome Banner */}
      <section className="bg-gradient-to-r from-brand-900 via-brand-700 to-brand-800 text-white rounded-2xl p-5 md:p-8 shadow-lg border border-brand-600 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-bold text-[11px] uppercase px-2.5 py-0.5 rounded-full shadow">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Inclusive News & Rights Journalism</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight uppercase font-sans">
            Amplifying Disability Rights Across Zimbabwe & Globally
          </h1>
          <p className="text-brand-100 text-xs md:text-sm leading-relaxed">
            Disability Digest publishes independent reporting, policy analysis, accessibility developments, and community reflections for persons with disabilities.
          </p>
        </div>
      </section>

      {/* Featured Story */}
      {featuredArticle && (
        <section aria-labelledby="featured-heading" className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 id="featured-heading" className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <Newspaper className="w-5 h-5 text-brand-700" />
              <span>Top Headline</span>
            </h2>
          </div>
          <ArticleCard article={featuredArticle} featured={true} />
        </section>
      )}

      {/* Category Grid Section */}
      <section aria-labelledby="categories-heading" className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 id="categories-heading" className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
            <Layers className="w-5 h-5 text-brand-700" />
            <span>Explore Coverage Areas</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-600 transition flex flex-col justify-between group"
            >
              <div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-700 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cat.description}</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-brand-700 font-bold border-t border-slate-100 pt-3">
                <span>{cat._count.articles} Articles</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Stories Grid */}
      <section aria-labelledby="recent-heading" className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 id="recent-heading" className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
            <Newspaper className="w-5 h-5 text-brand-700" />
            <span>Latest News & Updates</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Newsletter Subscription Banner */}
      <NewsletterSubscribe />
    </div>
  )
}
