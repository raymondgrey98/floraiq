import { useState } from 'react'
import { Router } from 'wouter'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Camera from './pages/Camera'
import Chat from './pages/Chat'
import Map from './pages/Map'
import History from './pages/History'
import './styles/App.css'

type Page = 'home' | 'camera' | 'chat' | 'map' | 'history'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [lastIdentification, setLastIdentification] = useState<any>(null)

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page)
  }

  return (
    <div className="app-container">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="main-content">
        {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
        {currentPage === 'camera' && (
          <Camera
            onIdentify={(result) => {
              setLastIdentification(result)
              setCurrentPage('home')
            }}
          />
        )}
        {currentPage === 'chat' && <Chat identification={lastIdentification} />}
        {currentPage === 'map' && <Map />}
        {currentPage === 'history' && <History />}
      </main>
    </div>
  )
}
