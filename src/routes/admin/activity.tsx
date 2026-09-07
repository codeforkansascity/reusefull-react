import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Container } from '@/components/ui'
import { Globe, Mail } from 'lucide-react'

type ActivityRow = {
  id: number
  charity_id: number
  charity_name: string
  event_type: 'website_click' | 'email_click'
  created_at: string
}

export const Route = createFileRoute('/admin/activity')({
  component: AdminActivityPage,
})

function AdminActivityPage() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, getAccessTokenSilently, loginWithRedirect } = useAuth0()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [rows, setRows] = useState<ActivityRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        if (!isAuthenticated) {
          await loginWithRedirect({ appState: { returnTo: '/admin/activity' } })
          return
        }
        const token = await getAccessTokenSilently({
          authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
        })
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

        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/charity-activity`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (!res.ok) throw new Error(`activity_failed: ${res.status} ${await res.text()}`)
          const data = (await res.json()) as ActivityRow[]
          if (!cancelled) setRows(data)
        } catch (e) {
          console.error('Failed to load charity activity', e)
          if (!cancelled) setError('Could not load activity data. Check the browser console for details.')
        }
      } catch (e) {
        console.error('Failed to verify admin access', e)
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

  async function downloadCsv() {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
      })
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/charity-activity/export.csv`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('export_failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `charity-activity-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      // no-op; leave button available to retry
    }
  }

  if (loading || !isAuthenticated || isAdmin === null) return null
  if (!isAdmin) return null

  return (
    <div className="bg-white">
      <Container>
        <div className="py-10">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-[40px] font-semibold text-black leading-none">Charity Activity</h2>
            <div className="flex items-center gap-3">
              <Link
                to="/admin"
                className="px-4 py-2 rounded border border-[#2c78c5] text-[#2c78c5] hover:bg-[#2c78c5] hover:text-white text-sm font-semibold cursor-pointer"
              >
                Back to Admin
              </Link>
              <button
                onClick={downloadCsv}
                className="px-4 py-2 rounded border border-[#2c78c5] text-[#2c78c5] hover:bg-[#2c78c5] hover:text-white text-sm font-semibold cursor-pointer"
              >
                Download activity (CSV)
              </button>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Every time a donor clicks through to a charity's website or clicks to email a charity. Showing the most recent {rows.length} — download the CSV for the full history.
          </p>

          {error && (
            <div className="mt-4 px-4 py-3 rounded border border-red-300 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mt-6 overflow-x-auto border border-[#e3e6ea] rounded-md">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Charity</th>
                  <th className="px-4 py-3 font-semibold">Activity</th>
                  <th className="px-4 py-3 font-semibold">When</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-[#e3e6ea]">
                    <td className="px-4 py-3">
                      <Link to="/charity/$charityId" params={{ charityId: r.charity_id.toString() }} className="text-[#2c78c5] hover:underline">
                        {r.charity_name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-gray-700">
                        {r.event_type === 'website_click' ? (
                          <Globe className="w-4 h-4 text-[#6c757d]" />
                        ) : (
                          <Mail className="w-4 h-4 text-[#6c757d]" />
                        )}
                        {r.event_type === 'website_click' ? 'Visited website' : 'Clicked email'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{new Date(r.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && <div className="p-6 text-gray-600">No activity recorded yet.</div>}
          </div>
        </div>
      </Container>
    </div>
  )
}
