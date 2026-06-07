import { useState, useRef, useEffect } from 'react'
import { Camera as CameraIcon, Upload, X, Loader } from 'lucide-react'
import PlantResult from '../components/PlantResult'

interface CameraProps {
  onIdentify: (result: any) => void
}

export default function Camera({ onIdentify }: CameraProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    startCamera()
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.')
      console.error(err)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)
        const imageData = canvasRef.current.toDataURL('image/jpeg')
        setCapturedImage(imageData)
        identifyPlant(imageData)
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageData = event.target?.result as string
        setCapturedImage(imageData)
        identifyPlant(imageData)
      }
      reader.readAsDataURL(file)
    }
  }

  const identifyPlant = async (imageData: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData })
      })

      if (!response.ok) throw new Error('Identification failed')

      const data = await response.json()
      setResult(data)
      // Save to history
      const history = JSON.parse(localStorage.getItem('floraiq_history') || '[]')
      history.unshift({ ...data, timestamp: new Date().toISOString() })
      localStorage.setItem('floraiq_history', JSON.stringify(history.slice(0, 50)))
    } catch (err) {
      setError('Failed to identify plant. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setCapturedImage(null)
    setResult(null)
    setError(null)
  }

  if (result) {
    return (
      <PlantResult
        result={result}
        image={capturedImage}
        onClose={reset}
        onChat={() => onIdentify(result)}
      />
    )
  }

  return (
    <div className="page-camera">
      <div className="camera-container">
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              className="camera-feed"
              autoPlay
              playsInline
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div className="camera-controls">
              <button
                className="btn btn-primary btn-large"
                onClick={capturePhoto}
                disabled={loading}
              >
                <CameraIcon size={24} />
                Capture
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={20} />
                Upload Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>
          </>
        ) : (
          <>
            <img src={capturedImage} alt="Captured" className="captured-image" />
            {loading && (
              <div className="loading-overlay">
                <Loader className="spinner" size={48} />
                <p>Identifying plant...</p>
              </div>
            )}
          </>
        )}
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button className="btn btn-small" onClick={reset}>Try Again</button>
          </div>
        )}
      </div>
    </div>
  )
}
