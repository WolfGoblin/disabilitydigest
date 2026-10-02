import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { CommentSection } from '@/components/CommentSection'
import { Calendar, User, Tag, Share2, Facebook, Twitter, Mail, Copy } from 'lucide-react'

export const revalidate = 0

interface ArticlePageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const article = await db.article.findUnique({
    where: { slug: params.slug },
  })

  if (!article) return { title: 'Article Not Found | Disability Digest' }

  return {
    title: `${article.title} | Disability Digest`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.featuredImageUrl ? [article.featuredImageUrl] : [],
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await db.article.findUnique({
    where: { slug: params.slug },
    include: {
      author: { select: { id: true, name: true, email: true } },
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
  })

  if (!article || article.status !== 'PUBLISHED') {
    notFound()
  }

  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Draft'

  return (
    <article className="max-w-4xl mx-auto space-y-8">
      {/* Header Info */}
      <header className="space-y-4">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2">
          {article.categories.map((c) => (
            <Link
              key={c.category.id}
              href={`/category/${c.category.slug}`}
              className="bg-brand-700 text-white font-bold text-xs uppercase px-3 py-1 rounded-md hover:bg-brand-800 transition"
            >
              {c.category.name}
            </Link>
          ))}
        </div>

        <h1 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
          {article.title}
        </h1>

        <p className="text-slate-600 text-base md:text-lg font-medium leading-relaxed border-l-4 border-amber-400 pl-4 bg-slate-100/60 py-2 rounded-r-lg">
          {article.excerpt}
        </p>

        {/* Metadata bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-200 py-3 text-xs text-slate-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-semibold">
              <User className="w-4 h-4 text-brand-700" />
              <span>By {article.author.name}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand-700" />
              <span>{publishedDate}</span>
            </span>
          </div>

          {/* Social Shares */}
          <div className="flex items-center gap-2" aria-label="Share article">
            <span className="font-bold text-slate-500 uppercase text-[10px]">Share:</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://disabilitydigest.org/article/${article.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              aria-label="Share on Facebook"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://disabilitydigest.org/article/${article.slug}`)}&text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-sky-500 text-white rounded hover:bg-sky-600 transition"
              aria-label="Share on X (Twitter)"
            >
              <Twitter className="w-3.5 h-3.5" />
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`Check out this article on Disability Digest: https://disabilitydigest.org/article/${article.slug}`)}`}
              className="p-1.5 bg-slate-700 text-white rounded hover:bg-slate-800 transition"
              aria-label="Share via email"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {article.featuredImageUrl && (
        <figure className="space-y-2">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 max-h-[450px]">
            <img
              src={article.featuredImageUrl}
              alt={article.featuredImageAlt || article.title}
              className="w-full h-full object-cover"
            />
          </div>
          {article.featuredImageAlt && (
            <figcaption className="text-xs text-slate-500 text-center italic">
              Alt text description: {article.featuredImageAlt}
            </figcaption>
          )}
        </figure>
      )}

      {/* Body Content */}
      <div
        className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-800 prose-p:leading-relaxed prose-p:text-base md:prose-p:text-lg"
        dangerouslySetInnerHTML={{ __html: article.body }}
      />

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4">
          <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> Tags:
          </span>
          {article.tags.map((t) => (
            <span key={t.tag.id} className="bg-slate-200 text-slate-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
              #{t.tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Comments Section */}
      <CommentSection articleId={article.id} />
    </article>
  )
}
