import React from 'react'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { ArticleCard } from '@/components/ArticleCard'
import { Layers } from 'lucide-react'

export const revalidate = 0

interface CategoryPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await db.category.findUnique({
    where: { slug: params.slug },
  })

  if (!category) return { title: 'Category Not Found | Disability Digest' }

  return {
    title: `${category.name} | Disability Digest`,
    description: category.description || `Articles in ${category.name}`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await db.category.findUnique({
    where: { slug: params.slug },
  })

  if (!category) notFound()

  const articles = await db.article.findMany({
    where: {
      status: 'PUBLISHED',
      categories: {
        some: {
          category: {
            slug: params.slug,
          },
        },
      },
    },
    orderBy: { publishedAt: 'desc' },
    include: {
      author: { select: { name: true } },
      categories: { include: { category: true } },
    },
  })

  return (
    <div className="space-y-8">
      <header className="bg-white p-6 md:p-8 rounded-2xl shadow border border-slate-200 space-y-2">
        <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Category Archive</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">{category.name}</h1>
        {category.description && <p className="text-sm text-slate-600">{category.description}</p>}
      </header>

      {articles.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center border border-slate-200 text-slate-500">
          No articles published in this category yet. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
