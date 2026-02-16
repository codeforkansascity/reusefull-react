import { Outlet, createRootRouteWithContext, useNavigate, useRouterState } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { Header } from '@/components/Header'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { trackPageView } from '@/utils/analytics'

type RouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function useUpsertUser() {
  const { isAuthenticated, isLoading, user, getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    ;(async () => {
      if (isLoading || !isAuthenticated || !(user as any)?.sub) return

      // If you later protect /users with JWT, get a token and add Authorization header.
      // const token = await getAccessTokenSilently({
      //   authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
      // })

      await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`,
          'x-action-secret': 'dev_secret',
        },
        body: JSON.stringify({
          sub: (user as any).sub,
          email_verified: (user as any).email_verified,
        }),
      }).catch(() => {
        // no-op for local dev
      })
    })()
  }, [isLoading, isAuthenticated, user, getAccessTokenSilently])
}

function RootComponent() {
  const { isAuthenticated, isLoading, user, getAccessTokenSilently } = useAuth0()
  const navigate = useNavigate()
  const { location } = useRouterState()
  useUpsertUser()

  // GA4: fire page_view on route change
  useEffect(() => {
    trackPageView()
  }, [location.pathname, location.search])

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const CLAIM_KEY = 'http://localhost:5173/claims/first_verified_login'
      const firstVerifiedLogin = (user as any)?.[CLAIM_KEY]
      // Only perform the one-time onboarding redirect on the very first landing,
      // and never override explicit navigation like Edit Profile.
      if (
        firstVerifiedLogin &&
        window.location.pathname === '/' // initial landing only
      ) {
        navigate({ to: '/charity/signup/step/1' })
      }
    }
  }, [isLoading, isAuthenticated, user, navigate])

  // If user is logged in (verified), route to step1 until they have a saved draft; afterwards let them land on default
  useEffect(() => {
    ;(async () => {
      if (isLoading || !isAuthenticated) return
      const pathname = window.location.pathname
      // Do not override explicit navigation to Edit Profile, and skip if already on step 1
      if (pathname.startsWith('/profile') || pathname === '/charity/signup/step/1') return
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
        })
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return
        const data = await res.json()
        const completed = Boolean(data?.completed)
        if (!completed) {
          navigate({ to: '/charity/signup/step/1' })
        }
      } catch {
        // ignore network/token errors
      }
    })()
  }, [isLoading, isAuthenticated, getAccessTokenSilently, navigate])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
