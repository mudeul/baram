import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const postSchema = z.object({
  title: z.string().optional().default('제목 없음'),
  description: z.string().optional(),
  pubDate: z.coerce.date().optional(),
  image: z.string().optional(),
  cover: z.string().optional(),
  tech: z.union([z.string(), z.array(z.string())]).optional(), // 이 부분을 추가해주세요!
  tags: z.union([z.string(), z.array(z.string())]).optional(), // 태그용 필드도 함께 안전하게 추가
  pinned: z.boolean().optional(),
  pin: z.boolean().optional(),
})

// ... (하단 컬렉션 정의들은 그대로 유지)

const about = defineCollection({
  loader: glob({ base: './src/content/about', pattern: '**/*.md' }),
  schema: z.object({})
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
  blog, 
  bodong, 
  bookmarks, 
  conch, 
  dreams, 
  scribble, 
  'wind-ally': windAlly 
}