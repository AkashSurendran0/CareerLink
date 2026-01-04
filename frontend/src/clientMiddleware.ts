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

  useEffect(() => {
    const token = Cookies.get('token')
    const isPublicRoute = publicRoutes.includes(pathname)

    if (!token && !isPublicRoute) {
      router.replace('/login')
      return
    }

    if (token && isPublicRoute) {
      router.replace('/feed')
      return
    }

  }, [pathname, router])

  return children
}