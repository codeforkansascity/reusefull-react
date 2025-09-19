import { categoriesQuery } from '@/api/queries/categoriesQuery'
import { itemsQuery } from '@/api/queries/itemsQuery'
import { useSuspenseQueries } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { DonationForm } from '@/components/DonationForm'
import { LoadingSpinner } from '@/components/ui'

export const Route = createFileRoute('/donate')({
  async loader({ context: { queryClient } }) {
    await Promise.all([queryClient.ensureQueryData(itemsQuery), queryClient.ensureQueryData(categoriesQuery)])
  },
  component: RouteComponent,
  pendingComponent: () => (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner message="Loading donation form..." size="lg" />
    </div>
  ),
})

function RouteComponent() {
  const [{ data: items }, { data: categories }] = useSuspenseQueries({
    queries: [itemsQuery, categoriesQuery],
  })

  return <DonationForm items={items} categories={categories} />
}
