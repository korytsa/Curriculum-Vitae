import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'ru']
const defaultLocale = 'en'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    const locale = pathname.split('/')[1]
    const isRootPath = pathname === `/${locale}` || pathname === `/${locale}/`
    if (isRootPath) {
      request.nextUrl.pathname = `/${locale}/login`
      return NextResponse.redirect(request.nextUrl)
    }
    return NextResponse.next()
  }

  const locale = defaultLocale
  if (pathname === '/' || pathname === '') {
    request.nextUrl.pathname = `/${locale}/login`
  } else {
    request.nextUrl.pathname = `/${locale}${pathname}`
  }
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
