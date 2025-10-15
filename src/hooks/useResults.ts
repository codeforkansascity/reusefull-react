import { orgItemsQuery } from '@/api/queries/orgItemsQuery'
import { orgsQuery } from '@/api/queries/orgsQuery'
import { categoriesQuery } from '@/api/queries/categoriesQuery'
import { useDonationStore } from '@/stores/donationStore'
import { useSuspenseQueries } from '@tanstack/react-query'
import { useMemo } from 'react'

export default function useResults() {
  const { formData } = useDonationStore()
  const [{ data: orgs }, { data: orgItems }, { data: categories }] = useSuspenseQueries({
    queries: [orgsQuery, orgItemsQuery, categoriesQuery],
  })

  console.log('=== DEBUGGING FILTERING ===')
  console.log('Total organizations in database:', orgs?.length)
  console.log('Total org items in database:', orgItems?.length)
  console.log('Total categories in database:', categories?.length)
  console.log('Form data:', JSON.stringify(formData, null, 2))
  console.log('Selected items:', formData.selectedItems)
  console.log('Selected categories:', formData.selectedCategories)
  console.log('Delivery method:', formData.deliveryMethod)
  console.log('Considerations:', formData.considerations)
  console.log('Item condition:', formData.itemCondition)
  
  // Debug sample data
  console.log('Sample org:', orgs?.[0])
  console.log('Sample orgItem:', orgItems?.[0])
  console.log('Sample category:', categories?.[0])

  return useMemo(() => {
    if (!orgs || !orgItems || !categories) return []

    // Step-by-step filtering approach
    let filteredOrgs = [...orgs] // Start with all organizations
    console.log(`Step 0: Starting with ${filteredOrgs.length} organizations`)

    // Step 1: Filter by delivery method (pickup or dropoff)
    filteredOrgs = filteredOrgs.filter((org) => {
      const deliveryMatch = (formData.deliveryMethod.pickup && org.Pickup) || (formData.deliveryMethod.dropoff && org.Dropoff)
      if (!deliveryMatch) {
        console.log(`❌ Filtered out org ${org.Id} (${org.Name}): pickup=${org.Pickup}, dropoff=${org.Dropoff}`)
      }
      return deliveryMatch
    })
    console.log(`Step 1: After delivery method filtering: ${filteredOrgs.length} organizations`)

    // Step 2: Filter by extra considerations (resell)
    filteredOrgs = filteredOrgs.filter((org) => {
      // If user doesn't want resell orgs, exclude them
      if (!formData.considerations.resell && org.Resell) {
        return false
      }
      
      return true
    })
    console.log(`Step 2: After considerations filtering: ${filteredOrgs.length} organizations`)

    // Step 3: Filter by item condition (new items only - match Go logic)
    filteredOrgs = filteredOrgs.filter((org) => {
      // If user selected new items, org must accept new items
      if (formData.itemCondition.new && !org.NewItems) {
        return false
      }
      
      // Note: Go code doesn't filter by used items (good_items), so we don't either
      return true
    })
    console.log(`Step 3: After item condition filtering: ${filteredOrgs.length} organizations`)

    // Step 4 & 5: Get charity IDs that match items and categories (like Go's itBits and ctBits)
    let itemTypeCharityIds = new Set()
    let charityTypeCharityIds = new Set()
    
    // Step 4: Get charity IDs that accept the selected item types (like Go's itBits)
    if (formData.selectedItems.length > 0) {
      console.log('🔍 Checking item matches...')
      console.log('Selected items:', formData.selectedItems)
      
      orgItems.forEach((orgItem) => {
        // Check if this orgItem matches any selected item
        const matches = formData.selectedItems.some((selectedItem) => {
          const selectedLower = selectedItem.toLowerCase()
          const itemNameLower = orgItem.ItemName.toLowerCase()
          const match = itemNameLower.includes(selectedLower) || selectedLower.includes(itemNameLower)
          
          if (match) {
            console.log(`✅ Item match: "${orgItem.ItemName}" matches "${selectedItem}" for org ${orgItem.CharityId}`)
          }
          
          return match
        })
        
        if (matches) {
          itemTypeCharityIds.add(orgItem.CharityId)
        }
      })
      
      console.log(`Item types matching charity IDs:`, Array.from(itemTypeCharityIds))
    }

    // Step 5: Category filtering via robust text matching against org fields (temporary until mapping endpoint)
    if (formData.selectedCategories.length > 0) {
      console.log('🔍 Checking category matches...')
      console.log('Selected categories:', formData.selectedCategories)

      // Build a keyword list per selected category (basic synonyms to improve recall)
      const categoryToKeywords = (category: string) => {
        const c = category.toLowerCase()
        if (c.includes('job') || c.includes('employ')) {
          return ['job', 'jobs', 'employment', 'employ', 'employer', 'work', 'workforce', 'career', 'careers', 'training', 'job training', 'career training', 'skill', 'skills', 'resume', 'apprentice', 'apprenticeship', 'intern', 'internship']
        }
        if (c.includes('college') || c.includes('universit')) {
          return ['college', 'university', 'universities', 'campus', 'higher education', 'students']
        }
        // default: use the raw category text
        return [category]
      }

      const keywords = formData.selectedCategories.flatMap(categoryToKeywords).map((k) => k.toLowerCase())

      orgs.forEach((org) => {
        const blob = `${org.Name || ''} ${org.Mission || ''} ${org.Description || ''}`.toLowerCase()
        const matches = keywords.some((kw) => blob.includes(kw))
        if (matches) {
          charityTypeCharityIds.add(org.Id)
        }
      })

      console.log('Category keyword list used:', keywords)
      console.log('Charity types matching charity IDs:', Array.from(charityTypeCharityIds))
    }
    
    // Step 6: Combine item types and charity types (like Go's itBits.And(ctBits))
    let finalCharityIds = new Set()
    
    if (itemTypeCharityIds.size > 0 && charityTypeCharityIds.size > 0) {
      // Both item types and charity types selected - combine them (AND operation)
      finalCharityIds = new Set([...itemTypeCharityIds].filter(id => charityTypeCharityIds.has(id)))
      console.log(`Combining item types (${itemTypeCharityIds.size}) with charity types (${charityTypeCharityIds.size})`)
      console.log(`Final combined charity IDs:`, Array.from(finalCharityIds))
    } else if (itemTypeCharityIds.size > 0) {
      // Only item types selected
      finalCharityIds = itemTypeCharityIds
      console.log(`Using only item types:`, Array.from(finalCharityIds))
    } else if (charityTypeCharityIds.size > 0) {
      // Only charity types selected
      finalCharityIds = charityTypeCharityIds
      console.log(`Using only charity types:`, Array.from(finalCharityIds))
    }
    
    // Step 7: Apply the final filtering based on combined item types and charity types
    // Gate on either items or categories now that category filtering is enabled
    const userSelectedSomething = formData.selectedItems.length > 0 || formData.selectedCategories.length > 0
    if (userSelectedSomething) {
      // If the user selected items/categories but there are no matches, return [] (match Go behavior)
      if (finalCharityIds.size === 0) {
        console.log('No item/category matches for current selections → returning 0 orgs')
        return []
      }

      filteredOrgs = filteredOrgs.filter((org) => finalCharityIds.has(org.Id))
      console.log(`Step 4&5: After combined items/categories filtering: ${filteredOrgs.length} organizations`)
    }

    return filteredOrgs
  }, [orgs, orgItems, categories, formData])
}
