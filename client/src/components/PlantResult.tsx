import { X, MessageSquare, Save, Share2 } from 'lucide-react'

interface PlantResultProps {
  result: any
  image: string | null
  onClose: () => void
  onChat: () => void
}

export default function PlantResult({ result, image, onClose, onChat }: PlantResultProps) {
  return (
    <div className="plant-result-overlay">
      <div className="plant-result-modal">
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="result-content">
          {image && <img src={image} alt="Plant" className="result-image" />}

          <div className="result-info">
            <h2>{result.commonNames?.en || result.scientificName}</h2>
            <p className="scientific-name">{result.scientificName}</p>

            {result.confidence && (
              <div className="confidence">
                Confidence: {Math.round(result.confidence * 100)}%
              </div>
            )}

            {result.description && (
              <div className="description">
                <h3>Description</h3>
                <p>{result.description}</p>
              </div>
            )}

            {result.careInstructions && (
              <div className="care-instructions">
                <h3>Care Instructions</h3>
                <p>{result.careInstructions}</p>
              </div>
            )}

            {result.habitat && (
              <div className="habitat">
                <h3>Habitat</h3>
                <p>{result.habitat}</p>
              </div>
            )}

            {result.riskLevel && (
              <div className={`risk-level risk-${result.riskLevel}`}>
                Safety: {result.riskLevel.toUpperCase()}
              </div>
            )}

            <div className="result-actions">
              <button className="btn btn-primary" onClick={onChat}>
                <MessageSquare size={18} />
                Ask Questions
              </button>
              <button className="btn btn-secondary">
                <Save size={18} />
                Save
              </button>
              <button className="btn btn-secondary">
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
