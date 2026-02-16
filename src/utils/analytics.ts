/**
 * Google Analytics utility functions
 */

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void
  }
}

/**
 * Track a page view with optional custom parameters
 */
export function trackPageView(params?: {
  page_path?: string
  page_title?: string
  page_location?: string
  charity_id?: number | string
  charity_name?: string
  [key: string]: any
}) {
  if (typeof window === 'undefined' || !('gtag' in window)) return

  const defaultParams = {
    page_path: window.location.pathname + window.location.search,
    page_title: document.title,
    page_location: window.location.href,
  }

  window.gtag?.('event', 'page_view', {
    ...defaultParams,
    ...params,
  })
}

/**
 * Track a custom event
 */
export function trackEvent(
  eventName: string,
  params?: {
    charity_id?: number | string
    charity_name?: string
    [key: string]: any
  }
) {
  if (typeof window === 'undefined' || !('gtag' in window)) return

  window.gtag?.('event', eventName, params)
}

/**
 * Track charity partner page view with charity details
 */
export function trackCharityView(charityId: number | string, charityName: string) {
  trackPageView({
    charity_id: charityId,
    charity_name: charityName,
    content_group1: 'Charity Partner',
    content_group2: charityName,
  })
}

/**
 * Track charity interaction (website click, wishlist, volunteer, etc.)
 */
export function trackCharityInteraction(
  action: string,
  charityId: number | string,
  charityName: string,
  linkType?: string
) {
  trackEvent('charity_interaction', {
    action,
    charity_id: charityId,
    charity_name: charityName,
    link_type: linkType,
    content_group1: 'Charity Partner',
    content_group2: charityName,
  })
}
