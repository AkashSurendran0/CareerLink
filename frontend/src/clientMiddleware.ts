'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const publicRoutes = ['/login', '/signup', '/resetPassword']

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/me', {
          credentials: 'include',
        })

        const isPublicRoute = publicRoutes.includes(pathname)

        if (!res.ok && !isPublicRoute) {
          router.replace('/login')
          return
        }

        if (res.ok && isPublicRoute) {
          router.replace('/feed')
          return
        }
      } catch {
        router.replace('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  if (loading) return null
  return children
}
