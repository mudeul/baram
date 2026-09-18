import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url)

  if (!url.pathname.startsWith('/bodong')) {
    return next()
  }

  const PASSWORD = process.env.PASSWORD

  const cookieHeader = context.request.headers.get('Cookie') || ''
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map((c) => {
      const [key, ...v] = c.split('=')
      return [key, v.join('=')]
    })
  )

  // 이미 인증된 쿠키가 있다면 통과
  if (cookies.bodong_auth === 'true') {
    return next()
  }

  // 사용자가 비밀번호를 입력해서 POST 요청을 보낸 경우
  if (context.request.method === 'POST') {
    try {
      const formData = await context.request.formData()
      const inputPassword = formData.get('password')

      if (inputPassword === PASSWORD) {
        // 💡 리다이렉트(302)로 인한 루프를 없애고,
        // 쿠키를 심은 채 곧바로 페이지를 통과시켜 렌더링합니다!
        const response = await next()
        response.headers.set('Set-Cookie', 'bodong_auth=true; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400')
        return response
      }
    } catch (e) {}
  }

  // 인증되지 않았다면 비밀번호 입력 폼 화면 출력
  const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BODONG - Locked</title>
      <style>
        body {
          background-color: #f9f5f5;
          color: #b0a0b0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          margin: 0;
          min-height: 100dvh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .box {
          background: #ffffff;
          padding: 2.5rem;
          border-radius: 1rem;
          box-shadow: 0 10px 30px rgba(176, 160, 176, 0.1), 0 1px 3px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(176, 160, 176, 0.2);
          text-align: center;
          width: 90%;
          max-width: 360px;
          box-sizing: border-box;
        }
        h2 { 
          margin-top: 0; 
          margin-bottom: 0.5rem; 
          font-size: 1.4rem; 
          color: #b4addf; 
          letter-spacing: -0.025em;
        }
        p { 
          color: #b0a0b0; 
          opacity: 0.85;
          font-size: 0.9rem; 
          margin-bottom: 1.5rem; 
        }
        input[type="password"] {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(176, 160, 176, 0.3);
          background: #f9f5f5;
          color: #b0a0b0;
          font-size: 1rem;
          box-sizing: border-box;
          margin-bottom: 1rem;
          outline: none;
          -webkit-appearance: none;
        }
        input[type="password"]:focus { 
          border-color: #b4addf; 
          box-shadow: 0 0 0 3px rgba(180, 173, 223, 0.25);
        }
        button {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: none;
          background: #b4addf; 
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
        }
        button:hover { opacity: 0.85; }
      </style>
    </head>
    <body>
      <div class="box">
        <h2>🔒 BODONG</h2>
        <p>비밀공간입니다. 암호를 입력해주세요.</p>
        <form method="POST">
          <input type="password" name="password" placeholder="Password" required autofocus>
          <button type="submit">입장하기</button>
        </form>
      </div>
    </body>
    </html>
  `

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  })
})
