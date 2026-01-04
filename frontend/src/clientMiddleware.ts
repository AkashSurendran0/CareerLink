'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const publicRoutes = ['/', '/login', '/signup', '/resetPassword']
const authOnlyRoutes = ['/login', '/signup', '/resetPassword']

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

      if (isPublicRoute) {
        if (authOnlyRoutes.includes(pathname)) {
          try {
            const res = await fetch('/api/me', { credentials: 'include' })
            if (res.ok) {
              router.replace('/feed')
              return
            }
          } catch {}
        }

        setLoading(false)
        return
      }

      try {
        const res = await fetch('/api/me', {
          credentials: 'include',
        })

        if (!res.ok) {
          router.replace('/login')
          return
        }
      } catch {
        router.replace('/login')
        return
      }

      setLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  if (loading) return null
  return children
}
