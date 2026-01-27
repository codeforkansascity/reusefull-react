import { createFileRoute } from '@tanstack/react-router'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'

export const Route = createFileRoute('/verify-email')({
  component: VerifyEmailPage,
})

function VerifyEmailPage() {
  const { isAuthenticated, isLoading, logout } = useAuth0()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Ensure no active session while waiting for email verification
      logout({ logoutParams: { returnTo: `${window.location.origin}/verify-email` } })
    }
  }, [isLoading, isAuthenticated, logout])

  return (
    <div className="bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-6 py-20 text-center min-h-[calc(100vh-5rem)]">
        <h1 className="text-3xl font-semibold">Thanks for signing up</h1>
        <p className="mt-4 text-gray-700">Please verify your email to continue.</p>
        <p className="mt-2 text-gray-500">Check your inbox for a message from us with a verification link.</p>
      </div>
    </div>
  )
}

