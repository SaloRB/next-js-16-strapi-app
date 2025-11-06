import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { STRAPI_BASE_URL } from './lib/strapi'

const protectedRoutes = ['/dashboard']

function checkIsProtectedRoute(path: string) {
  return protectedRoutes.includes(path)
}

export async function proxy(request: NextRequest) {
  const currentPath = request.nextUrl.pathname

  const isProtectedRoute = checkIsProtectedRoute(currentPath)

  if (!isProtectedRoute) return NextResponse.next()

  // La ruta está protegida, verificar la autenticación
  try {
    // 1. validar si existe jwt
    // 2. validar si usuario existe en bd
    // 3. validar si usuario no está bloqueado

    const cookieStore = await cookies()
    const jwt = cookieStore.get('jwt')?.value

    if (!jwt) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }

    const response = await fetch(`${STRAPI_BASE_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    })

    const userResponse = await response.json()

    if (!userResponse) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Error during authentication check:', error)
    return NextResponse.redirect(new URL('/signin', request.url))
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/dashboard',
    '/dashboard/:path*',
  ],
}
