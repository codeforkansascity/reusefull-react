type CharityActivityEventType = 'website_click' | 'email_click'

/**
 * Records a donor clicking through to a charity's website or clicking to
 * email a charity, so admins can see/export it later. Fire-and-forget by
 * design: this always runs right before the browser navigates away (opening
 * a new tab or a mailto: link), so it uses sendBeacon where available since
 * that's guaranteed to be sent even as the page unloads.
 */
export function trackCharityActivity(charityId: number | string, eventType: CharityActivityEventType) {
  const url = `${import.meta.env.VITE_API_BASE_URL}/charity-activity`
  const payload = JSON.stringify({ charityId, eventType })

  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    // Send as a plain string (not a Blob typed application/json) so the
    // browser uses text/plain, a CORS-simple content type that skips the
    // preflight request a beacon can't reliably wait for during unload.
    if (navigator.sendBeacon(url, payload)) return
  }

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  }).catch(() => {})
}
