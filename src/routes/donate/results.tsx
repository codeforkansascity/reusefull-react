import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/donate/results')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/donate/results"!</div>
}
