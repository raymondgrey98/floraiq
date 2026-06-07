import { Share2 } from 'lucide-react'

interface PlantCardProps {
  plant: any
}

export default function PlantCard({ plant }: PlantCardProps) {
  return (
    <div className="plant-card">
      {plant.imageUrl && (
        <img src={plant.imageUrl} alt={plant.commonNames?.en} className="plant-image" />
      )}
      <div className="plant-info">
        <h3 className="plant-name">{plant.commonNames?.en || plant.scientificName}</h3>
        <p className="plant-scientific">{plant.scientificName}</p>
        {plant.confidence && (
          <div className="confidence-badge">
            {Math.round(plant.confidence * 100)}% match
          </div>
        )}
        <button className="btn btn-small">
          <Share2 size={16} />
          Share
        </button>
      </div>
    </div>
  )
}
