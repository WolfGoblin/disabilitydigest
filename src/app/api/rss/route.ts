import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const articles = await db.article.findMany({
    where: { status: 'PUBLISHED' },
    take: 20,
    orderBy: { publishedAt: 'desc' },
    include: { author: { select: { name: true } } },
  })

  const baseUrl = 'https://disabilitydigest.org'

  const rssItemsXml = articles
    .map((art) => `
    <item>
      <title><![CDATA[${art.title}]]></title>
      <link>${baseUrl}/article/${art.slug}</link>
      <guid>${baseUrl}/article/${art.slug}</guid>
      <pubDate>${art.publishedAt ? new Date(art.publishedAt).toUTCString() : new Date().toUTCString()}</pubDate>
      <description><![CDATA[${art.excerpt}]]></description>
      <author><![CDATA[${art.author.name}]]></author>
    </item>`)
    .join('')

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Disability Digest — Zimbabwe &amp; Pan-African News</title>
    <link>${baseUrl}</link>
    <description>Disability rights, policy, health, education, and accessibility news platform</description>
    <language>en</language>
    ${rssItemsXml}
  </channel>
</rss>`

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
