import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type BudgetSize = '$0-5k' | '$6-25k' | '$26-100k' | '>$100k'

export type CharitySignupData = {
  // Step 1
  organizationName?: string
  contactName?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  // Step 2
  website?: string
  budgetSize?: BudgetSize
  acceptDropOffs?: boolean
  pickupDonations?: boolean
  faithBased?: boolean
  resellItems?: boolean
  taxId?: string
  logoUrl?: string
  categories?: string[]
  otherCategory?: string
  mission?: string
  description?: string
  // Step 3
  acceptedItemTypes?: string[]
  amazonWishlistUrl?: string
  cashDonationsUrl?: string
  volunteerSignupUrl?: string
}

type Store = {
  data: CharitySignupData
  update(values: Partial<CharitySignupData>): void
  reset(): void
}

export const useCharitySignupStore = create<Store>()(
  persist(
    (set) => ({
      data: {},
      update: (values) => set((s) => ({ data: { ...s.data, ...values } })),
      reset: () => set({ data: {} }),
    }),
    { name: 'charity-signup' }
  )
)


