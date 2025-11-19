import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { useCharitySignupStore, CharitySignupData, BudgetSize } from '@/stores/charitySignupStore'

type Step2Form = Pick<
  CharitySignupData,
  | 'website'
  | 'budgetSize'
  | 'acceptDropOffs'
  | 'pickupDonations'
  | 'faithBased'
  | 'resellItems'
  | 'taxId'
  | 'logoUrl'
  | 'categories'
  | 'otherCategory'
  | 'mission'
  | 'description'
>

export const Route = createFileRoute('/charity/signup/step/2')({
  component: Step2Component,
})

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-gray-700 text-sm font-medium">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}

const BUDGET_SIZES: BudgetSize[] = ['$0-5k', '$6-25k', '$26-100k', '>$100k']
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

function Step2Component() {
  const navigate = useNavigate()
  const { data, update } = useCharitySignupStore()
  const { register, handleSubmit, watch, setValue } = useForm<Step2Form>({
    defaultValues: {
      website: data.website ?? '',
      budgetSize: data.budgetSize ?? '$0-5k',
      acceptDropOffs: data.acceptDropOffs ?? false,
      pickupDonations: data.pickupDonations ?? false,
      faithBased: data.faithBased ?? false,
      resellItems: data.resellItems ?? false,
      taxId: data.taxId ?? '',
      logoUrl: data.logoUrl ?? '',
      categories: data.categories ?? [],
      otherCategory: data.otherCategory ?? '',
      mission: data.mission ?? '',
      description: data.description ?? '',
    },
  })

  const selectedBudget = watch('budgetSize')

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
  if (isLoading || !isAuthenticated || !user?.email_verified) {
    return null
  }

  return (
    <div className="bg-white text-gray-900">
      <div className="max-w-5xl mx-auto px-6 py-12 min-h-[calc(100vh-5rem)]">
        <h1 className="text-3xl font-semibold text-center">Tell us about your charity</h1>
        <p className="text-center text-gray-600 mt-2">Step 2 of 3</p>

        <form
          className="mt-10 space-y-7"
          onSubmit={handleSubmit(async (values) => {
            update(values)
            try {
              const token = await getAccessTokenSilently({
                authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
              })
              await fetch(`${import.meta.env.VITE_API_BASE_URL}/charity-signup/draft`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...useCharitySignupStore.getState().data, ...values }),
              })
            } catch {}
            navigate({ to: '/charity/signup/step/3' })
          })}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label={<>Organization Website <span className="text-red-500">*</span></>}>
              <input type="url" {...register('website', { required: true })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
            </Field>

            <div>
              <div className="text-gray-700 text-sm font-medium mb-2">Budget Size <span className="text-red-500">*</span></div>
              <div className="flex gap-2 flex-wrap">
                {BUDGET_SIZES.map((size) => (
                  <label key={size} className={`px-3 py-2 border rounded-md cursor-pointer shadow-sm ${selectedBudget === size ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700'}`}>
                    <input type="radio" value={size} {...register('budgetSize', { required: true })} className="hidden" />
                    {size}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="text-gray-700 text-sm font-medium mb-2">Please select a pick-up or drop-off option <span className="text-red-500">*</span></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="inline-flex items-center gap-2 text-gray-700"><input type="checkbox" {...register('acceptDropOffs')} /> We accept drop-offs</label>
              <label className="inline-flex items-center gap-2 text-gray-700"><input type="checkbox" {...register('pickupDonations')} /> We pick up donations</label>
              <label className="inline-flex items-center gap-2 text-gray-700"><input type="checkbox" {...register('faithBased')} /> Faith-based charity</label>
              <label className="inline-flex items-center gap-2 text-gray-700"><input type="checkbox" {...register('resellItems')} /> We resell items</label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label={<>Tax ID Number <span className="text-red-500">*</span></>}>
              <input {...register('taxId', { required: true })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
            </Field>
            <Field label="Logo">
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
                    // Ask backend for a presigned URL
                    const presignRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/uploads/logo-url`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                      body: JSON.stringify({ fileName: file.name, contentType: file.type }),
                    })
                    if (!presignRes.ok) throw new Error('Failed to obtain upload URL')
                    const { uploadUrl, publicUrl } = await presignRes.json()
                    // Upload directly to S3
                    const putRes = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file })
                    if (!putRes.ok) throw new Error('S3 upload failed')
                    // Save the public URL as logoUrl via draft update
                    setValue('logoUrl', publicUrl)
                    update({ logoUrl: publicUrl })
                    await fetch(`${import.meta.env.VITE_API_BASE_URL}/charity-signup/draft`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                      body: JSON.stringify({ ...useCharitySignupStore.getState().data, logoUrl: publicUrl }),
                    })
                  } catch {
                    // swallow for now; could show a toast
                  }
                }}
                className="block w-full text-md text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </Field>
          </div>

          <div>
            <div className="text-gray-700 text-sm font-medium mb-2">What type of charity are you? <span className="text-red-500">*</span></div>
            <p className="text-xs text-gray-500 mb-3">Select all that apply</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
              {CATEGORY_OPTIONS.map((name) => (
                <label key={name} className="inline-flex items-center gap-2 text-gray-700">
                  <input type="checkbox" value={name} {...register('categories')} /> {name}
                </label>
              ))}
            </div>
            <div className="mt-4 md:w-1/2">
              <Field label="If other please specify:">
                <input
                  {...register('otherCategory')}
                  placeholder="Describe other category"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                />
              </Field>
            </div>
          </div>

          <Field label={<>Mission <span className="text-red-500">*</span></> }>
            <textarea {...register('mission', { required: true })} rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
          </Field>
          <Field label={<>Description <span className="text-red-500">*</span></>}>
            <textarea {...register('description', { required: true })} rows={5} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
          </Field>

          <div className="flex justify-between">
            <button type="button" onClick={() => navigate({ to: '/charity/signup/step/1' })} className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 cursor-pointer">Back</button>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 shadow-sm cursor-pointer">Next</button>
          </div>
        </form>
      </div>
    </div>
  )
}


