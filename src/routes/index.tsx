import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeLanding,
})

function HomeLanding() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        <div className="mt-4">
          <Link
            to="/charitylist"
            className="text-[#2c78c5] underline text-[14px] hover:text-[#1e5f9b] cursor-pointer"
          >
            Charity List
          </Link>
        </div>
      </div>
    </div>
  )
}
