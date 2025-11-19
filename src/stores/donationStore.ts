import { create } from 'zustand'

export interface DonationFormData {
  deliveryMethod: {
    pickup: boolean
    dropoff: boolean
  }
  considerations: {
    resell: boolean
  }
  itemCondition: {
    new: boolean
    used: boolean
  }
  selectedItems: string[]
  selectedCategories: string[]
  location: {
    zipCode: string
    distance: number // in miles
  }
}

interface DonationStore {
  formData: DonationFormData
  setDeliveryMethod: (method: 'pickup' | 'dropoff', value: boolean) => void
  setConsideration: (consideration: 'resell', value: boolean) => void
  setItemCondition: (condition: 'new' | 'used', value: boolean) => void
  toggleItem: (itemName: string) => void
  toggleCategory: (categoryType: string) => void
  selectAllCategories: (categories: string[]) => void
  clearItems: () => void
  resetAll: () => void
  isFormValid: () => boolean
  setFormData: (data: Partial<DonationFormData>) => void
  saveFiltersToStorage: () => void
  loadFiltersFromStorage: () => void
  setLocation: (zipCode: string, distance: number) => void
}

const initialFormData: DonationFormData = {
  deliveryMethod: {
    pickup: false,
    dropoff: false,
  },
  considerations: {
    resell: false,
  },
  itemCondition: {
    new: false,
    used: true,
  },
  selectedItems: [],
  selectedCategories: [],
  location: {
    zipCode: '',
    distance: 0,
  },
}

export const useDonationStore = create<DonationStore>((set, get) => ({
  formData: initialFormData,

  setDeliveryMethod: (method, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        deliveryMethod: {
          ...state.formData.deliveryMethod,
          [method]: value,
        },
      },
    })),

  setConsideration: (consideration, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        considerations: {
          ...state.formData.considerations,
          [consideration]: value,
        },
      },
    })),

  setItemCondition: (condition, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        itemCondition: {
          ...state.formData.itemCondition,
          [condition]: value,
        },
      },
    })),

  toggleItem: (itemName) =>
    set((state) => ({
      formData: {
        ...state.formData,
        selectedItems: state.formData.selectedItems.includes(itemName)
          ? state.formData.selectedItems.filter((item) => item !== itemName)
          : [...state.formData.selectedItems, itemName],
      },
    })),

  toggleCategory: (categoryType) =>
    set((state) => ({
      formData: {
        ...state.formData,
        selectedCategories: state.formData.selectedCategories.includes(categoryType)
          ? state.formData.selectedCategories.filter((cat) => cat !== categoryType)
          : [...state.formData.selectedCategories, categoryType],
      },
    })),

  selectAllCategories: (categories) =>
    set((state) => ({
      formData: {
        ...state.formData,
        selectedCategories: state.formData.selectedCategories.length === categories.length ? [] : categories,
      },
    })),

  clearItems: () =>
    set((state) => ({
      formData: {
        ...state.formData,
        selectedItems: [],
      },
    })),

  resetAll: () =>
    set({
      formData: initialFormData,
    }),

  isFormValid: () => {
    const { formData } = get()
    return (
      (formData.deliveryMethod.pickup || formData.deliveryMethod.dropoff) &&
      (formData.itemCondition.new || formData.itemCondition.used) &&
      formData.selectedItems.length > 0 &&
      formData.selectedCategories.length > 0
    )
  },

  setFormData: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        ...data,
      },
    })),

  saveFiltersToStorage: () => {
    const { formData } = get()
    sessionStorage.setItem('donation-filters', JSON.stringify(formData))
  },

  loadFiltersFromStorage: () => {
    const storedFilters = sessionStorage.getItem('donation-filters')
    if (storedFilters) {
      try {
        const parsedFilters = JSON.parse(storedFilters)
        set({ formData: parsedFilters })
      } catch (error) {
        console.error('Error parsing stored filters:', error)
        sessionStorage.removeItem('donation-filters')
      }
    }
  },

  setLocation: (zipCode, distance) =>
    set((state) => ({
      formData: {
        ...state.formData,
        location: {
          zipCode,
          distance,
        },
      },
    })),
}))
