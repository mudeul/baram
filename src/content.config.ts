import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const postSchema = z.object({
  title: z.string().optional().default('제목 없음'),
  description: z.string().optional(),
  pubDate: z.coerce.date().optional(),
  image: z.string().optional(),
  cover: z.string().optional(),
  tech: z.union([z.string(), z.array(z.string())]).optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
  pinned: z.boolean().optional(),
  pin: z.boolean().optional(),
  draft: z.boolean().optional()
})

const about = defineCollection({
  loader: glob({ base: './src/content/about', pattern: '**/*.md' }),
  schema: z.object({})
})

// 👉 posts 컬렉션 정의를 다시 추가해 줍니다!
const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: postSchema
})

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: postSchema
})

const bodong = defineCollection({
  loader: glob({ base: './src/content/bodong', pattern: '**/*.{md,mdx}' }),
  schema: postSchema
})

const bookmarks = defineCollection({
  loader: glob({ base: './src/content/bookmarks', pattern: '**/*.{md,mdx}' }),
  schema: postSchema
})

const conch = defineCollection({
  loader: glob({ base: './src/content/conch', pattern: '**/*.{md,mdx}' }),
  schema: postSchema
})

const dreams = defineCollection({
  loader: glob({ base: './src/content/dreams', pattern: '**/*.{md,mdx}' }),
  schema: postSchema
})

const scribble = defineCollection({
  loader: glob({ base: './src/content/scribble', pattern: '**/*.{md,mdx}' }),
  schema: postSchema
})

const windAlly = defineCollection({
  loader: glob({ base: './src/content/wind-ally', pattern: '**/*.{md,mdx}' }),
  schema: postSchema
})

export const collections = {
  about,
  posts, // 👉 여기에 posts를 추가
  blog,
  bodong,
  bookmarks,
  conch,
  dreams,
  scribble,
  'wind-ally': windAlly
}
