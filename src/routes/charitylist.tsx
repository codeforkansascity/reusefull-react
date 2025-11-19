import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { orgsQuery } from '@/api/queries/orgsQuery'
import { formatPhone } from '@/utils/formatPhone'
import { Container, Card, CardContent, CardHeader, CardTitle, Headline, Text, LoadingSpinner, Button } from '@/components/ui'

export const Route = createFileRoute('/charitylist')({
  component: CharityListComponent,
  pendingComponent: () => (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <LoadingSpinner message="Loading charities..." size="lg" textClassName="text-white" />
    </div>
  ),
})

function CharityListComponent() {
  const { data: organizations, isLoading } = useQuery(orgsQuery)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <LoadingSpinner message="Loading charities..." size="lg" textClassName="text-white" />
      </div>
    )
  }

  const orgs = organizations ?? []

  return (
    <div className="min-h-screen">
      <Container size="lg" className="py-12">
        <Headline as="h1" size="3xl" className="text-white mb-8">Charity List</Headline>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orgs.map((org) => (
            <Card key={org.Id} className="overflow-hidden h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-start gap-4">
                  {org.LogoUrl ? (
                    <img
                      src={org.LogoUrl}
                      alt={`${org.Name} logo`}
                      className="w-16 h-16 rounded-lg object-contain bg-white p-2 shadow"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-white/10" />
                  )}
                  <div className="min-w-0">
                    <Link to={`/charity/${org.Id}`} className="text-lg font-semibold text-card-foreground hover:text-primary">
                      {org.Name}
                    </Link>
                    <div className="mt-1 text-xs text-card-foreground/70">
                      {org.City ? `${org.City}, ` : ''}{org.State || ''}
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-card-foreground/80 space-y-1">
                  <div><span className="font-medium">Pick-Up:</span> {org.Pickup ? 'Yes' : 'No'}</div>
                  <div><span className="font-medium">Dropoff:</span> {org.Dropoff ? 'Yes' : 'No'}</div>
                  <div className="line-clamp-2"><span className="font-medium">Address:</span> {org.Address}{org.City ? `, ${org.City}` : ''}{org.State ? `, ${org.State}` : ''} {org.ZipCode || ''}</div>
                  {org.Phone && (
                    <div><span className="font-medium">Phone:</span> <a href={`tel:${org.Phone}`} className="hover:text-primary">{formatPhone(org.Phone)}</a></div>
                  )}
                  {org.LinkWebsite && (
                    <div className="truncate"><span className="font-medium">Website:</span> <a href={org.LinkWebsite} target="_blank" rel="noreferrer" className="hover:text-primary">{org.LinkWebsite}</a></div>
                  )}
                </div>

                <div className="mt-auto pt-4">
                  <Link to={`/charity/${org.Id}`}>
                    <Button className="w-full cursor-pointer">View</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  )
}

