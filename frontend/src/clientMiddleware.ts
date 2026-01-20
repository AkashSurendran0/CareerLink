'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import api from './lib/api'

const publicRoutes = ['/', '/login', '/signup', '/resetPassword']
const authOnlyRoutes = ['/login', '/signup', '/resetPassword']

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname() || '/' // ensure we always have a pathname
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {

      if (pathname.startsWith('/admin')) {
        setLoading(false)
        return
      }

      const isPublicRoute = publicRoutes.includes(pathname)

      // ✅ Public routes (landing page / login / signup / reset)
      if (isPublicRoute) {
        // Logged-in user should not access auth-only pages
        if (authOnlyRoutes.includes(pathname)) {
          try {
            const res = await fetch('/server/me', { method: 'GET', credentials: 'include' })
            if (res.ok) {
              router.replace('/feed')
              return
            }
          } catch {}
        }

        setLoading(false)
        return
      }

      // 🔐 Private routes (all other pages)
      try {
        const res = await fetch('/server/me', {
          method: 'GET',
          credentials: 'include',
        })

        if (!res.ok) {
          router.replace('/login')
          return
        }
        
        const result=await api.get(`${process.env.NEXT_PUBLIC_API_GATEWAY_ROUTE}/user/v1/check`)


        const isBlocked = result.data?.result?.success === true
      
        if(isBlocked && pathname !== '/blocked'){
          router.replace('/blocked')
          return
        }

        if(!isBlocked && pathname === '/blocked'){
          router.replace('/feed')
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
