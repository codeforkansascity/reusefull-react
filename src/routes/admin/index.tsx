 import { createFileRoute, useNavigate } from '@tanstack/react-router'
 import { useEffect, useState } from 'react'
 import { useAuth0 } from '@auth0/auth0-react'
 import { Card, Container } from '@/components/ui'
 import { Phone, MapPin, Truck, Package } from 'lucide-react'

type PendingCharity = {
  id: number
  name: string
  pickup: 0 | 1 | null
  dropoff: 0 | 1 | null
  address: string | null
  phone: string | null
  taxid: string | null
  logo_url: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  contact_name: string | null
  email: string
}

export const Route = createFileRoute('/admin/')({
  component: AdminPage,
})

function AdminPage() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, getAccessTokenSilently, loginWithRedirect } = useAuth0()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [rows, setRows] = useState<PendingCharity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        if (!isAuthenticated) {
          await loginWithRedirect({ appState: { returnTo: '/admin' } })
          return
        }
        const token = await getAccessTokenSilently({
          authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
        })
        // Check admin
        const meRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!meRes.ok) throw new Error('me_failed')
        const me = await meRes.json()
        const admin = Boolean(me?.user?.admin)
        if (!admin) {
          navigate({ to: '/' })
          return
        }
        if (!cancelled) setIsAdmin(true)
        // Load pending charities
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/charities/pending`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('pending_failed')
        const data = (await res.json()) as PendingCharity[]
        if (!cancelled) setRows(data)
      } catch {
        if (!cancelled) setIsAdmin(false)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    if (!isLoading) load()
    return () => {
      cancelled = true
    }
  }, [isAuthenticated, isLoading, getAccessTokenSilently, loginWithRedirect, navigate])

  async function act(id: number, action: 'approve' | 'deny') {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
      })
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/charities/${id}/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('failed')
      setRows((prev) => prev.filter((r) => r.id !== id))
    } catch {
      // no-op; leave row for retry
    }
  }

  if (loading || !isAuthenticated || isAdmin === null) return null
  if (!isAdmin) return null

   return (
     <div className="bg-white">
       <Container>
         <div className="py-10">
          <h2 className="text-[40px] font-semibold text-black leading-none">Needs Approval</h2>
           <div className="mt-6 space-y-8">
             {rows.map((c) => (
               <Card key={c.id} className="p-5 border border-[#e3e6ea] shadow-sm rounded-md">
                 <div className="flex items-start gap-6">
                   {c.logo_url ? (
                     <img src={c.logo_url} alt={c.name} className="w-[140px] h-[100px] object-contain rounded bg-white" />
                   ) : (
                     <div className="w-[140px] h-[100px] bg-gray-100 flex items-center justify-center text-gray-400 rounded">
                       No Logo
                     </div>
                   )}
                   <div className="flex-1">
                     <a className="text-[18px] font-semibold text-[#2c78c5] hover:underline cursor-pointer">{c.name}</a>
                     <div className="mt-2 space-y-1 text-[14px] text-[#212529]">
                       <div className="flex items-center gap-2">
                         <Truck className="w-4 h-4 text-[#6c757d]" />
                         <span className="font-semibold">Pick-Up Service:</span>&nbsp;<span>{boolStr(c.pickup)}</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <Package className="w-4 h-4 text-[#6c757d]" />
                         <span className="font-semibold">Dropoff:</span>&nbsp;<span>{boolStr(c.dropoff)}</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <MapPin className="w-4 h-4 text-[#6c757d]" />
                         <span className="font-semibold">Address:</span>&nbsp;<span>{addr(c)}</span>
                       </div>
                       {c.phone ? (
                         <div className="flex items-center gap-2">
                           <Phone className="w-4 h-4 text-[#6c757d]" />
                           <span className="font-semibold">Phone:</span>&nbsp;<span>{c.phone}</span>
                         </div>
                       ) : null}
                     </div>
                   </div>
                   <div className="flex flex-col gap-3">
                     <button
                       onClick={() => act(c.id, 'approve')}
                       className="px-4 py-2 rounded bg-[#28a745] hover:bg-[#218838] text-white text-sm font-semibold cursor-pointer"
                     >
                       Approve
                     </button>
                     <button
                       onClick={() => act(c.id, 'deny')}
                       className="px-4 py-2 rounded bg-[#dc3545] hover:bg-[#c82333] text-white text-sm font-semibold cursor-pointer"
                     >
                       Deny
                     </button>
                   </div>
                 </div>
               </Card>
             ))}
             {rows.length === 0 && <div className="text-gray-600">No pending charities.</div>}
           </div>
         </div>
       </Container>
     </div>
   )
}

function boolStr(v: 0 | 1 | null) {
  if (v == null) return 'Unknown'
  return v ? 'Yes' : 'No'
}
function addr(c: PendingCharity) {
  return [c.address, c.city, c.state, c.zip_code].filter(Boolean).join(', ')
}

