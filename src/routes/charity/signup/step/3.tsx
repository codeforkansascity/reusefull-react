import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useCharitySignupStore, CharitySignupData } from '@/stores/charitySignupStore'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'

type Step3Form = Pick<
  CharitySignupData,
  'acceptedItemTypes' | 'amazonWishlistUrl' | 'cashDonationsUrl' | 'volunteerSignupUrl'
>

export const Route = createFileRoute('/charity/signup/step/3')({
  component: Step3Component,
})

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-gray-700 text-sm font-medium">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}

const ITEM_TYPES = [
  'Appliances - Large',
  'Appliances - Small',
  'Arts & Crafts Supplies',
  'Baby Supplies',
  'Bicycles',
  'Books & Magazines - Adult',
  'Books & Magazines - Children\'s',
  'Building Materials',
  'Clothing - Children\'s',
  'Clothing - Men\'s',
  'Clothing - Women\'s',
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

function Step3Component() {
  const navigate = useNavigate()
  const { data, update } = useCharitySignupStore()
  const { isAuthenticated, isLoading, loginWithRedirect, user, getAccessTokenSilently } = useAuth0()
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        loginWithRedirect({ appState: { returnTo: window.location.pathname } })
      } else if (user && !user.email_verified) {
        navigate({ to: '/verify-email' })
      }
    }
  }, [isLoading, isAuthenticated, loginWithRedirect, user, navigate])
  const { register, handleSubmit, watch } = useForm<Step3Form>({
    defaultValues: {
      acceptedItemTypes: data.acceptedItemTypes ?? [],
      amazonWishlistUrl: data.amazonWishlistUrl ?? '',
      cashDonationsUrl: data.cashDonationsUrl ?? '',
      volunteerSignupUrl: data.volunteerSignupUrl ?? '',
    },
  })

  const accepted = watch('acceptedItemTypes') || []
  if (isLoading || !isAuthenticated || !user?.email_verified) {
    return null
  }

  return (
    <div className="bg-white text-gray-900">
      <div className="max-w-5xl mx-auto px-6 py-12 min-h-[calc(100vh-5rem)]">
      <h1 className="text-3xl font-semibold text-center">Tell us about your charity</h1>
      <p className="text-center text-gray-600 mt-2">Step 3 of 3</p>

        <form
          className="mt-10 space-y-7"
          onSubmit={handleSubmit(async (values) => {
            update(values)
            // Submit to backend: mark as completed (approved set to 0 server-side)
            try {
              const token = await getAccessTokenSilently({
                authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
              })
              await fetch(`${import.meta.env.VITE_API_BASE_URL}/charity-signup/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...useCharitySignupStore.getState().data, ...values }),
              })
            } catch {}
            navigate({ to: '/charity/signup/thank-you' })
          })}
        >
          <div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">What types of items do you accept? <span className="text-red-500">*</span></div>
              <div className="text-gray-500 text-sm mt-1">Select all that apply</div>
            </div>
            {/* New items only - shown separately from the rest */}
            <div className="mt-4">
              <label className="inline-flex items-center gap-2 text-gray-700">
                <input type="checkbox" value="New items only" {...register('acceptedItemTypes')} /> New items only
              </label>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-8">
              {ITEM_TYPES.map((type) => (
                <label key={type} className="inline-flex items-center gap-2 text-gray-700">
                  <input type="checkbox" value={type} {...register('acceptedItemTypes')} /> {type}
                </label>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-2">Selected: {accepted.join(', ') || 'None'}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Amazon wishlist URL">
              <input type="url" {...register('amazonWishlistUrl')} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
            </Field>
            <Field label="Link for cash donations">
              <input type="url" {...register('cashDonationsUrl')} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
            </Field>
            <Field label="Link for volunteer signup">
              <input type="url" {...register('volunteerSignupUrl')} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
            </Field>
          </div>

          <div className="flex justify-between">
            <button type="button" onClick={() => navigate({ to: '/charity/signup/step/2' })} className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 cursor-pointer">Back</button>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 shadow-sm cursor-pointer">Complete</button>
          </div>
        </form>
      </div>
    </div>
  )
}


