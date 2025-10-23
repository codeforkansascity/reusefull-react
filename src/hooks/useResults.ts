import { orgItemsQuery } from '@/api/queries/orgItemsQuery'
import { orgsQuery } from '@/api/queries/orgsQuery'
import { categoriesQuery } from '@/api/queries/categoriesQuery'
import { orgCharityTypesQuery } from '@/api/queries/orgCharityTypesQuery'
import { useDonationStore } from '@/stores/donationStore'
import { useSuspenseQueries } from '@tanstack/react-query'
import { useMemo, useState, useEffect } from 'react'
import { isOrgWithinDistance } from '@/utils/geocoding'

export default function useResults() {
  const { formData } = useDonationStore()
  const [{ data: orgs }, { data: orgItems }, { data: categories }, { data: orgCharityTypes }] = useSuspenseQueries({
    queries: [orgsQuery, orgItemsQuery, categoriesQuery, orgCharityTypesQuery],
  })


  const [finalResults, setFinalResults] = useState([])
  const [isFiltering, setIsFiltering] = useState(false)

  // Complete filtering logic with location filtering
  useEffect(() => {
    if (!orgs || !orgItems || !categories || !orgCharityTypes) {
      setFinalResults([])
      return
    }

    const performFiltering = async () => {
      setIsFiltering(true)
      console.log('=== COMPLETE FILTERING LOGIC ===')
      console.log('Form data:', JSON.stringify(formData, null, 2))
      console.log('Total orgs:', orgs.length)
      console.log('Total orgItems:', orgItems.length)
      console.log('Total categories:', categories.length)
      console.log('Total orgCharityTypes:', orgCharityTypes.length)

      // STEP 0: LOCATION FILTERING (FIRST - most restrictive)
      let currentFilteredOrgs = [...orgs]
      
      if (formData.location.zipCode) {
        console.log('STEP 0 - Location Filtering: Checking ZIP code and distance...')
        
        const locationFilteredResults = []
        
      for (const org of orgs) {
        if (org.Lat && org.Lng) {
          console.log(`Checking org: ${org.Name} at coordinates (${org.Lat}, ${org.Lng})`)
          
          const isWithinDistance = await isOrgWithinDistance(
            org.Lat,                    // Real Lat from API endpoint
            org.Lng,                    // Real Lng from API endpoint
            formData.location.zipCode,
            formData.location.distance
          )
          
          if (isWithinDistance) {
            locationFilteredResults.push(org)
            console.log(`✅ ${org.Name} is within distance`)
          } else {
            console.log(`❌ ${org.Name} is too far`)
          }
        } else {
          console.log(`⚠️ ${org.Name} has no coordinates (Lat: ${org.Lat}, Lng: ${org.Lng})`)
        }
      }
        
        currentFilteredOrgs = locationFilteredResults
        console.log(`STEP 0 - Location Filtering: ${currentFilteredOrgs.length} orgs within ${formData.location.distance} miles of ${formData.location.zipCode}`)
      }
      
      console.log(`Starting with ${currentFilteredOrgs.length} organizations`)

    // STEP 1: DELIVERY METHOD FILTERING
    // Check both pickup and dropoff options
    currentFilteredOrgs = currentFilteredOrgs.filter((org) => {
      const pickupMatch = formData.deliveryMethod.pickup && org.Pickup
      const dropoffMatch = formData.deliveryMethod.dropoff && org.Dropoff
      return pickupMatch || dropoffMatch
    })
    console.log(`STEP 1 - Delivery Method: ${currentFilteredOrgs.length} orgs`)

    // STEP 2: RESELL CONSIDERATIONS FILTERING
    // If user selected "exclude resell orgs", remove orgs with Resell: true
    currentFilteredOrgs = currentFilteredOrgs.filter((org) => {
      if (formData.considerations.resell && org.Resell) {
        return false // Exclude this org
      }
      return true // Include this org
    })
    console.log(`STEP 2 - Resell Considerations: ${currentFilteredOrgs.length} orgs`)

    // STEP 3: ITEM CONDITION FILTERING
    // Check both new and used options
    currentFilteredOrgs = currentFilteredOrgs.filter((org) => {
      const newItemsMatch = formData.itemCondition.new && org.NewItems
      const usedItemsMatch = formData.itemCondition.used && org.GoodItems
      return newItemsMatch || usedItemsMatch
    })
    console.log(`STEP 3 - Item Condition: ${currentFilteredOrgs.length} orgs`)

    // STEP 4: ITEM TYPES FILTERING
    // Use orgItems endpoint to find orgs that accept selected items
    if (formData.selectedItems.length > 0) {
      console.log('STEP 4 - Item Types: Checking', formData.selectedItems)
      console.log('Sample orgItem:', orgItems[0])
      
      // Get charity IDs that accept the selected items
      const itemTypeCharityIds = new Set<number>()
      orgItems.forEach((orgItem) => {
        const itemMatches = formData.selectedItems.some((selectedItem) => {
          const selectedLower = selectedItem.toLowerCase()
          const itemNameLower = orgItem.ItemName.toLowerCase()
          const match = itemNameLower.includes(selectedLower) || selectedLower.includes(itemNameLower)
          
          if (match) {
            console.log(`✅ Item match: "${orgItem.ItemName}" matches "${selectedItem}" for charity ${orgItem.CharityId} (${orgItem.CharityName})`)
          }
          
          return match
        })
        
        if (itemMatches) {
          itemTypeCharityIds.add(orgItem.CharityId)
        }
      })
      
      console.log(`STEP 4 - Item Types: Found ${itemTypeCharityIds.size} matching charity IDs:`, Array.from(itemTypeCharityIds))
      
      // Filter organizations to only include those that accept the selected items
      currentFilteredOrgs = currentFilteredOrgs.filter((org) => itemTypeCharityIds.has(org.Id))
      console.log(`STEP 4 - Item Types: ${currentFilteredOrgs.length} orgs after item filtering`)
    }

    // STEP 5: CATEGORY TYPES FILTERING
    // Use orgCharityTypes endpoint to find orgs that match selected categories
    if (formData.selectedCategories.length > 0) {
      console.log('STEP 5 - Category Types: Checking', formData.selectedCategories)
      
      // Map selected category names to their TypeIds
      const selectedTypeIds = new Set<number>()
      formData.selectedCategories.forEach((selectedCategory) => {
        const categoryMatch = categories.find(cat => 
          cat.Type.toLowerCase() === selectedCategory.toLowerCase()
        )
        if (categoryMatch) {
          selectedTypeIds.add(categoryMatch.Id)
        }
      })
      
      console.log(`STEP 5 - Category Types: Mapped to TypeIds:`, Array.from(selectedTypeIds))
      
      // Get charity IDs that match the selected categories
      const charityTypeCharityIds = new Set<number>()
      orgCharityTypes.forEach((mapping) => {
        if (selectedTypeIds.has(mapping.TypeId)) {
          charityTypeCharityIds.add(mapping.CharityId)
        }
      })
      
      console.log(`STEP 5 - Category Types: Found ${charityTypeCharityIds.size} matching charity IDs`)
      
      // Filter organizations to only include those that match the selected categories
      currentFilteredOrgs = currentFilteredOrgs.filter((org) => charityTypeCharityIds.has(org.Id))
      console.log(`STEP 5 - Category Types: ${currentFilteredOrgs.length} orgs after category filtering`)
    }

      console.log('=== FINAL RESULTS ===')
      console.log('Final orgs:', currentFilteredOrgs.map(org => ({ id: org.Id, name: org.Name })))
      
      setFinalResults(currentFilteredOrgs)
      setIsFiltering(false)
    }

    performFiltering()
  }, [orgs, orgItems, categories, orgCharityTypes, formData])

  return finalResults
}
