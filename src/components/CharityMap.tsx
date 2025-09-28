import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui'
import { MapPin, ExternalLink } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface Charity {
  Id: number
  Name: string
  Address: string
  City: string
  State: string
  ZipCode: string
  Lat: number
  Lng: number
  Mission?: string
  Description?: string
  LinkWebsite?: string
}

interface CharityMapProps {
  charities: Charity[]
  className?: string
}

export function CharityMap({ charities, className = '' }: CharityMapProps) {
  console.log('=== MAP DEBUGGING ===')
  console.log('Total charities passed to map:', charities.length)
  console.log('Charity coordinates:', charities.map(c => ({ name: c.Name, lat: c.Lat, lng: c.Lng })))
  
  // Filter charities that have valid coordinates (not 0,0 and not null/undefined)
  const charitiesWithCoords = charities.filter((charity) => 
    charity.Lat && charity.Lng && 
    !isNaN(charity.Lat) && !isNaN(charity.Lng) &&
    charity.Lat !== 0 && charity.Lng !== 0
  )
  
  console.log('Charities with valid coordinates:', charitiesWithCoords.length)
  console.log('Valid coordinates:', charitiesWithCoords.map(c => ({ name: c.Name, lat: c.Lat, lng: c.Lng })))

  // Calculate center point of all charities
  const centerLat =
    charitiesWithCoords.length > 0
      ? charitiesWithCoords.reduce((sum, charity) => sum + charity.Lat, 0) / charitiesWithCoords.length
      : 39.0997 // Default to Kansas City area
  const centerLng =
    charitiesWithCoords.length > 0
      ? charitiesWithCoords.reduce((sum, charity) => sum + charity.Lng, 0) / charitiesWithCoords.length
      : -94.5786 // Default to Kansas City area

  if (charitiesWithCoords.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Location Data Available</h3>
        <p className="text-gray-500">The selected charities don't have location information to display on the map.</p>
      </div>
    )
  }

  return (
    <div className={`rounded-lg overflow-hidden shadow-lg ${className}`}>
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={charitiesWithCoords.length === 1 ? 12 : 10}
        style={{ height: '400px', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          url="https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiaHlwcm5pY2siLCJhIjoiY2ttYTBidnYyMW45dTJ2cGJxbmxjMGsyMiJ9.po3lOo4mj9GAEdBBnMjDLA"
        />

        {charitiesWithCoords.map((charity) => (
          <Marker
            key={charity.Id}
            position={[charity.Lat, charity.Lng]}
            icon={L.divIcon({
              className: 'custom-marker',
              html: `<div class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">${charity.Name.charAt(0)}</div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            })}
          >
            <Popup maxWidth={300} className="custom-popup">
              <div className="p-2">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{charity.Name}</h3>

                {charity.Mission && <p className="text-gray-600 text-xs mb-3 line-clamp-2">{charity.Mission}</p>}

                <div className="text-gray-500 text-xs mb-3">
                  <div className="flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3" />
                    <span>
                      {charity.Address}, {charity.City}, {charity.State} {charity.ZipCode}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link to="/charity/$charityId" params={{ charityId: charity.Id.toString() }}>
                    <Button size="sm" className="text-xs px-3 py-1">
                      View Details
                    </Button>
                  </Link>

                  {charity.LinkWebsite && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs px-3 py-1 cursor-pointer text-card-foreground border-card-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
                      onClick={() => window.open(charity.LinkWebsite, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Website
                    </Button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
