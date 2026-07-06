import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

/**
 * Determines whether the current user is an admin by calling GET /me.
 * Mirrors the admin check used in the admin page and header.
 */
export function useAdmin() {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function check() {
      if (isLoading) return
      if (!isAuthenticated) {
        if (!cancelled) {
          setIsAdmin(false)
          setLoading(false)
        }
        return
      }
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
        })
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('me_failed')
        const data = await res.json()
        if (!cancelled) setIsAdmin(Boolean(data?.user?.admin))
      } catch {
        if (!cancelled) setIsAdmin(false)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    check()
    return () => {
      cancelled = true
    }
  }, [isAuthenticated, isLoading, getAccessTokenSilently])

  return { isAdmin, isLoading: loading }
}
