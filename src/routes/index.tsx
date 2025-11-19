import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: IndexRedirect,
})

function IndexRedirect() {
  const navigate = useNavigate()
  useEffect(() => {
    // Always land on donate for root. If Auth0 sent an error, we ignore it here
    // and let the user see the donate page without an authenticated session.
    navigate({ to: '/donate' })
  }, [navigate])
  return null
}
