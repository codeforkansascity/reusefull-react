import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { orgsQuery } from '@/api/queries/orgsQuery'
import { formatPhone } from '@/utils/formatPhone'
import { trackCharityInteraction } from '@/utils/analytics'
import { Container, Headline, LoadingSpinner } from '@/components/ui'
import { MapPin, Globe, Phone } from 'lucide-react'

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

  const orgs = (organizations ?? []).slice().sort((a, b) =>
    a.Name.localeCompare(b.Name, undefined, { sensitivity: 'base' })
  )

  return (
    <div className="min-h-screen">
      <Container size="lg" className="py-10">
        <Headline as="h1" size="3xl" className="text-white mb-8">Charity List</Headline>

        <div className="space-y-8">
          {orgs.map((org) => (
            <div
              key={org.Id}
              className="rounded-md border border-[#e3e6ea] shadow-sm bg-white px-6 py-5"
            >
              <div className="flex items-start gap-6">
                <Link
                  to="/charity/$charityId"
                  params={{ charityId: String(org.Id) }}
                  search={{ from: 'charitylist' }}
                  className="shrink-0"
                  onClick={() => trackCharityInteraction('view_details_click', org.Id, org.Name, 'details')}
                >
                  {org.LogoUrl ? (
                    <img
                      src={org.LogoUrl}
                      alt={`${org.Name} logo`}
                      className="w-[250px] h-[120px] object-contain bg-white"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-[250px] h-[120px] bg-gray-100 flex items-center justify-center text-gray-400">
                      No Logo
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    to="/charity/$charityId"
                    params={{ charityId: String(org.Id) }}
                    search={{ from: 'charitylist' }}
                    className="text-[18px] font-semibold text-[#2c78c5] underline"
                    onClick={() => trackCharityInteraction('view_details_click', org.Id, org.Name, 'details')}
                  >
                    {org.Name}
                  </Link>
                  <div className="mt-3 text-[14px] text-[#212529] space-y-1">
                    <div><span className="font-semibold">Pick-Up Service:</span> {org.Pickup ? 'Yes' : 'No'}</div>
                    <div><span className="font-semibold">Dropoff:</span> {org.Dropoff ? 'Yes' : 'No'}</div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-[3px] text-[#6c757d]" />
                      <div>
                        <span className="font-semibold">Address:</span>{' '}
                        {org.Address}
                        {org.City ? `, ${org.City}` : ''}
                        {org.State ? `, ${org.State}` : ''} {org.ZipCode || ''}
                      </div>
                    </div>
                    {org.Phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#6c757d]" />
                        <span className="font-semibold">Phone:</span>
                        <a href={`tel:${org.Phone}`} className="text-[#2c78c5] hover:underline">
                          {formatPhone(org.Phone)}
                        </a>
                      </div>
                    )}
                    {org.LinkWebsite && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#6c757d]" />
                        <span className="font-semibold">Website:</span>
                        <a
                          href={org.LinkWebsite}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#2c78c5] hover:underline break-all"
                          onClick={() => trackCharityInteraction('website_click', org.Id, org.Name, 'website')}
                        >
                          {org.LinkWebsite}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  )
}

