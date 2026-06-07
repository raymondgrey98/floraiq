import { useState, useEffect } from 'react'
import PlantCard from '../components/PlantCard'
import { Flower, MessageSquare, Map, History, Camera } from 'lucide-react'

interface HomeProps {
  onNavigate: (page: string) => void
}

export default function Home({ onNavigate }: HomeProps) {
  const [recentPlants, setRecentPlants] = useState<any[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('floraiq_history')
    if (saved) {
      try {
        const plants = JSON.parse(saved).slice(0, 3)
        setRecentPlants(plants)
      } catch (e) {
        console.error('Error loading history:', e)
      }
    }
  }, [])

  return (
    <div className="page-home">
      <div className="hero-section">
        <div className="hero-content">
          <Flower className="hero-icon" size={64} />
          <h1>🌿 FloraIQ</h1>
          <p>AI-Powered Plant Identification</p>
          <button
            className="btn btn-primary btn-large"
            onClick={() => onNavigate('camera')}
          >
            <Camera size={20} />
            Start Scanning
          </button>
        </div>
      </div>

      <div className="features-grid">
        <div
          className="feature-card"
          onClick={() => onNavigate('camera')}
        >
          <Camera size={32} />
          <h3>Identify Plants</h3>
          <p>Scan any plant and get instant AI identification</p>
        </div>

        <div
          className="feature-card"
          onClick={() => onNavigate('chat')}
        >
          <MessageSquare size={32} />
          <h3>Chat & Learn</h3>
          <p>Ask questions about plants and get AI-powered answers</p>
        </div>

        <div
          className="feature-card"
          onClick={() => onNavigate('map')}
        >
          <Map size={32} />
          <h3>Biodiversity Map</h3>
          <p>Explore species distribution worldwide</p>
        </div>

        <div
          className="feature-card"
          onClick={() => onNavigate('history')}
        >
          <History size={32} />
          <h3>Your Collections</h3>
          <p>View all your scanned plants and history</p>
        </div>
      </div>

      {recentPlants.length > 0 && (
        <div className="recent-section">
          <h2>Recently Scanned</h2>
          <div className="plants-grid">
            {recentPlants.map((plant, idx) => (
              <PlantCard key={idx} plant={plant} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
