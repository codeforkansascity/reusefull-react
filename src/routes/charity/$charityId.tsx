import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { orgsQuery } from '@/api/queries/orgsQuery'
import { orgItemsQuery } from '@/api/queries/orgItemsQuery'
import { orgCharityTypesQuery } from '@/api/queries/orgCharityTypesQuery'
import { categoriesQuery } from '@/api/queries/categoriesQuery'
import { formatPhone } from '@/utils/formatPhone'
import { trackCharityView, trackCharityInteraction } from '@/utils/analytics'
import { Container, Card, CardContent, CardHeader, CardTitle, Button, Headline, Text, LoadingSpinner } from '@/components/ui'
import { MapPin, Phone as PhoneIcon, Mail, Globe, Truck, Package, User, ArrowLeft, Heart, Building } from 'lucide-react'

export const Route = createFileRoute('/charity/$charityId')({
  component: CharityDetailsComponent,
  pendingComponent: () => (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <LoadingSpinner message="Loading charity details..." size="lg" textClassName="text-white" />
    </div>
  ),
})

function CharityDetailsComponent() {
  const { charityId } = Route.useParams()
  const orgId = parseInt(charityId, 10)
  const fromParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('from') : null
  const backHref = fromParam === 'charitylist' ? '/charitylist' : '/donate/results'

  const { data: organizations, isLoading: orgsLoading } = useQuery(orgsQuery)
  const { data: orgItems, isLoading: itemsLoading } = useQuery(orgItemsQuery)
  const { data: orgCharityTypes, isLoading: typesLoading } = useQuery(orgCharityTypesQuery)
  const { data: categories, isLoading: categoriesLoading } = useQuery(categoriesQuery)

  const organization = organizations?.find((org) => org.Id === orgId)

  // Track charity page view with Google Analytics (must run on every render to satisfy Rules of Hooks)
  useEffect(() => {
    if (organization) {
      trackCharityView(organization.Id, organization.Name)
    }
  }, [organization])

  if (orgsLoading || itemsLoading || typesLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <LoadingSpinner message="Loading charity details..." size="lg" textClassName="text-white" />
      </div>
    )
  }

  // safe defaults for possibly-undefined query results
  const orgCharityTypesSafe = orgCharityTypes ?? []
  const categoriesSafe = categories ?? []

  const filteredOrgItems = Array.from(
    new Set(orgItems?.filter(({ CharityId }) => CharityId === orgId).map(({ ItemName }) => ItemName) ?? [])
  )

  // compute the org's category/type entries safely
  const orgTypesForOrg = orgCharityTypesSafe.filter((t) => t.CharityId === orgId)

  if (!organization) {
    return (
      <div className="min-h-screen">
        <Container size="lg" className="py-16">
          <div className="text-center space-y-6">
            <Headline as="h1" size="3xl" className="mb-8 text-white">
              Organization Not Found
            </Headline>
            <Text size="lg" variant="muted" className="max-w-2xl mx-auto">
              The organization you're looking for doesn't exist or has been removed.
            </Text>
            <Link to={backHref}>
              <Button size="lg" className="mt-8 cursor-pointer">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {fromParam === 'charitylist' ? 'Back to Charity List' : 'Back to Results'}
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Container size="lg" className="py-16">
        {/* Back Button */}
        <div className="mb-8">
          <Link to={backHref}>
            <Button variant="outline" size="sm" className="text-white/90 hover:text-white hover:border-white/60 cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {fromParam === 'charitylist' ? 'Back to Charity List' : 'Back to Results'}
            </Button>
          </Link>
        </div>

        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Logo and Basic Info */}
            <div className="flex-shrink-0">
              {organization.LogoUrl ? (
                <img
                  src={organization.LogoUrl}
                  alt={`${organization.Name} logo`}
                  className="w-32 h-32 rounded-2xl object-contain bg-white p-4 shadow-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Building className="w-16 h-16 text-white/50" />
                </div>
              )}
            </div>

            {/* Organization Details */}
            <div className="flex-1">
              <Headline as="h1" size="3xl" className="mb-4 text-white">
                {organization.Name}
              </Headline>

              {organization.Mission && (
                <Text size="lg" className="text-white/90 mb-6 leading-relaxed">
                  {organization.Mission}
                </Text>
              )}

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-full text-white">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {organization.City}, {organization.State}
                  </span>
                </div>

                {organization.Pickup && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-200 rounded-full">
                    <Truck className="w-4 h-4" />
                    <span className="text-sm font-medium">Pickup Available</span>
                  </div>
                )}

                {organization.Dropoff && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-200 rounded-full">
                    <Package className="w-4 h-4" />
                    <span className="text-sm font-medium">Drop-off Available</span>
                  </div>
                )}
              </div>

              {/* Action Buttons duplicated below in Quick Actions card — removed for clarity */}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            {organization.Description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-card-foreground">About This Organization</CardTitle>
                </CardHeader>
                <CardContent>
                  <Text className="text-card-foreground leading-relaxed whitespace-pre-line">{organization.Description}</Text>
                </CardContent>
              </Card>
            )}

            {/* Accepted Items */}
            {filteredOrgItems && filteredOrgItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-card-foreground">Items They Accept</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {filteredOrgItems.map((ItemName, index) => (
                      <span key={index} className="px-3 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full">
                        {ItemName}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Organization Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-card-foreground">Organization Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${organization.Faith ? 'bg-purple-500' : 'bg-gray-300'}`} />
                      <Text className="text-card-foreground">Faith-based organization</Text>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${organization.Resell ? 'bg-orange-500' : 'bg-gray-300'}`} />
                      <Text className="text-card-foreground">Resells donated items</Text>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${organization.NewItems ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                      <Text className="text-card-foreground">Accepts new items</Text>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${organization.GoodItems ? 'bg-teal-500' : 'bg-gray-300'}`} />
                      <Text className="text-card-foreground">Accepts used items</Text>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${organization.Pickup ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <Text className="text-card-foreground">Offers pickup service</Text>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${organization.Dropoff ? 'bg-blue-500' : 'bg-gray-300'}`} />
                      <Text className="text-card-foreground">Accepts drop-offs</Text>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organization Types */}
            <Card>
              <CardHeader>
                <CardTitle className="text-card-foreground text-xl md:text-2xl font-semibold">Organization Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {orgTypesForOrg.map((type) => {
                    const category = categoriesSafe.find((cat) => cat.Id === type.TypeId)
                    return category ? (
                      <span
                        key={type.TypeId}
                        className="px-3 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full"
                      >
                        {category.Type}
                      </span>
                    ) : null
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact & Location */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-card-foreground">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {organization.ContactName && (
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Text className="text-sm font-medium text-card-foreground">Contact Person</Text>
                      <Text className="text-card-foreground break-words">{organization.ContactName}</Text>
                    </div>
                  </div>
                )}

                {organization.Phone && (
                  <div className="flex items-start gap-3">
                    <PhoneIcon className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Text className="text-sm font-medium text-card-foreground">Phone</Text>
                      <Text className="text-card-foreground break-words">
                        <a href={`tel:${organization.Phone}`} className="hover:text-primary">
                          {formatPhone(organization.Phone)}
                        </a>
                      </Text>
                    </div>
                  </div>
                )}

                {organization.Email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Text className="text-sm font-medium text-card-foreground">Email</Text>
                      <Text className="text-card-foreground break-words">
                        <a href={`mailto:${organization.Email}`} className="hover:text-primary">
                          {organization.Email}
                        </a>
                      </Text>
                    </div>
                  </div>
                )}

                {organization.LinkWebsite && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Text className="text-sm font-medium text-card-foreground">Website</Text>
                      <Text className="text-card-foreground">
                        <a
                          href={organization.LinkWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary break-words"
                          onClick={() =>
                            trackCharityInteraction('website_click', organization.Id, organization.Name, 'website')
                          }
                        >
                          {organization.LinkWebsite}
                        </a>
                      </Text>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="text-card-foreground">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${organization.Address}, ${organization.City}, ${organization.State} ${organization.ZipCode}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-card-foreground font-medium hover:text-primary transition-colors cursor-pointer block"
                    >
                      {organization.Address} <br />
                      {organization.City}, {organization.State} {organization.ZipCode}
                    </a>
                    {!!(organization.Lat && organization.Lng) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 text-xs cursor-pointer text-card-foreground border-card-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
                        onClick={() => {
                          trackCharityInteraction('map_click', organization.Id, organization.Name, 'map')
                          const mapsUrl = `https://www.google.com/maps?q=${organization.Lat},${organization.Lng}`
                          window.open(mapsUrl, '_blank')
                        }}
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        View on Map
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {organization.LinkWishlist && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start cursor-pointer text-card-foreground border-card-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
                    onClick={() => {
                      trackCharityInteraction('wishlist_click', organization.Id, organization.Name, 'wishlist')
                      window.open(organization.LinkWishlist, '_blank')
                    }}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    View Wishlist
                  </Button>
                )}

                {organization.LinkVolunteer && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start cursor-pointer text-card-foreground border-card-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
                    onClick={() => {
                      trackCharityInteraction('volunteer_click', organization.Id, organization.Name, 'volunteer')
                      window.open(organization.LinkVolunteer, '_blank')
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Volunteer Opportunities
                  </Button>
                )}

                {organization.Phone && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start cursor-pointer text-card-foreground border-card-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
                    onClick={() => {
                      trackCharityInteraction('phone_click', organization.Id, organization.Name, 'phone')
                      window.open(`tel:${organization.Phone}`, '_self')
                    }}
                  >
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                )}

                {organization.Email && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start cursor-pointer text-card-foreground border-card-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
                    onClick={() => {
                      trackCharityInteraction('email_click', organization.Id, organization.Name, 'email')
                      window.open(`mailto:${organization.Email}`, '_self')
                    }}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
}
