import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/charity/signup/thank-you')({
  component: ThankYouComponent,
})

function ThankYouComponent() {
  return (
    <div className="bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-6 py-24 text-center min-h-[calc(100vh-5rem)] flex flex-col items-center justify-start">
        <img src="/reusefull-logo-350.png" alt="Reusefull" className="h-24 w-24 mb-6" />
        <h1 className="text-3xl font-semibold mb-3">Thank you for signing up!</h1>
        <p className="text-gray-600">
          We received your information.
        </p>
        <Link to="/" className="mt-8 inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700">
          Go to Home
        </Link>
      </div>
    </div>
  )
}

