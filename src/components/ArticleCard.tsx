import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, Tag, ArrowRight } from 'lucide-react'

interface ArticleCardProps {
  article: {
    id: string
    title: string
    slug: string
    excerpt: string
    featuredImageUrl?: string | null
    featuredImageAlt?: string | null
    publishedAt?: string | Date | null
    author?: { name: string } | null
    categories?: Array<{ category: { name: string; slug: string } }>
  }
  featured?: boolean
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Draft'

  const mainCategory = article.categories?.[0]?.category

  if (featured) {
    return (
      <article className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12 hover:shadow-lg transition group">
        <div className="md:col-span-5 relative h-48 md:h-60 bg-slate-800 overflow-hidden">
          {article.featuredImageUrl ? (
            <img
              src={article.featuredImageUrl}
              alt={article.featuredImageAlt || article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-brand-800 text-white font-bold text-sm">
              Disability Digest Feature
            </div>
          )}
          {mainCategory && (
            <span className="absolute top-3 left-3 bg-brand-700 text-white font-bold text-[11px] uppercase px-2.5 py-0.5 rounded-md shadow tracking-wider">
              {mainCategory.name}
            </span>
          )}
        </div>

        <div className="md:col-span-7 p-5 md:p-6 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-brand-700" />
                {publishedDate}
              </span>
              {article.author && (
                <span className="flex items-center gap-1 font-medium">
                  <User className="w-3.5 h-3.5 text-brand-700" />
                  {article.author.name}
                </span>
              )}
            </div>

            <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-snug group-hover:text-brand-700 transition">
              <Link href={`/article/${article.slug}`} className="focus:outline-none focus:underline">
                {article.title}
              </Link>
            </h2>

            <p className="text-slate-600 text-xs md:text-sm leading-relaxed line-clamp-2">
              {article.excerpt}
            </p>
          </div>

          <Link
            href={`/article/${article.slug}`}
            className="inline-flex items-center gap-1.5 font-bold text-xs text-brand-700 hover:text-brand-900 group/btn pt-1"
          >
            <span>Read Full Story</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition" />
          </Link>
        </div>
      </article>
    )
  }

  return (
    <article className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden hover:shadow-lg transition flex flex-col group h-full">
      <div className="relative h-48 bg-slate-800 overflow-hidden">
        {article.featuredImageUrl ? (
          <img
            src={article.featuredImageUrl}
            alt={article.featuredImageAlt || article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-800 text-brand-200 text-sm font-semibold">
            Disability Digest
          </div>
        )}
        {mainCategory && (
          <span className="absolute top-3 left-3 bg-brand-700 text-white font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-md shadow tracking-wider">
            {mainCategory.name}
          </span>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-brand-700" />
              {publishedDate}
            </span>
            {article.author && <span>{article.author.name}</span>}
          </div>

          <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-brand-700 transition">
            <Link href={`/article/${article.slug}`} className="focus:outline-none focus:underline">
              {article.title}
            </Link>
          </h3>

          <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <Link
            href={`/article/${article.slug}`}
            className="text-xs font-bold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1"
          >
            <span>Read Article</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  )
}
