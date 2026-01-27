import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCharitySignupStore, CharitySignupData } from '@/stores/charitySignupStore'

type Step1Form = Pick<
  CharitySignupData,
  'organizationName' | 'contactName' | 'email' | 'phone' | 'address' | 'city' | 'state' | 'zip'
>

export const Route = createFileRoute('/charity/signup/step/1')({
  component: Step1Component,
})

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-gray-700 text-sm font-medium">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}

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
  const { register, handleSubmit } = useForm<Step1Form>({
    defaultValues: {
      organizationName: data.organizationName ?? '',
      contactName: data.contactName ?? '',
      email: data.email ?? '',
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
          <Field label="Organization Name *">
            <input {...register('organizationName', { required: true })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
          </Field>
          <Field label="Contact Name *">
            <input {...register('contactName', { required: true })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
          </Field>
          <Field label="Email *">
            <input type="email" {...register('email', { required: true })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
          </Field>
          <Field label="Phone *">
            <input {...register('phone', { required: true })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
          </Field>
          <Field label="Address *">
            <input {...register('address', { required: true })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
            <Field label="City *">
              <input {...register('city', { required: true })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
            </Field>
            <Field label="State *">
              <input {...register('state', { required: true })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
            </Field>
            <Field label="Zip *">
              <input {...register('zip', { required: true })} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" />
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


