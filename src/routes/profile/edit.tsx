import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCharitySignupStore } from '@/stores/charitySignupStore'

type ProfileForm = {
  // Step 1
  organizationName: string
  contactName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  // Step 2
  website: string
  budgetSize: '$0-5k' | '$6-25k' | '$26-100k' | '>$100k'
  acceptDropOffs: boolean
  pickupDonations: boolean
  faithBased: boolean
  resellItems: boolean
  taxId: string
  logoUrl: string
  categories: string[]
  otherCategory: string
  mission: string
  description: string
  // Step 3
  acceptedItemTypes: string[]
  amazonWishlistUrl: string
  cashDonationsUrl: string
  volunteerSignupUrl: string
}

export const Route = createFileRoute('/profile/edit')({
  component: EditProfileComponent,
})

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-gray-700 text-sm font-medium">{children}</span>
}

const BUDGET_SIZES: ProfileForm['budgetSize'][] = ['$0-5k', '$6-25k', '$26-100k', '>$100k']
const CATEGORY_OPTIONS = [
  'Animals & Pets',
  'Arts & Music',
  'Children & Youth',
  'College & Universities',
  'Domestic Violence',
  'Education & Literacy',
  'Environment',
  'Food & Nutrition',
  'Health & Substance Abuse',
  'Healthcare',
  'Homelessness & Housing',
  'Immigrants & Refugees',
  'Job Training & Employment',
  'Media & Journalism',
  'Re-entry & Criminal Justice',
  'Seniors & Caregivers',
  'Sports & Recreation',
  'Other',
] as const

const ITEM_TYPES = [
  'Appliances - Large',
  'Appliances - Small',
  'Arts & Crafts Supplies',
  'Baby Supplies',
  'Bicycles',
  'Books & Magazines - Adult',
  "Books & Magazines - Children's",
  'Building Materials',
  "Clothing - Children's",
  "Clothing - Men's",
  "Clothing - Women's",
  'Computers & Technology',
  'Electronics',
  'Furniture - Bedroom',
  'Furniture - Dining Room',
  'Furniture - Living Room',
  'Furniture - Office',
  'Gardening Equipment',
  'Home Decor',
  'Hygiene Products',
  'Kitchenware',
  'Linens',
  'Mattresses',
  'Medical Supplies and Equipment',
  'Music - Records, CDs, Tapes',
  'Musical Instruments',
  'Office Supplies',
  'Pet Supplies',
  'School Supplies',
  'Scrap Metal',
  'Sports Equipment',
  'Tools',
  'Toys, Games & Puzzles',
  'Vehicles & Boats',
]

