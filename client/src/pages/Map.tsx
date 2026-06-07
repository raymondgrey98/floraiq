import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface PlantLocation {
  id: string
  name: string
  lat: number
  lng: number
  timestamp: Date
}

export default function Map() {
  const [plants, setPlants] = useState<PlantLocation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load plant locations from history
    const history = JSON.parse(localStorage.getItem('floraiq_history') || '[]')
    const locatedPlants = history
      .filter((p: any) => p.latitude && p.longitude)
      .map((p: any, idx: number) => ({
        id: idx.toString(),
        name: p.commonNames?.en || p.scientificName,
        lat: p.latitude,
        lng: p.longitude,
        timestamp: new Date(p.timestamp)
      }))
    setPlants(locatedPlants)
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="page-map"><p>Loading map...</p></div>
  }

  return (
    <div className="page-map">
      <MapContainer center={[20, 0]} zoom={2} className="map-container">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
        />
        {plants.map(plant => (
          <Marker key={plant.id} position={[plant.lat, plant.lng]}>
            <Popup>
              <div>
                <h3>{plant.name}</h3>
                <p>{plant.timestamp.toLocaleDateString()}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {plants.length === 0 && (
        <div className="empty-state">
          <p>No plant locations recorded yet. Scan plants with location to see them on the map!</p>
        </div>
      )}
    </div>
  )
}
