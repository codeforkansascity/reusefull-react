import { Button, Card, CardContent, CardHeader, CardTitle, Checkbox, Headline, Container, Input, Text } from '@/components/ui'
import { useDonationStore } from '@/stores/donationStore'
import { useNavigate } from '@tanstack/react-router'
import useResults from '@/hooks/useResults'
import { useEffect } from 'react'

interface DonationFormProps {
  items: Array<{ Id: number; Name: string }>
  categories: Array<{ Id: number; Type: string }>
}

export function DonationForm({ items, categories }: DonationFormProps) {
  const {
    formData,
    setDeliveryMethod,
    setConsideration,
    setItemCondition,
    toggleItem,
    toggleCategory,
    selectAllCategories,
    clearItems,
    resetAll,
    isFormValid,
    saveFiltersToStorage,
    loadFiltersFromStorage,
    setLocation,
  } = useDonationStore()
  const navigate = useNavigate()
  const results = useResults()

  // Load filters from storage when component mounts
  useEffect(() => {
    loadFiltersFromStorage()
  }, [loadFiltersFromStorage])

  const handleDeliveryMethodChange = (method: 'pickup' | 'dropoff') => {
    setDeliveryMethod(method, !formData.deliveryMethod[method])
  }

  const handleConsiderationChange = (consideration: 'resell') => {
    setConsideration(consideration, !formData.considerations[consideration])
  }

  const handleItemConditionChange = (condition: 'new' | 'used') => {
    setItemCondition(condition, !formData.itemCondition[condition])
  }

  const handleItemToggle = (itemName: string) => {
    toggleItem(itemName)
  }

  const handleCategoryToggle = (categoryType: string) => {
    toggleCategory(categoryType)
  }

  const handleSelectAllCategories = () => {
    const allCategories = categories.map((cat) => cat.Type)
    selectAllCategories(allCategories)
  }

  const handleClearItems = () => {
    clearItems()
  }

  const handleResetAll = () => {
    resetAll()
    // Clear stored filters and results
    sessionStorage.removeItem('donation-filters')
    sessionStorage.removeItem('filtered-results')
  }

  const handleContinueToResults = () => {
    // Save current filters to storage
    saveFiltersToStorage()
    // Store the current results before navigating
    if (results.length > 0) {
      sessionStorage.setItem('filtered-results', JSON.stringify(results))
    }
    navigate({ to: '/donate/results' })
  }

  return (
    <Container className="max-w-4xl mx-auto py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Headline size="lg" className="text-white">
            Tell us more about your items and preferences
          </Headline>
          <Button variant="outline" size="sm" onClick={handleResetAll} className="text-white/90 hover:text-white hover:border-white/60 cursor-pointer">
            Reset all selections
          </Button>
        </div>

        {/* Combined Preferences Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-card-foreground">Tell us about your donation preferences</CardTitle>
            <p className="text-sm text-muted-foreground text-red-500">* Required fields</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Delivery Method */}
            <div>
              <h3 className="text-base font-semibold text-card-foreground mb-3">
                How would you like to get your donation to the charity? <span className="text-red-500">*</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/20 transition-colors">
                  <Checkbox
                    id="pickup"
                    checked={formData.deliveryMethod.pickup}
                    onChange={() => handleDeliveryMethodChange('pickup')}
                    size="sm"
                  />
                  <label htmlFor="pickup" className="flex-1 cursor-pointer text-base text-card-foreground">
                    Charity will pickup my items
                  </label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/20 transition-colors">
                  <Checkbox
                    id="dropoff"
                    checked={formData.deliveryMethod.dropoff}
                    onChange={() => handleDeliveryMethodChange('dropoff')}
                    size="sm"
                  />
                  <label htmlFor="dropoff" className="flex-1 cursor-pointer text-base text-card-foreground">
                    I will drop-off items
                  </label>
                </div>
              </div>
            </div>

            {/* Considerations */}
            <div>
              <h3 className="text-base font-semibold text-card-foreground mb-3">
                Do you have any extra considerations? <span className="text-gray-500 text-sm">(Optional)</span>
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/20 transition-colors">
                  <Checkbox
                    id="resell"
                    checked={formData.considerations.resell}
                    onChange={() => handleConsiderationChange('resell')}
                    size="sm"
                  />
                  <label htmlFor="resell" className="flex-1 cursor-pointer text-base text-card-foreground">
                    Exclude organizations that resell items
                  </label>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-base font-semibold text-card-foreground mb-3">
                Where are you located? <span className="text-gray-500 text-sm">(Optional)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-card-foreground mb-2">
                    ZIP Code
                  </label>
                  <Input
                    id="zipCode"
                    type="text"
                    placeholder="Enter ZIP code"
                    value={formData.location.zipCode}
                    onChange={(e) => setLocation(e.target.value, formData.location.distance)}
                    className="w-full bg-white border-gray-300 text-gray-900 text-base"
                  />
                </div>
                <div>
                  <label htmlFor="distance" className="block text-sm font-medium text-card-foreground mb-2">
                    Distance (miles)
                  </label>
                  <Input
                    id="distance"
                    type="text"
                    placeholder="Enter distance in miles"
                    value={formData.location.distance || ''}
                    onChange={(e) => setLocation(formData.location.zipCode, parseInt(e.target.value))}
                    className="w-full bg-white border-gray-300 text-gray-900 text-base"
                  />
                </div>
              </div>
              <Text size="sm" className="text-gray-500 mt-2">
                Enter your ZIP code to find organizations within your specified distance range.
              </Text>
            </div>

            {/* Item Condition */}
            <div>
              <h3 className="text-base font-semibold text-card-foreground mb-3">
                Are your items new or used? <span className="text-red-500">*</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/20 transition-colors">
                  <Checkbox id="new" checked={formData.itemCondition.new} onChange={() => handleItemConditionChange('new')} size="sm" />
                  <label htmlFor="new" className="flex-1 cursor-pointer text-base text-card-foreground">
                    New items
                  </label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/20 transition-colors">
                  <Checkbox id="used" checked={formData.itemCondition.used} onChange={() => handleItemConditionChange('used')} size="sm" />
                  <label htmlFor="used" className="flex-1 cursor-pointer text-base text-card-foreground">
                    Used items
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Item Categories Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                What kinds of items do you have to donate? <span className="text-red-500">*</span>
              </CardTitle>
              <Button variant="link" size="sm" onClick={handleClearItems} className="text-card-foreground hover:text-card-foreground/80 cursor-pointer">
                Clear selections
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item.Id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/20 transition-colors">
                  <Checkbox
                    id={`item-${item.Id}`}
                    checked={formData.selectedItems.includes(item.Name)}
                    onChange={() => handleItemToggle(item.Name)}
                    size="sm"
                  />
                  <label htmlFor={`item-${item.Id}`} className="flex-1 cursor-pointer text-base text-card-foreground">
                    {item.Name}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Organization Categories Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                What kind of organization do you want to donate to? <span className="text-red-500">*</span>
              </CardTitle>
              <Button
                variant="link"
                size="sm"
                onClick={handleSelectAllCategories}
                className="text-card-foreground hover:text-card-foreground/80 cursor-pointer"
              >
                {formData.selectedCategories.length === categories.length ? 'Deselect all' : 'Select all'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category.Id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/20 transition-colors">
                  <Checkbox
                    id={`category-${category.Id}`}
                    checked={formData.selectedCategories.includes(category.Type)}
                    onChange={() => handleCategoryToggle(category.Type)}
                    size="sm"
                  />
                  <label htmlFor={`category-${category.Id}`} className="flex-1 cursor-pointer text-base text-card-foreground">
                    {category.Type}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button 
            size="xl" 
            disabled={!isFormValid()} 
            onClick={handleContinueToResults}
            className="px-12 py-4 text-lg disabled:cursor-default cursor-pointer bg-orange-500 hover:bg-orange-600"
          >
            Continue to results
          </Button>
        </div>
      </div>
    </Container>
  )
}
