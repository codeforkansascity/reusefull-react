import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

type CharityForm = {
  organizationName: string
  contactName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
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
  acceptedItemTypes: string[]
  amazonWishlistUrl: string
  cashDonationsUrl: string
  volunteerSignupUrl: string
}

export const Route = createFileRoute('/admin/charities/$charityId/edit')({
  component: AdminEditCharityComponent,
})

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-gray-700 text-sm font-medium">{children}</span>
}

const BUDGET_SIZES: CharityForm['budgetSize'][] = ['$0-5k', '$6-25k', '$26-100k', '>$100k']
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

function AdminEditCharityComponent() {
  const { charityId } = Route.useParams()
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, getAccessTokenSilently, loginWithRedirect } = useAuth0()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const { register, handleSubmit, reset, setValue, watch } = useForm<CharityForm>({
    defaultValues: {
      organizationName: '',
      contactName: '',
      email: '',
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
    let cancelled = false
    async function load() {
      if (isLoading) return
      if (!isAuthenticated) {
        await loginWithRedirect({
          appState: { returnTo: `/admin/charities/${charityId}/edit` },
        })
        return
      }
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
        })
        // Verify admin
        const meRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!meRes.ok) throw new Error('me_failed')
        const me = await meRes.json()
        if (!Boolean(me?.user?.admin)) {
          navigate({ to: '/' })
          return
        }
        if (!cancelled) setIsAdmin(true)

        // Load the charity being edited
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/admin/charities/${charityId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (res.status === 404) {
          if (!cancelled) setNotFound(true)
          return
        }
        if (!res.ok) throw new Error('load_failed')
        const data = await res.json()
        const charity = data?.charity || {}
        if (!cancelled) {
          reset({
            organizationName: charity.name || '',
            contactName: charity.contact_name || '',
            email: charity.email || '',
            phone: charity.phone || '',
            address: charity.address || '',
            city: charity.city || '',
            state: charity.state || '',
            zip: charity.zip_code || '',
            website: charity.link_website || '',
            budgetSize: (charity.budgetSize as CharityForm['budgetSize']) || '$0-5k',
            acceptDropOffs: Boolean(charity.dropoff),
            pickupDonations: Boolean(charity.pickup),
            faithBased: Boolean(charity.faith),
            resellItems: Boolean(charity.resell),
            taxId: charity.taxid || '',
            logoUrl: charity.logo_url || '',
            categories: Array.isArray(data?.categories) ? data.categories : [],
            otherCategory: '',
            mission: charity.mission || '',
            description: charity.description || '',
            acceptedItemTypes: Array.isArray(data?.acceptedItemTypes) ? data.acceptedItemTypes : [],
            amazonWishlistUrl: charity.link_wishlist || '',
            cashDonationsUrl: charity.link_donate_cash || '',
            volunteerSignupUrl: charity.link_volunteer || '',
          })
        }
      } catch {
        if (!cancelled) setIsAdmin(false)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [isLoading, isAuthenticated, getAccessTokenSilently, loginWithRedirect, navigate, reset, charityId])

  async function onSave(values: CharityForm) {
    setSaving(true)
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
      })
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/charities/${charityId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ ...(values as any) }),
        }
      )
      if (!res.ok) throw new Error('save_failed')
      setShowSuccess(true)
      window.setTimeout(() => {
        navigate({ to: '/charitylist' })
      }, 900)
    } catch {
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const selectedBudget = watch('budgetSize')
  const accepted = watch('acceptedItemTypes') || []

  if (loading || !isAuthenticated || isAdmin === null) return null
  if (!isAdmin) return null

  if (notFound) {
    return (
      <div className="bg-white text-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-semibold mb-2">Charity not found</h1>
          <p className="text-gray-600 mb-8">
            We couldn&apos;t find a charity with id {charityId}.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: '/charitylist' })}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 shadow-sm cursor-pointer"
          >
            Back to charity list
          </button>
        </div>
      </div>
    )
  }

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
            <div className="font-semibold">Charity updated</div>
            <div className="text-green-100 text-sm">Changes were saved successfully.</div>
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
        <h1 className="text-3xl font-semibold mb-2">Edit Charity</h1>
        <p className="text-gray-600 mb-8">Update this charity&apos;s details as an administrator</p>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit(onSave)}>
          {/* Contact / location */}
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

          {/* Budget size */}
          <div className="md:col-span-2">
            <div className="text-gray-700 text-sm font-medium mb-2">Budget Size</div>
            <div className="flex gap-2 flex-wrap">
              {BUDGET_SIZES.map((size) => (
                <label key={size} className={`px-3 py-2 border rounded-md cursor-pointer shadow-sm ${selectedBudget === size ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700'}`}>
                  <input type="radio" value={size} {...register('budgetSize')} className="hidden" />
                  {size}
                </label>
              ))}
            </div>
          </div>

          {/* Flags */}
          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="inline-flex items-center gap-2 text-gray-700"><input type="checkbox" {...register('acceptDropOffs')} /> We accept drop-offs</label>
            <label className="inline-flex items-center gap-2 text-gray-700"><input type="checkbox" {...register('pickupDonations')} /> We pick up donations</label>
            <label className="inline-flex items-center gap-2 text-gray-700"><input type="checkbox" {...register('faithBased')} /> Faith-based charity</label>
            <label className="inline-flex items-center gap-2 text-gray-700"><input type="checkbox" {...register('resellItems')} /> We resell items</label>
          </div>

          {/* Tax ID + Logo */}
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
                } catch {
                  // swallow for now
                }
              }}
              className="block w-full text-md text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            {watch('logoUrl') ? (
              <img src={watch('logoUrl')} alt="Charity logo" className="mt-3 h-20 object-contain bg-white" />
            ) : null}
          </label>

          {/* Categories */}
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

          {/* Accepted items */}
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

          {/* Links */}
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

          <div className="md:col-span-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate({ to: '/charitylist' })}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 shadow-sm cursor-pointer disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
