import { next } from '@vercel/functions'

/**
 * HTTP Basic Auth для деплоя на Vercel (не для локалки без env).
 * В Dashboard: Environment Variables → PROTOTYPE_PASSWORD = ваш пароль.
 * В браузере: логин любой (например prototype), пароль — из переменной.
 */
export const config = {
  matcher: '/:path*',
}

function parseBasicPassword(authorization: string | null): string | null {
  if (!authorization?.startsWith('Basic ')) return null
  const b64 = authorization.slice('Basic '.length).trim()
  try {
    const decoded = atob(b64)
    const i = decoded.indexOf(':')
    if (i < 0) return null
    return decoded.slice(i + 1)
  } catch {
    return null
  }
}

export default function middleware(request: Request) {
  const password = process.env.PROTOTYPE_PASSWORD
  if (!password) {
    return next()
  }

  const provided = parseBasicPassword(request.headers.get('authorization'))
  if (provided === password) {
    return next()
  }

  return new Response('Authentication required — Reward prototype', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Reward prototype"',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
