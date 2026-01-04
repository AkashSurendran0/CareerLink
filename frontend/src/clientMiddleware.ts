'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const publicRoutes = ['/', '/login', '/signup', '/resetPassword']

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const isPublicRoute = publicRoutes.includes(pathname)

      try {
        const res = await fetch('/api/me', {
          credentials: 'include',
        })

        if (!res.ok && !isPublicRoute) {
          router.replace('/login')
          return
        }

        if (res.ok && pathname !== '/' && ['/login', '/signup', '/resetPassword'].includes(pathname)) {
          router.replace('/feed')
          return
        }
      } catch {
        if (!isPublicRoute) {
          router.replace('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  if (loading) return null
  return children
}
