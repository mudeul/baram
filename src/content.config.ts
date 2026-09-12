import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';
import { classifyHref } from '@/lib/url';

const nonBlank = z.string().trim().min(1, { message: 'Must not be empty' });

const href = nonBlank.refine((v) => classifyHref(v) !== 'unsafe', {
  message:
    'Must be an http(s) URL, a path, an anchor (#…), or a mailto:/tel: link',
});

const imageSrc = nonBlank.refine(
  (v) => {
    const kind = classifyHref(v);
    return kind === 'external' || kind === 'absolute' || kind === 'relative';
  },
  { message: 'Must be an http(s) URL or a path to an image file' },
);

// Blog collection
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
      heroImageAlt: z.string().optional(),
      tags: z.array(z.string()).default([]),
      author: z.string().default('Anonymous'),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
    }),
});

// Dreams collection
const dreams = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/dreams' }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      pubDate: z.coerce.date(),
      draft: z.boolean().default(false),
    }),
});

// Wind-ally collection
const windAlly = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/wind-ally' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      description: z.string().optional(),
      cover: image(),
      coverAlt: z.string().optional(),
      images: z
        .array(
          z.preprocess(
            (v) => (typeof v === 'string' ? { src: v } : v),
            z.object({ src: image(), alt: z.string().min(1).optional() }),
          ),
        )
        .optional(),
      tech: z.preprocess((v) => {
        if (typeof v === 'number') return [String(v)];
        if (typeof v === 'string')
          return v
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        if (Array.isArray(v)) return v.map(String);
        return [];
      }, z.array(z.string()).default([])),
      role: z.string().optional(),
      year: z.number().int().min(1000).max(9999).optional(),
      featured: z.boolean().default(false),
      links: z
        .object({
          live: z.string().url().optional(),
          github: z.string().url().optional(),
          case: href.optional(),
        })
        .optional(),
      client: z.string().optional(),
      duration: z.string().optional(),
    }),
});

// Conch collection
const conch = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/conch' }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      pubDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),
    }),
});

// 🌟 Bookmarks collection
const bookmarks = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/bookmarks' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    author: z.string().default('Anonymous'),
    pubDate: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

// Landing page sections
const landing = defineCollection({
  loader: glob({
    pattern: '**/*.{json,yaml,yml}',
    base: './src/content/landing',
  }),
  schema: z.object({
    hero: z.object({
      title: z.string(),
      subtitle: z.string(),
      description: z.string(),
      cta: z.object({
        primary: z.object({ text: z.string(), href }),
        secondary: z.object({ text: z.string(), href }).optional(),
      }),
      image: imageSrc.optional(),
    }),
    features: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          icon: z.string().optional(),
        }),
      )
      .optional(),
    benefits: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          icon: z.string().optional(),
        }),
      )
      .optional(),
    pricing: z
      .array(
        z.object({
          name: z.string(),
          price: z.string(),
          period: z.string().optional(),
          description: z.string(),
          features: z.array(z.string()),
          highlighted: z.boolean().default(false),
          cta: z.object({ text: z.string(), href }),
        }),
      )
      .optional(),
    gallery: z
      .array(
        z.object({
          src: imageSrc,
          alt: z.string().min(1),
          caption: z.string().optional(),
        }),
      )
      .optional(),
    testimonials: z
      .array(
        z.object({
          name: z.string(),
          role: z.string(),
          company: z.string().optional(),
          content: z.string(),
          rating: z.number().min(1).max(5).optional(),
        }),
      )
      .optional(),
    faq: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .optional(),
    finalCta: z
      .object({
        title: z.string(),
        description: z.string(),
        button: z.object({ text: z.string(), href }),
      })
      .optional(),
  }),
});

// 🌟 collections 목록에 bookmarks 추가 완료!
export const collections = {
  blog,
  dreams,
  'wind-ally': windAlly,
  conch,
  bookmarks,
  landing,
};
