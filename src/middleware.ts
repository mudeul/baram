import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url)

  if (url.pathname.startsWith('/bodong')) {
    const cookieHeader = context.request.headers.get('Cookie') || ''

    // 💡 공백이나 세미콜론 차이에도 안전하게 쿠키를 파싱하도록 개선
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((cookie) => {
        const [key, ...val] = cookie.trim().split('=')
        return [key, val.join('=')]
      })
    )

    // 인증 쿠키가 없거나 값이 true가 아니면 로그인 페이지로 이동
    if (cookies.bodong_auth !== 'true') {
      return context.redirect('/login')
    }
  }

  return next()
})
