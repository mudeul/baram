import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { getPublishedPosts } from '@/lib/posts';
import { renderOgImage } from '@/lib/og';

/**
 * Social cards, one per post and case study, rendered at build time.
 */
export async function getStaticPaths() {
  const posts = await getPublishedPosts();
  // 🌟 projects 대신 wind-ally 컬렉션을 가져옵니다.
  const windAllies = await getCollection('wind-ally');

  return [
    ...posts.map((post) => ({
      params: { slug: `blog/${post.id}` },
      props: { title: post.data.title, eyebrow: 'Article' },
    })),
    // 🌟 경로와 데이터를 wind-ally에 맞게 연결합니다.
    ...windAllies.map((item) => ({
      params: { slug: `wind-ally/${item.id}` },
      props: { title: item.data.title, eyebrow: 'Wind-Ally' },
    })),
  ];
}

export async function GET(context: APIContext) {
  const { title, eyebrow } = context.props as {
    title: string;
    eyebrow: string;
  };

  return new Response(await renderOgImage({ title, eyebrow }), {
    headers: { 'Content-Type': 'image/png' },
  });
}
