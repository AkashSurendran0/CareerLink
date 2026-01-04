'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Cookies from 'js-cookie'

const publicRoutes = ['/login', '/resetPassword', '/signup']

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const token = Cookies.get('token')

  useEffect(() => {
    const path = pathname ?? '/'
    const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith(route + '/'))

    if (!token && !isPublicRoute) {
      router.replace('/login')
      return
    }

    if (token && isPublicRoute) {
      router.replace('/feed')
      return
    }

  }, [pathname, router, token])

  return children
}