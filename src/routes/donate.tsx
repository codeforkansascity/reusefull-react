import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/donate')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/donate"!</div>
}
