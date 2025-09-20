import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useDonationStore } from '@/stores/donationStore'
import { useCallback } from 'react'
import useResults from '@/hooks/useResults'
import {
  Container,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Headline,
  Text,
  LoadingSpinner,
} from '@/components/ui'
import { MapPin, Phone as PhoneIcon, Globe, CheckCircle, Truck, Package } from 'lucide-react'
import { orgsQuery } from '@/api/queries/orgsQuery'
import { orgItemsQuery } from '@/api/queries/orgItemsQuery'

export const Route = createFileRoute('/donate/results')({
  async loader({ context: { queryClient } }) {
    await Promise.all([queryClient.ensureQueryData(orgsQuery), queryClient.ensureQueryData(orgItemsQuery)])
  },
  component: RouteComponent,
  pendingComponent: () => (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <LoadingSpinner message="Loading results..." size="lg" textClassName="text-white" />
    </div>
  ),
})

function RouteComponent() {
  const { resetAll } = useDonationStore()
  const navigate = useNavigate()
  const results = useResults()

  const startOver = useCallback(() => {
    resetAll()
    navigate({ to: '/donate' })
  }, [navigate, resetAll])

  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <Container size="lg" className="py-16">
          <div className="text-center space-y-6">
            <Headline as="h1" size="3xl" variant="reusefull" className="mb-8">
              No Organizations Found
            </Headline>
            <Text size="lg" variant="muted" className="max-w-2xl mx-auto">
              We couldn't find any organizations that match your donation criteria. Try adjusting your preferences to see more results.
            </Text>
            <Button onClick={startOver} size="lg" className="mt-8">
              Start Over
            </Button>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <Container size="lg" className="py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Headline as="h1" size="3xl" variant="reusefull" className="mb-4">
            Matching Organizations
          </Headline>
          <Text size="lg" variant="muted" className="max-w-2xl mx-auto mb-8">
            We found {results.length} organization{results.length !== 1 ? 's' : ''} that match your donation criteria
          </Text>
          <Button onClick={startOver} variant="outline" size="lg">
            Start Over
          </Button>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((org) => (
            <CharityCard key={org.Id} organization={org} />
          ))}
        </div>
      </Container>
    </div>
  )
}

interface CharityCardProps {
  organization: {
    Id: number
    Name: string
    Address: string
    ZipCode: string
    Phone: string
    Email: string
    ContactName: string
    Mission: string
    Description: string
    LinkVolunteer: string
    LinkWebsite: string
    LinkWishlist: string
    Pickup: boolean
    Dropoff: boolean
    Resell: boolean
    Faith: boolean
    GoodItems: boolean
    NewItems: boolean
    LogoUrl: string
    City: string
    State: string
    Lat: number
    Lng: number
  }
}

function CharityCard({ organization }: CharityCardProps) {
  const {
    Name,
    Address,
    City,
    State,
    ZipCode,
    Phone,
    Email,
    Mission,
    Description,
    LinkWebsite,
    LinkWishlist,
    Pickup,
    Dropoff,
    Resell,
    Faith,
    GoodItems,
    NewItems,
    LogoUrl,
  } = organization

  const fullAddress = `${Address}, ${City}, ${State} ${ZipCode}`

  return (
    <Card variant="elevated" className="h-full flex flex-col hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2 line-clamp-2">{Name}</CardTitle>
            {Mission && <CardDescription className="line-clamp-2 text-sm">{Mission}</CardDescription>}
          </div>
          {LogoUrl && (
            <div className="ml-4 flex-shrink-0">
              <img
                src={LogoUrl}
                alt={`${Name} logo`}
                className="w-12 h-12 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}
        </div>

        {/* Delivery Methods */}
        <div className="flex flex-wrap gap-2 mb-3">
          {Pickup && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              <Truck className="w-3 h-3" />
              Pickup
            </div>
          )}
          {Dropoff && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              <Package className="w-3 h-3" />
              Drop-off
            </div>
          )}
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1">
          {Faith && <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">Faith-based</span>}
          {Resell && <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">Resells items</span>}
          {NewItems && <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-medium">Accepts new items</span>}
          {GoodItems && <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded text-xs font-medium">Accepts used items</span>}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {/* Description */}
        {Description && (
          <Text size="sm" variant="muted" className="mb-4 line-clamp-3">
            {Description}
          </Text>
        )}

        {/* Contact Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-muted-foreground line-clamp-1">{fullAddress}</span>
          </div>

          {Phone && (
            <div className="flex items-center gap-2 text-sm">
              <PhoneIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{Phone}</span>
            </div>
          )}

          {Email && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-muted-foreground line-clamp-1">{Email}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          {LinkWebsite && (
            <Button variant="outline" size="sm" className="flex-1" onClick={() => window.open(LinkWebsite, '_blank')}>
              <Globe className="w-4 h-4 mr-1" />
              Website
            </Button>
          )}
          {LinkWishlist && (
            <Button variant="default" size="sm" className="flex-1" onClick={() => window.open(LinkWishlist, '_blank')}>
              <CheckCircle className="w-4 h-4 mr-1" />
              Wishlist
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
