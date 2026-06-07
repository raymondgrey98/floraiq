import { Flower, Camera, MessageSquare, Map, History } from 'lucide-react'

interface NavProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export default function Navigation({ currentPage, onNavigate }: NavProps) {
  const isActive = (page: string) => currentPage === page ? 'active' : ''

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => onNavigate('home')}>
          <Flower size={24} />
          <span>FloraIQ</span>
        </div>

        <div className="nav-links">
          <button
            className={`nav-link ${isActive('home')}`}
            onClick={() => onNavigate('home')}
          >
            Home
          </button>
          <button
            className={`nav-link ${isActive('camera')}`}
            onClick={() => onNavigate('camera')}
          >
            <Camera size={18} />
            Scan
          </button>
          <button
            className={`nav-link ${isActive('chat')}`}
            onClick={() => onNavigate('chat')}
          >
            <MessageSquare size={18} />
            Chat
          </button>
          <button
            className={`nav-link ${isActive('map')}`}
            onClick={() => onNavigate('map')}
          >
            <Map size={18} />
            Map
          </button>
          <button
            className={`nav-link ${isActive('history')}`}
            onClick={() => onNavigate('history')}
          >
            <History size={18} />
            History
          </button>
        </div>
      </div>
    </nav>
  )
}
