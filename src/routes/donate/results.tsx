import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useDonationStore } from '@/stores/donationStore'
import { Button, Card, CardContent, CardHeader, CardTitle, Container, Headline, Text } from '@/components/ui'

export const Route = createFileRoute('/donate/results')({
  component: RouteComponent,
})

function RouteComponent() {
  const { formData, resetAll } = useDonationStore()

  const mockCharities = [
    {
      id: 1,
      name: 'Local Food Bank',
      description: 'Helping families in need with food assistance',
      categories: ['Food & Nutrition'],
      acceptedItems: ['Food', 'Clothing'],
      pickup: true,
      dropoff: true,
    },
    {
      id: 2,
      name: 'Animal Shelter',
      description: 'Caring for abandoned and stray animals',
      categories: ['Animal Welfare'],
      acceptedItems: ['Pet Supplies', 'Toys'],
      pickup: false,
      dropoff: true,
    },
    {
      id: 3,
      name: "Children's Hospital",
      description: 'Supporting children and families during medical treatment',
      categories: ['Healthcare'],
      acceptedItems: ['Toys', 'Books', 'Clothing'],
      pickup: true,
      dropoff: true,
    },
  ]

  // Filter charities based on form data
  const filteredCharities = mockCharities.filter((charity) => {
    // Check if charity accepts the selected items
    const acceptsSelectedItems = formData.selectedItems.some((item) => charity.acceptedItems.includes(item))

    // Check if charity matches selected categories
    const matchesCategories = formData.selectedCategories.some((category) => charity.categories.includes(category))

    // Check delivery method compatibility
    const deliveryMatch = (formData.deliveryMethod.pickup && charity.pickup) || (formData.deliveryMethod.dropoff && charity.dropoff)

    return acceptsSelectedItems && matchesCategories && deliveryMatch
  })

  const navigate = useNavigate()

  return (
    <Container className="mx-auto py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Headline size="xl" className="text-white">
            Here are charities that match your preferences
          </Headline>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                resetAll()
                navigate({ to: '/donate' })
              }}
              className="text-white/90 hover:text-white hover:border-white/60"
            >
              Start over
            </Button>
            <Link to="/donate">
              <Button variant="outline" size="sm" className="text-white/90 hover:text-white hover:border-white/60">
                Edit preferences
              </Button>
            </Link>
          </div>
        </div>

        {/* Form Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-card-foreground">Your Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Text className="font-semibold text-card-foreground">Delivery Method:</Text>
              <Text className="text-card-foreground">
                {formData.deliveryMethod.pickup && 'Pickup'}
                {formData.deliveryMethod.pickup && formData.deliveryMethod.dropoff && ' • '}
                {formData.deliveryMethod.dropoff && 'Drop-off'}
              </Text>
            </div>
            <div>
              <Text className="font-semibold text-card-foreground">Item Condition:</Text>
              <Text className="text-card-foreground">
                {formData.itemCondition.new && 'New'}
                {formData.itemCondition.new && formData.itemCondition.used && ' • '}
                {formData.itemCondition.used && 'Used'}
              </Text>
            </div>
            <div>
              <Text className="font-semibold text-card-foreground">Selected Items:</Text>
              <Text className="text-card-foreground">{formData.selectedItems.join(', ')}</Text>
            </div>
            <div>
              <Text className="font-semibold text-card-foreground">Organization Types:</Text>
              <Text className="text-card-foreground">{formData.selectedCategories.join(', ')}</Text>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <Headline size="lg" className="text-white">
            {filteredCharities.length} charities found
          </Headline>

          {filteredCharities.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Text className="text-card-foreground">No charities match your current preferences. Try adjusting your selections.</Text>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredCharities.map((charity) => (
                <Card key={charity.id}>
                  <CardHeader>
                    <CardTitle className="text-card-foreground">{charity.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Text className="text-card-foreground mb-4">{charity.description}</Text>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {charity.categories.map((category) => (
                        <span key={category} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {category}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">View Details</Button>
                      <Button variant="outline" size="sm">
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
