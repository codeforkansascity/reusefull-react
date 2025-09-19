import { useState } from 'react'
import { Button, Card, CardContent, CardHeader, CardTitle, Checkbox, Headline, Text, Container } from '@/components/ui'

interface DonationFormData {
  deliveryMethod: {
    pickup: boolean
    dropoff: boolean
  }
  considerations: {
    resell: boolean
    faithBased: boolean
  }
  itemCondition: {
    new: boolean
    used: boolean
  }
  selectedItems: string[]
  selectedCategories: string[]
}

interface DonationFormProps {
  items: Array<{ Id: number; Name: string }>
  categories: Array<{ Id: number; Type: string }>
}

export function DonationForm({ items, categories }: DonationFormProps) {
  const [formData, setFormData] = useState<DonationFormData>({
    deliveryMethod: {
      pickup: false,
      dropoff: false,
    },
    considerations: {
      resell: false,
      faithBased: false,
    },
    itemCondition: {
      new: false,
      used: false,
    },
    selectedItems: [],
    selectedCategories: [],
  })

  const handleDeliveryMethodChange = (method: 'pickup' | 'dropoff') => {
    setFormData((prev) => ({
      ...prev,
      deliveryMethod: {
        ...prev.deliveryMethod,
        [method]: !prev.deliveryMethod[method],
      },
    }))
  }

  const handleConsiderationChange = (consideration: 'resell' | 'faithBased') => {
    setFormData((prev) => ({
      ...prev,
      considerations: {
        ...prev.considerations,
        [consideration]: !prev.considerations[consideration],
      },
    }))
  }

  const handleItemConditionChange = (condition: 'new' | 'used') => {
    setFormData((prev) => ({
      ...prev,
      itemCondition: {
        ...prev.itemCondition,
        [condition]: !prev.itemCondition[condition],
      },
    }))
  }

  const handleItemToggle = (itemName: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedItems: prev.selectedItems.includes(itemName)
        ? prev.selectedItems.filter((item) => item !== itemName)
        : [...prev.selectedItems, itemName],
    }))
  }

  const handleCategoryToggle = (categoryType: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(categoryType)
        ? prev.selectedCategories.filter((cat) => cat !== categoryType)
        : [...prev.selectedCategories, categoryType],
    }))
  }

  const handleSelectAllCategories = () => {
    const allCategories = categories.map((cat) => cat.Type)
    setFormData((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.length === allCategories.length ? [] : allCategories,
    }))
  }

  const handleClearItems = () => {
    setFormData((prev) => ({
      ...prev,
      selectedItems: [],
    }))
  }

  const handleResetAll = () => {
    setFormData({
      deliveryMethod: { pickup: false, dropoff: false },
      considerations: { resell: false, faithBased: false },
      itemCondition: { new: false, used: false },
      selectedItems: [],
      selectedCategories: [],
    })
  }

  const isFormValid = () => {
    return (
      (formData.deliveryMethod.pickup || formData.deliveryMethod.dropoff) &&
      (formData.itemCondition.new || formData.itemCondition.used) &&
      formData.selectedItems.length > 0 &&
      formData.selectedCategories.length > 0
    )
  }

  const handleSubmit = () => {
    if (isFormValid()) {
      // Store form data in sessionStorage for the results page
      sessionStorage.setItem('donationFormData', JSON.stringify(formData))
      // Navigate to results page
      window.location.href = '/donate/results'
    }
  }

  return (
    <Container className="max-w-4xl mx-auto py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Headline size="xl" className="text-foreground">
            Tell us more about your items and preferences.
          </Headline>
          <Button variant="outline" size="sm" onClick={handleResetAll} className="text-muted-foreground hover:text-foreground">
            Reset all selections
          </Button>
        </div>

        {/* Delivery Method Section */}
        <Card>
          <CardHeader>
            <CardTitle>How would you like to get your donation to the charity?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox id="pickup" checked={formData.deliveryMethod.pickup} onChange={() => handleDeliveryMethodChange('pickup')} />
                <label htmlFor="pickup" className="flex-1 cursor-pointer">
                  <Text className="font-medium">Charity will pickup my items</Text>
                </label>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox id="dropoff" checked={formData.deliveryMethod.dropoff} onChange={() => handleDeliveryMethodChange('dropoff')} />
                <label htmlFor="dropoff" className="flex-1 cursor-pointer">
                  <Text className="font-medium">I will drop-off items</Text>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Considerations Section */}
        <Card>
          <CardHeader>
            <CardTitle>Do you have any extra considerations?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox id="resell" checked={formData.considerations.resell} onChange={() => handleConsiderationChange('resell')} />
                <label htmlFor="resell" className="flex-1 cursor-pointer">
                  <Text className="font-medium">Include organizations that resell items</Text>
                </label>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="faithBased"
                  checked={formData.considerations.faithBased}
                  onChange={() => handleConsiderationChange('faithBased')}
                />
                <label htmlFor="faithBased" className="flex-1 cursor-pointer">
                  <Text className="font-medium">Include faith-based organizations</Text>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Item Condition Section */}
        <Card>
          <CardHeader>
            <CardTitle>Are your items new or used?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox id="new" checked={formData.itemCondition.new} onChange={() => handleItemConditionChange('new')} />
                <label htmlFor="new" className="flex-1 cursor-pointer">
                  <Text className="font-medium">New items</Text>
                </label>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox id="used" checked={formData.itemCondition.used} onChange={() => handleItemConditionChange('used')} />
                <label htmlFor="used" className="flex-1 cursor-pointer">
                  <Text className="font-medium">Used items</Text>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Item Categories Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>What kinds of items do you have to donate?</CardTitle>
              <Button variant="link" size="sm" onClick={handleClearItems} className="text-muted-foreground hover:text-foreground">
                Clear selections
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item.Id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id={`item-${item.Id}`}
                    checked={formData.selectedItems.includes(item.Name)}
                    onChange={() => handleItemToggle(item.Name)}
                  />
                  <label htmlFor={`item-${item.Id}`} className="flex-1 cursor-pointer">
                    <Text className="text-sm">{item.Name}</Text>
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
              <CardTitle>What kind of organization do you want to donate to?</CardTitle>
              <Button variant="link" size="sm" onClick={handleSelectAllCategories} className="text-muted-foreground hover:text-foreground">
                {formData.selectedCategories.length === categories.length ? 'Deselect all' : 'Select all'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category.Id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id={`category-${category.Id}`}
                    checked={formData.selectedCategories.includes(category.Type)}
                    onChange={() => handleCategoryToggle(category.Type)}
                  />
                  <label htmlFor={`category-${category.Id}`} className="flex-1 cursor-pointer">
                    <Text className="text-sm">{category.Type}</Text>
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <Button size="xl" onClick={handleSubmit} disabled={!isFormValid()} className="px-12 py-4 text-lg">
            Continue to results
          </Button>
        </div>
      </div>
    </Container>
  )
}
