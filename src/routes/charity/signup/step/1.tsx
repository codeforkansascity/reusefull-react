import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCharitySignupStore, CharitySignupData } from '@/stores/charitySignupStore'
import { requiredText } from '@/utils/formRules'

type Step1Form = Pick<
  CharitySignupData,
  | 'organizationName'
  | 'contactName'
  | 'email'
  | 'donationContactName'
  | 'donationContactEmail'
  | 'phone'
  | 'address'
  | 'city'
  | 'state'
  | 'zip'
>

export const Route = createFileRoute('/charity/signup/step/1')({
  component: Step1Component,
})

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-gray-700 text-sm font-medium">{label}</span>
      {hint && <span className="block text-xs text-gray-500">{hint}</span>}
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </label>
  )
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm'

function Step1Component() {
  const navigate = useNavigate()
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
  const { data, update } = useCharitySignupStore()
  const { register, handleSubmit, formState: { errors } } = useForm<Step1Form>({
    defaultValues: {
      organizationName: data.organizationName ?? '',
      contactName: data.contactName ?? '',
      email: data.email ?? '',
      donationContactName: data.donationContactName ?? '',
      donationContactEmail: data.donationContactEmail ?? '',
      phone: data.phone ?? '',
      address: data.address ?? '',
      city: data.city ?? '',
      state: data.state ?? '',
      zip: data.zip ?? '',
    },
  })

  return (
    <div className="bg-white text-gray-900">
      <div className="max-w-5xl mx-auto px-6 py-12 min-h-[calc(100vh-5rem)]">
        <h1 className="text-3xl font-semibold text-center">Tell us about your charity</h1>
        <p className="text-center text-gray-600 mt-2">Step 1 of 3</p>

        <form
          className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6"
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
            navigate({ to: '/charity/signup/step/2' })
          })}
        >
          <Field label="Organization Name *" error={errors.organizationName?.message}>
            <input {...register('organizationName', requiredText('Organization name'))} className={inputClass} />
          </Field>
          <Field label="Phone *" error={errors.phone?.message}>
            <input {...register('phone', requiredText('Phone'))} className={inputClass} />
          </Field>
          <Field label="Account Contact Name *" hint="The person who manages your Re.Use.Full account" error={errors.contactName?.message}>
            <input {...register('contactName', requiredText('Account contact name'))} className={inputClass} />
          </Field>
          <Field label="Account Contact Email *" hint="Used for your Re.Use.Full account" error={errors.email?.message}>
            <input type="email" {...register('email', requiredText('Account contact email'))} className={inputClass} />
          </Field>
          <Field label="Donation Contact Name" hint="Optional: who donors should talk to about donations">
            <input {...register('donationContactName')} className={inputClass} />
          </Field>
          <Field label="Donation Contact Email" hint="Optional: where donation questions should go" error={errors.donationContactEmail?.message}>
            <input type="email" {...register('donationContactEmail')} className={inputClass} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Address *" error={errors.address?.message}>
              <input {...register('address', requiredText('Address'))} className={inputClass} />
            </Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
            <Field label="City *" error={errors.city?.message}>
              <input {...register('city', requiredText('City'))} className={inputClass} />
            </Field>
            <Field label="State *" error={errors.state?.message}>
              <input {...register('state', requiredText('State'))} className={inputClass} />
            </Field>
            <Field label="Zip *" error={errors.zip?.message}>
              <input {...register('zip', requiredText('Zip'))} className={inputClass} />
            </Field>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 shadow-sm cursor-pointer">Next</button>
          </div>
        </form>
      </div>
    </div>
  )
}


