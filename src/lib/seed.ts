import { db } from './db'
import { hashPassword } from './auth'

export async function seedDatabase() {
  console.log('Seeding Disability Digest database...')

  // Clean existing data if any
  await db.comment.deleteMany()
  await db.articleCategory.deleteMany()
  await db.articleTag.deleteMany()
  await db.article.deleteMany()
  await db.category.deleteMany()
  await db.tag.deleteMany()
  await db.media.deleteMany()
  await db.user.deleteMany()

  // 1. Create Default Users
  const adminPassword = await hashPassword('Admin123!')
  const editorPassword = await hashPassword('Editor123!')
  const readerPassword = await hashPassword('Reader123!')

  const admin = await db.user.create({
    data: {
      name: 'Dr. Farai Moyo',
      email: 'admin@disabilitydigest.org',
      passwordHash: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
    },
  })

  const editor = await db.user.create({
    data: {
      name: 'Tinashe Chigumba',
      email: 'editor@disabilitydigest.org',
      passwordHash: editorPassword,
      role: 'EDITOR',
      status: 'ACTIVE',
      emailVerified: true,
    },
  })

  const reader = await db.user.create({
    data: {
      name: 'Grace Mutasa',
      email: 'reader@disabilitydigest.org',
      passwordHash: readerPassword,
      role: 'READER',
      status: 'ACTIVE',
      emailVerified: true,
    },
  })

  const fbReader = await db.user.create({
    data: {
      name: 'Tendai Sibanda',
      email: 'tendai.fb@example.com',
      facebookId: 'fb_1029384756',
      role: 'READER',
      status: 'ACTIVE',
      emailVerified: true,
    },
  })

  // 2. Create Categories
  const categoriesData = [
    { name: 'Policy & Rights', slug: 'policy', description: 'National and international disability legislation, treaties, and advocacy.' },
    { name: 'Health & Rehabilitation', slug: 'health', description: 'Healthcare access, medical assistive technology, and health equity.' },
    { name: 'Education & Training', slug: 'education', description: 'Inclusive education, sign language curriculum, and accessible schools.' },
    { name: 'Accessibility & Tech', slug: 'accessibility', description: 'Digital accessibility, built environment, transport, and assistive tech.' },
    { name: 'Opinion & Community', slug: 'opinion', description: 'Personal reflections, community stories, and advocacy viewpoints.' },
    { name: 'Regional News', slug: 'regional-news', description: 'Updates across Zimbabwe, SADC, and the African Union.' },
  ]

  const categories = {} as Record<string, any>
  for (const cat of categoriesData) {
    const created = await db.category.create({ data: cat })
    categories[cat.slug] = created
  }

  // 3. Create Tags
  const tagsData = ['Zimbabwe', 'WCAG', 'Sign Language', 'Wheelchair Access', 'Inclusion', 'SADC', 'AU Charter']
  const tags = {} as Record<string, any>
  for (const tagName of tagsData) {
    const slug = tagName.toLowerCase().replace(/ /g, '-')
    const created = await db.tag.create({ data: { name: tagName, slug } })
    tags[slug] = created
  }

  // 4. Create Articles
  const articlesData = [
    {
      title: 'Zimbabwe Parliament Pass Landmark Accessibility Standards for Public Infrastructure',
      slug: 'zimbabwe-parliament-landmark-accessibility-standards-2026',
      excerpt: 'New building guidelines mandate ramp inclines, tactile flooring, and audio lifts across all government and commercial spaces in Harare and Bulawayo.',
      body: `<p>The Parliament of Zimbabwe has officially enacted updated national building regulations ensuring full physical accessibility across urban and rural public infrastructure.</p>
<p>Architects and contractors will now be required by law to incorporate accessible ramps, elevators with tactile and voice prompt systems, accessible restrooms, and designated parking spaces for persons with disabilities.</p>
<blockquote class="border-l-4 border-brand-700 pl-4 italic text-slate-700 my-4">"Accessibility is not a privilege or an afterthought — it is a constitutional human right that empowers all citizens to participate equally in economic and civic life," said Senator Anna Shiri representing PWDs in Parliament.</blockquote>
<p>The Ministry of Public Works will begin enforcing compliance reviews across all newly approved building projects starting next month.</p>`,
      featuredImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
      featuredImageAlt: 'A modern accessible building entrance with a ramp and tactile paving',
      authorId: admin.id,
      categorySlugs: ['policy', 'accessibility'],
      tagSlugs: ['zimbabwe', 'wheelchair-access', 'inclusion'],
      publishedAt: new Date(),
    },
    {
      title: 'Expanding Inclusive Education: Inclusive Sign Language Curricula Introduced in Primary Schools',
      slug: 'expanding-inclusive-education-sign-language-primary-schools',
      excerpt: 'The Ministry of Primary and Secondary Education rolls out basic Zimbabwean Sign Language learning materials across 150 pilot schools.',
      body: `<p>In a major milestone for inclusive education, Zimbabwean Sign Language (ZSL) has officially been introduced as an elective language module in primary schools across the country.</p>
<p>Teachers across pilot districts in Manicaland and Mashonaland have undergone specialized training alongside deaf education specialists. The initiative aims to break down communication barriers from an early age and foster empathy among young learners.</p>
<p>Community advocates have praised the step as essential for fulfilling the 2013 Constitution, which recognizes Sign Language as one of Zimbabwe's 16 official languages.</p>`,
      featuredImageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
      featuredImageAlt: 'Students learning together in a classroom environment',
      authorId: editor.id,
      categorySlugs: ['education', 'regional-news'],
      tagSlugs: ['zimbabwe', 'sign-language', 'inclusion'],
      publishedAt: new Date(Date.now() - 3600000 * 24),
    },
    {
      title: 'Digital Accessibility in Africa: Why Web Developers Must Prioritize WCAG 2.1 Compliance',
      slug: 'digital-accessibility-in-africa-wcag-compliance-guide',
      excerpt: 'As mobile banking and government e-services expand across Africa, ensuring screen-reader and low-bandwidth compatibility is crucial.',
      body: `<p>With digital services rapidly transforming commerce, healthcare, and education across Africa, digital inclusion must remain at the forefront of software engineering.</p>
<p>Screen readers, keyboard navigation, high color contrast, and lightweight pages enable citizens with visual, motor, or cognitive impairments to access critical services effortlessly.</p>
<p>Adopting WCAG 2.1 AA standards ensures websites operate efficiently even under variable 3G network conditions while keeping platforms open to all users.</p>`,
      featuredImageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
      featuredImageAlt: 'Software developer working on computer screens showing web code',
      authorId: admin.id,
      categorySlugs: ['accessibility', 'health'],
      tagSlugs: ['wcag', 'sadc', 'au-charter'],
      publishedAt: new Date(Date.now() - 3600000 * 48),
    },
    {
      title: 'Community Empowerment: Disability Rights Organizations Convene Pan-African Summit in Harare',
      slug: 'pan-african-disability-rights-summit-harare-2026',
      excerpt: 'Delegates from 14 African nations gather to harmonize implementation of the African Disability Protocol.',
      body: `<p>Advocates, policymakers, and community leaders from across the African continent assembled in Harare for the annual Pan-African Disability Rights Summit.</p>
<p>Key discussions centered around economic inclusion, accessible public transport, micro-finance opportunities for entrepreneurs with disabilities, and regional treaty ratification.</p>`,
      featuredImageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      featuredImageAlt: 'Conference hall with diverse delegates seated at round tables',
      authorId: editor.id,
      categorySlugs: ['opinion', 'regional-news'],
      tagSlugs: ['sadc', 'au-charter', 'zimbabwe'],
      publishedAt: new Date(Date.now() - 3600000 * 72),
    },
  ]

  for (const artData of articlesData) {
    const article = await db.article.create({
      data: {
        title: artData.title,
        slug: artData.slug,
        excerpt: artData.excerpt,
        body: artData.body,
        featuredImageUrl: artData.featuredImageUrl,
        featuredImageAlt: artData.featuredImageAlt,
        status: 'PUBLISHED',
        publishedAt: artData.publishedAt,
        authorId: artData.authorId,
        metaTitle: `${artData.title} | Disability Digest`,
        metaDescription: artData.excerpt,
      },
    })

    // Connect Categories
    for (const catSlug of artData.categorySlugs) {
      if (categories[catSlug]) {
        await db.articleCategory.create({
          data: {
            articleId: article.id,
            categoryId: categories[catSlug].id,
          },
        })
      }
    }

    // Connect Tags
    for (const tagSlug of artData.tagSlugs) {
      if (tags[tagSlug]) {
        await db.articleTag.create({
          data: {
            articleId: article.id,
            tagId: tags[tagSlug].id,
          },
        })
      }
    }

    // Create Initial Comments
    await db.comment.create({
      data: {
        articleId: article.id,
        userId: reader.id,
        body: 'This is a tremendous step forward for accessibility in Zimbabwe. Thank you for covering this vital update!',
        status: 'APPROVED',
      },
    })

    await db.comment.create({
      data: {
        articleId: article.id,
        userId: fbReader.id,
        body: 'Very insightful reporting. I hope to see these standards actively enforced in all municipal tenders.',
        status: 'APPROVED',
      },
    })
  }

  console.log('Database seeded successfully!')
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seeding failed:', err)
      process.exit(1)
    })
}
