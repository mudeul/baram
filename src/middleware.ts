import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url)

  if (url.pathname.startsWith('/bodong')) {
    const cookieHeader = context.request.headers.get('Cookie') || ''
    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map((c) => {
        const [key, ...v] = c.split('=')
        return [key, v.join('=')]
      })
    )

    if (cookies.bodong_auth !== 'true') {
      return context.redirect('/login')
    }
  }

  return next()
})
