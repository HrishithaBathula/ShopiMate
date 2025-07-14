import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '../assets/styles/location.css'

export default function LocationFinder() {
  const mapRef = useRef(null)
  const [userLocation, setUserLocation] = useState(null)
  const [showMap, setShowMap] = useState(false)
  const [filteredStores, setFilteredStores] = useState([])
  const [distanceFilter, setDistanceFilter] = useState(200) // km
  const [timeFilter, setTimeFilter] = useState(300) // minutes

  const stores = [
    { name: 'Walmart Hyderabad', lat: 17.385044, lng: 78.486671 },
    { name: 'Walmart Bangalore', lat: 12.971599, lng: 77.594566 },
    { name: 'Walmart Delhi', lat: 28.613939, lng: 77.209023 },
    { name: 'Walmart Mumbai', lat: 19.076090, lng: 72.877426 },
    { name: 'Walmart Kolkata', lat: 22.572645, lng: 88.363892 },
  ]

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported')
      setUserLocation([28.6139, 77.2090])
      return
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        console.log('✅ Location fetched:', pos.coords)
        setUserLocation([pos.coords.latitude, pos.coords.longitude])
      },
      err => {
        console.error('❌ Location fetch failed:', err)
        setUserLocation([28.6139, 77.2090]) // fallback
      }
    )
  }, [])

  useEffect(() => {
    if (!showMap || !userLocation) return

    const R = 6371
    const toRad = deg => deg * Math.PI / 180

    const haversine = (lat1, lon1, lat2, lon2) => {
      const dLat = toRad(lat2 - lat1)
      const dLon = toRad(lon2 - lon1)
      const a = Math.sin(dLat / 2) ** 2 +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) ** 2
      return 2 * R * Math.asin(Math.sqrt(a))
    }

    const filtered = stores.filter(s => {
      const dist = haversine(userLocation[0], userLocation[1], s.lat, s.lng)
      const time = dist / 40 * 60 // assuming 40km/h travel
      return dist <= distanceFilter && time <= timeFilter
    })

    console.log('📌 Filtered Stores:', filtered)
    setFilteredStores(filtered)

    if (mapRef.current) {
      mapRef.current.remove()
    }

    const map = L.map('map').setView(userLocation, 6)
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    L.marker(userLocation).addTo(map)
      .bindPopup('📍 You are here')
      .openPopup()

    filtered.forEach(store => {
      const marker = L.marker([store.lat, store.lng]).addTo(map)
      marker.bindPopup(`
        <b>${store.name}</b><br/>
        <button onclick="window.open('https://www.openstreetmap.org/directions?engine=graphhopper_car&route=${userLocation[0]},${userLocation[1]};${store.lat},${store.lng}', '_blank')">
          🚗 Get Directions
        </button>
      `)
    })
  }, [showMap, userLocation, distanceFilter, timeFilter])

  return (
    <div className="location-container">
      <button className="location-toggle" onClick={() => setShowMap(!showMap)}>
        🗺️ Get to the nearest Walmart store
      </button>

      {showMap && (
        <div className="location-section">
          <div className="location-filters">
            <label>
              Distance (km):
              <input
                type="number"
                min="1"
                step="1"
                value={distanceFilter}
                onChange={(e) => setDistanceFilter(Number(e.target.value))}
                placeholder="Enter distance"
              />
              <select onChange={e => setDistanceFilter(Number(e.target.value))}>
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={20}>20 km</option>
                <option value={50}>50 km</option>
                <option value={100}>100 km</option>
                <option value={200}>200 km</option>
              </select>
            </label>

            <label>
              Max Travel Time:
              <input
                type="number"
                min="1"
                step="1"
                value={timeFilter}
                onChange={(e) => setTimeFilter(Number(e.target.value))}
                placeholder="Enter time in minutes"
              />
              <select onChange={e => setTimeFilter(Number(e.target.value))}>
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={180}>3 hours</option>
                <option value={300}>5 hours</option>
              </select>
            </label>
          </div>

          <h2 className="location-title">📍 Nearby Walmart Stores</h2>
          {filteredStores.length === 0 && <p>No stores match the filter</p>}
          <div id="map" className="location-map"></div>
        </div>
      )}
    </div>
  )
}
