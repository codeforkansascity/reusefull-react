import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/verified')({
  component: VerifiedPage,
})

function VerifiedPage() {
  return (
    <div className="bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-6 py-20 text-center min-h-[calc(100vh-5rem)]">
        <h1 className="text-3xl font-semibold">Thanks for verifying your email</h1>
        <p className="mt-4 text-gray-700">
          You can now log in and continue. Use the Login or Signup buttons in the navbar.
        </p>
      </div>
    </div>
  )
}

