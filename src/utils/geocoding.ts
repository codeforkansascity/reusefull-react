/**
 * Geocoding and distance calculation utilities
 */

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface ZipCodeInfo {
  zipCode: string
  city: string
  state: string
  coordinates: Coordinates
}

/**
 * Convert ZIP code to latitude/longitude coordinates
 * @param zipCode - US ZIP code
 * @returns Promise with coordinates or null if not found
 */
export async function geocodeZipCode(zipCode: string): Promise<Coordinates | null> {
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.places && data.places.length > 0) {
      const place = data.places[0]
      return {
        latitude: parseFloat(place.latitude),
        longitude: parseFloat(place.longitude)
      }
    }
    
    return null
  } catch (error) {
    console.error('Error geocoding ZIP code:', error)
    return null
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param coord1 - First coordinate
 * @param coord2 - Second coordinate
 * @returns Distance in miles
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 3959 // Earth's radius in miles
  const dLat = toRadians(coord2.latitude - coord1.latitude)
  const dLon = toRadians(coord2.longitude - coord1.longitude)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.latitude)) * Math.cos(toRadians(coord2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  
  return distance
}

/**
 * Convert degrees to radians
 * @param degrees - Degrees to convert
 * @returns Radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Check if an organization is within the specified distance from a ZIP code
 * @param orgLat - Organization latitude (from API endpoint)
 * @param orgLng - Organization longitude (from API endpoint)
 * @param userZipCode - User's ZIP code
 * @param maxDistance - Maximum distance in miles
 * @returns Promise with boolean indicating if org is within distance
 */
export async function isOrgWithinDistance(
  orgLat: number,
  orgLng: number,
  userZipCode: string,
  maxDistance: number
): Promise<boolean> {
  const userCoords = await geocodeZipCode(userZipCode)
  
  if (!userCoords) {
    console.error('Could not geocode user ZIP code:', userZipCode)
    return false
  }
  
  // Use REAL coordinates from API endpoint
  const orgCoords: Coordinates = {
    latitude: orgLat,   // Real Lat from API (e.g., 39.1049995422363 for Mission Adelante)
    longitude: orgLng   // Real Lng from API (e.g., -94.6496963500977 for Mission Adelante)
  }
  
  const distance = calculateDistance(userCoords, orgCoords)
  
  console.log(`Distance calculation: User ZIP ${userZipCode} (${userCoords.latitude}, ${userCoords.longitude}) to Org (${orgLat}, ${orgLng}) = ${distance.toFixed(2)} miles`)
  
  return distance <= maxDistance
}