export default function EditProfileComponent() {
  const { isAuthenticated, isLoading, user, getAccessTokenSilently, loginWithRedirect } = useAuth0()
  const { update } = useCharitySignupStore()
  const navigate = useNavigate()
  const { register, handleSubmit, reset, setValue, watch } = useForm<ProfileForm>({
    defaultValues: {
      organizationName: '',
      contactName: '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      website: '',
      budgetSize: '$0-5k',
      acceptDropOffs: false,
      pickupDonations: false,
      faithBased: false,
      resellItems: false,
      taxId: '',
      logoUrl: '',
      categories: [],
      otherCategory: '',
      mission: '',
      description: '',
      acceptedItemTypes: [],
      amazonWishlistUrl: '',
      cashDonationsUrl: '',
      volunteerSignupUrl: '',
    },
  })

  useEffect(() => {
    (async () => {
      if (isLoading || !isAuthenticated) return
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
        })
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        const draft = data?.draft?.charity || {}
        reset({
          organizationName: draft.name || '',
          contactName: draft.contact_name || user?.name || '',
          email: draft.email || user?.email || '',
          phone: draft.phone || '',
          address: draft.address || '',
          city: draft.city || '',
          state: draft.state || '',
          zip: draft.zip_code || '',
          website: draft.link_website || '',
          budgetSize: (draft.budgetSize as any) || '$0-5k',
          acceptDropOffs: Boolean(draft.dropoff),
          pickupDonations: Boolean(draft.pickup),
          faithBased: Boolean(draft.faith),
          resellItems: Boolean(draft.resell),
          taxId: draft.taxid || '',
          logoUrl: draft.logo_url || '',
          categories: Array.isArray(data?.draft?.categories) ? data.draft.categories : [],
          otherCategory: '',
          mission: draft.mission || '',
          description: draft.description || '',
          acceptedItemTypes: Array.isArray(data?.draft?.acceptedItemTypes) ? data.draft.acceptedItemTypes : [],
          amazonWishlistUrl: draft.link_wishlist || '',
          cashDonationsUrl: draft.link_donate_cash || '',
          volunteerSignupUrl: draft.link_volunteer || '',
        })
      } catch {
        // ignore load errors for now
      }
    })()
  }, [isLoading, isAuthenticated, getAccessTokenSilently, reset, user])

  if (!isLoading && !isAuthenticated) {
    loginWithRedirect()
    return null
  }

  async function onSave(values: ProfileForm) {
    update(values as any)
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
      })
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/charity-signup/draft`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...(values as any) }),
      })
      setShowSuccess(true)
      window.clearTimeout(hideTimerRef)
      hideTimerRef = window.setTimeout(() => setShowSuccess(false), 3000)
      // Redirect shortly after showing toast
      window.setTimeout(() => {
        navigate({ to: '/donate' })
      }, 800)
    } catch {
      alert('Failed to save changes')
    }
  }

  const selectedBudget = watch('budgetSize')
  const accepted = watch('acceptedItemTypes') || []
  const [showSuccess, setShowSuccess] = useState(false)
  let hideTimerRef = 0 as unknown as number

  return (
    <div className="bg-white text-gray-900">
      {/* Success toast */}
      <div
        className={`fixed top-6 right-6 z-[1000] transition-all duration-300 ${
          showSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="flex items-start gap-3 rounded-lg bg-green-600 text-white shadow-lg px-4 py-3 min-w-[280px]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 flex-none" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293A1 1 0 006.293 10.707l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <div className="font-semibold">Profile updated</div>
            <div className="text-green-100 text-sm">Your changes were saved successfully.</div>
          </div>
          <button
            type="button"
            onClick={() => setShowSuccess(false)}
            className="ml-2 rounded-md bg-green-700/30 hover:bg-green-700/50 px-2 py-1 text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold mb-2">Edit Profile</h1>
        <p className="text-gray-600 mb-8">Update your charity profile details</p>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit(onSave)}>
          {/* Step 1 fields */}
          <label className="block">
            <Label>Organization Name</Label>
            <input {...register('organizationName')} className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </label>
          <label className="block">
            <Label>Contact Name</Label>
            <input {...register('contactName')} className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </label>

          <label className="block">
            <Label>Email</Label>
            <input {...register('email')} className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </label>
          <label className="block">
            <Label>Phone</Label>
            <input {...register('phone')} className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </label>

          <label className="block md:col-span-2">
            <Label>Address</Label>
            <input {...register('address')} className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </label>
          <label className="block">
            <Label>City</Label>
            <input {...register('city')} className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </label>
          <label className="block">
            <Label>State</Label>
            <input {...register('state')} className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </label>
          <label className="block">
            <Label>Zip</Label>
            <input {...register('zip')} className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </label>

          <label className="block md:col-span-2">
            <Label>Website</Label>
            <input {...register('website')} className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </label>

          {/* Step 2 subset - budget size */}
          <div className="md:col-span-2">
            <div className="text-gray-700 text-sm font-medium mb-2">Budget Size</div>
            <div className="flex gap-2 flex-wrap">
              {BUDGET_SIZES.map((size) => (
                <label key={size} className={`px-3 py-2 border rounded-md cursor-pointer shadow-sm ${selectedBudget === size ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700'}`}>
                  <input type="radio" value={size} {...register('budgetSize', { required: true })} className="hidden" />
                  {size}
                </label>
              ))}
            </div>
          </div>

          {/* Step 2 subset - pickup/dropoff etc */}
          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="inline-flex items-center gap-2 text-gray-700"><input type="checkbox" {...register('acceptDropOffs')} /> We accept drop-offs</label>
            <label className="inline-flex items-center gap-2 text-gray-700"><input type="checkbox" {...register('pickupDonations')} /> We pick up donations</label>
            <label className="inline-flex items-center gap-2 text-gray-700"><input type="checkbox" {...register('faithBased')} /> Faith-based charity</label>
            <label className="inline-flex items-center gap-2 text-gray-700"><input type="checkbox" {...register('resellItems')} /> We resell items</label>
          </div>

          {/* Step 2 subset */}
          <label className="block">
            <Label>Tax ID</Label>
            <input {...register('taxId')} className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </label>
          <label className="block">
            <Label>Logo</Label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                try {
                  const token = await getAccessTokenSilently({
                    authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
                  })
                  const presignRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/uploads/logo-url`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ fileName: file.name, contentType: file.type }),
                  })
                  if (!presignRes.ok) throw new Error('Failed to obtain upload URL')
                  const { uploadUrl, publicUrl } = await presignRes.json()
                  const putRes = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file })
                  if (!putRes.ok) throw new Error('S3 upload failed')
                  setValue('logoUrl', publicUrl)
                  // Persist immediately
                  await fetch(`${import.meta.env.VITE_API_BASE_URL}/charity-signup/draft`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ logoUrl: publicUrl }),
                  })
                } catch {
                  // swallow for now
                }
              }}
              className="block w-full text-md text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </label>

          {/* Step 2 subset - categories */}
          <div className="md:col-span-2">
            <div className="text-gray-700 text-sm font-medium mb-2">What type of charity are you?</div>
            <p className="text-xs text-gray-500 mb-3">Select all that apply</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
              {CATEGORY_OPTIONS.map((name) => (
                <label key={name} className="inline-flex items-center gap-2 text-gray-700">
                  <input type="checkbox" value={name} {...register('categories')} /> {name}
                </label>
              ))}
            </div>
            <div className="mt-4 md:w-1/2">
              <label className="block">
                <Label>If other please specify</Label>
                <input
                  {...register('otherCategory')}
                  placeholder="Describe other category"
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          <label className="block md:col-span-2">
            <Label>Mission</Label>
            <textarea rows={3} {...register('mission')} className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </label>
          <label className="block md:col-span-2">
            <Label>Description</Label>
            <textarea rows={5} {...register('description')} className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </label>

          {/* Step 3 subset - accepted items */}
          <div className="md:col-span-2">
            <div className="text-gray-700 text-sm font-medium mb-2">What types of items do you accept?</div>
            <div className="mt-2">
              <label className="inline-flex items-center gap-2 text-gray-700">
                <input type="checkbox" value="New items only" {...register('acceptedItemTypes')} /> New items only
              </label>
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-8">
              {ITEM_TYPES.map((type) => (
                <label key={type} className="inline-flex items-center gap-2 text-gray-700">
                  <input type="checkbox" value={type} {...register('acceptedItemTypes')} /> {type}
                </label>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-2">Selected: {accepted.join(', ') || 'None'}</div>
          </div>

          {/* Step 3 subset */}
          <label className="block md:col-span-2">
            <Label>Amazon wishlist URL</Label>
            <input type="url" {...register('amazonWishlistUrl')} className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </label>
          <label className="block">
            <Label>Link for cash donations</Label>
            <input type="url" {...register('cashDonationsUrl')} className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </label>
          <label className="block">
            <Label>Link for volunteer signup</Label>
            <input type="url" {...register('volunteerSignupUrl')} className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </label>

          <label className="block md:col-span-2">
            <div className="flex justify-end gap-3">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 shadow-sm cursor-pointer">Save</button>
            </div>
          </label>
        </form>
      </div>
    </div>
  )
}

