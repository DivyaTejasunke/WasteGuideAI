import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { getMarkerColor } from '../utils/categoryMeta'

function markerIcon(color) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="10" fill="${color}" stroke="#EEF0E4" stroke-width="2"/></svg>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13],
  })
}

export default function MapView({ centers = [], activeId, onMarkerClick, center }) {
  const defaultCenter = center || [13.6288, 79.4192]

  return (
    <MapContainer
      center={defaultCenter}
      zoom={13}
      scrollWheelZoom
      style={{ height: '100%', width: '100%', minHeight: '420px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {centers.map((c) => (
        <Marker
          key={c.id}
          position={[c.latitude, c.longitude]}
          icon={markerIcon(getMarkerColor(c.category))}
          eventHandlers={{ click: () => onMarkerClick?.(c) }}
        >
          <Popup>
            <div className="font-body">
              <p className="font-semibold">{c.name}</p>
              <p className="text-xs mt-1">{c.address}</p>
              <p className="text-xs mt-1">📞 {c.contact}</p>
              <p className="text-xs">🕒 {c.openingHours}</p>
              <p className="text-xs mt-1">Accepts: {(c.acceptedWaste || []).join(', ')}</p>
              <a
                className="text-xs text-blue-600 underline mt-2 inline-block"
                target="_blank"
                rel="noreferrer"
                href={`https://www.openstreetmap.org/directions?to=${c.latitude}%2C${c.longitude}`}
              >
                Directions
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
