import { useState, useEffect } from 'react'
import PlantCard from '../components/PlantCard'
import { Trash2, Search } from 'lucide-react'

export default function History() {
  const [plants, setPlants] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('floraiq_history') || '[]')
    setPlants(history)
    setFiltered(history)
  }, [])

  useEffect(() => {
    const result = plants.filter(p =>
      p.commonNames?.en?.toLowerCase().includes(search.toLowerCase()) ||
      p.scientificName?.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(result)
  }, [search, plants])

  const clearHistory = () => {
    if (confirm('Clear all history?')) {
      localStorage.setItem('floraiq_history', '[]')
      setPlants([])
      setFiltered([])
    }
  }

  return (
    <div className="page-history">
      <div className="history-header">
        <h2>Your Plant Collection</h2>
        <button className="btn btn-danger" onClick={clearHistory}>
          <Trash2 size={18} />
          Clear All
        </button>
      </div>

      <div className="search-box">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search plants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>{search ? 'No plants found' : 'No history yet. Start scanning!'}</p>
        </div>
      ) : (
        <div className="plants-grid">
          {filtered.map((plant, idx) => (
            <PlantCard key={idx} plant={plant} />
          ))}
        </div>
      )}
    </div>
  )
}
