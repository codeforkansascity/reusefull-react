import { orgItemsQuery } from '@/api/queries/orgItemsQuery'
import { orgsQuery } from '@/api/queries/orgsQuery'
import { useDonationStore } from '@/stores/donationStore'
import { useSuspenseQueries } from '@tanstack/react-query'
import { useMemo } from 'react'

export default function useResults() {
  const { formData } = useDonationStore()
  const [{ data: orgs }, { data: orgItems }] = useSuspenseQueries({
    queries: [orgsQuery, orgItemsQuery],
  })

  console.log({ orgs, orgItems, formData })

  return useMemo(() => {
    if (!orgs || !orgItems) return []

    // Filter organizations based on form data criteria
    const filteredOrgs = orgs.filter((org) => {
      // Check delivery method requirements - at least one must match
      const deliveryMatch = (formData.deliveryMethod.pickup && org.Pickup) || (formData.deliveryMethod.dropoff && org.Dropoff)

      if (!deliveryMatch) return false

      // Check consideration requirements - only apply if user selected them
      if (formData.considerations.resell && !org.Resell) return false
      if (formData.considerations.faithBased && !org.Faith) return false

      // Check item condition requirements - only apply if user selected them
      const itemConditionMatch =
        (!formData.itemCondition.new && !formData.itemCondition.used) || // If neither selected, skip this check
        (formData.itemCondition.new && org.NewItems) ||
        (formData.itemCondition.used && org.GoodItems)

      if (!itemConditionMatch) return false

      // Check if organization has any of the selected items - only apply if items are selected
      if (formData.selectedItems.length > 0) {
        const hasSelectedItems = orgItems.some((orgItem) => {
          if (orgItem.CharityId !== org.Id) return false

          // Check if any selected item matches (partial match for broader categories)
          return formData.selectedItems.some((selectedItem) => {
            const selectedLower = selectedItem.toLowerCase()
            const itemNameLower = orgItem.ItemName.toLowerCase()

            // Exact match or partial match for broader categories
            return itemNameLower.includes(selectedLower) || selectedLower.includes(itemNameLower.split(' - ')[0])
          })
        })

        if (!hasSelectedItems) return false
      }

      return true
    })

    return filteredOrgs
  }, [orgs, orgItems, formData])
}
