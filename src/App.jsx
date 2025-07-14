import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import Auth from './components/Auth'
import LocationFinder from './components/LocationFinder'
import ChatWidget from './components/ChatWidget'
import './assets/styles/dashboard.css'
import './assets/styles/location.css'

function App() {
  const [session, setSession] = useState(null)
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📦 Initial session:', session)
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state changed:', event, session)
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="dashboard-container">
      {!session ? (
        <Auth />
      ) : (
        <div className="dashboard-content">
          <button
            className="logout-button"
            onClick={() => supabase.auth.signOut()}
          >
            Logout
          </button>

          <h1 className="dashboard-title">Welcome to WalMate🛍️
          </h1>

          <ChatWidget />

          <button className="location-toggle" onClick={() => setShowMap(prev => !prev)}>
            🗺️ Get to the nearest Walmart store
          </button>

          {showMap && <LocationFinder />}
        </div>
      )}
    </div>
  )
}

export default App
