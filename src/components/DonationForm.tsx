import { Button, Card, CardContent, CardHeader, CardTitle, Checkbox, Headline, Container } from '@/components/ui'
import { useDonationStore } from '@/stores/donationStore'
import { Link } from '@tanstack/react-router'

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
  } = useDonationStore()

  const handleDeliveryMethodChange = (method: 'pickup' | 'dropoff') => {
    setDeliveryMethod(method, !formData.deliveryMethod[method])
  }

  const handleConsiderationChange = (consideration: 'resell' | 'faithBased') => {
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
  }

  return (
    <Container className="max-w-4xl mx-auto py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Headline size="xl" className="text-white">
            Tell us more about your items and preferences.
          </Headline>
          <Button variant="outline" size="sm" onClick={handleResetAll} className="text-white/90 hover:text-white hover:border-white/60">
            Reset all selections
          </Button>
        </div>

        {/* Combined Preferences Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-card-foreground">Tell us about your donation preferences</CardTitle>
            <p className="text-sm text-muted-foreground">* Required fields</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Delivery Method */}
            <div>
              <h3 className="text-sm font-semibold text-card-foreground mb-3">
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
                  <label htmlFor="pickup" className="flex-1 cursor-pointer text-sm text-card-foreground">
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
                  <label htmlFor="dropoff" className="flex-1 cursor-pointer text-sm text-card-foreground">
                    I will drop-off items
                  </label>
                </div>
              </div>
            </div>

            {/* Considerations */}
            <div>
              <h3 className="text-sm font-semibold text-card-foreground mb-3">
                Do you have any extra considerations? <span className="text-gray-500 text-xs">(Optional)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/20 transition-colors">
                  <Checkbox
                    id="resell"
                    checked={formData.considerations.resell}
                    onChange={() => handleConsiderationChange('resell')}
                    size="sm"
                  />
                  <label htmlFor="resell" className="flex-1 cursor-pointer text-sm text-card-foreground">
                    Include organizations that resell items
                  </label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/20 transition-colors">
                  <Checkbox
                    id="faithBased"
                    checked={formData.considerations.faithBased}
                    onChange={() => handleConsiderationChange('faithBased')}
                    size="sm"
                  />
                  <label htmlFor="faithBased" className="flex-1 cursor-pointer text-sm text-card-foreground">
                    Include faith-based organizations
                  </label>
                </div>
              </div>
            </div>

            {/* Item Condition */}
            <div>
              <h3 className="text-sm font-semibold text-card-foreground mb-3">
                Are your items new or used? <span className="text-red-500">*</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/20 transition-colors">
                  <Checkbox id="new" checked={formData.itemCondition.new} onChange={() => handleItemConditionChange('new')} size="sm" />
                  <label htmlFor="new" className="flex-1 cursor-pointer text-sm text-card-foreground">
                    New items
                  </label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/20 transition-colors">
                  <Checkbox id="used" checked={formData.itemCondition.used} onChange={() => handleItemConditionChange('used')} size="sm" />
                  <label htmlFor="used" className="flex-1 cursor-pointer text-sm text-card-foreground">
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
              <Button variant="link" size="sm" onClick={handleClearItems} className="text-card-foreground hover:text-card-foreground/80">
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
                  <label htmlFor={`item-${item.Id}`} className="flex-1 cursor-pointer text-sm text-card-foreground">
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
                className="text-card-foreground hover:text-card-foreground/80"
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
                  <label htmlFor={`category-${category.Id}`} className="flex-1 cursor-pointer text-sm text-card-foreground">
                    {category.Type}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Link to="/donate/results" disabled={!isFormValid()} className="">
            <Button size="xl" disabled={!isFormValid()} className="px-12 py-4 text-lg disabled:cursor-default cursor-pointer">
              Continue to results
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  )
}
