/**
 * PlantIdentification Page
 * Real-time plant identification with camera feed
 * Supports multi-language results and BioScan integration
 */

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Camera, Upload, Shield, MapPin, Globe } from 'lucide-react';
import { toast } from 'sonner';

interface PlantResult {
  scientificName: string;
  commonNames: Record<string, string>;
  confidence: number;
  description: string;
  characteristics: string[];
  careInstructions: Record<string, string>;
  habitat: string;
  riskLevel: 'safe' | 'caution' | 'dangerous';
  imageAnalysis: {
    leafShape: string;
    color: string;
    texture: string;
    estimatedHeight: string;
  };
}

interface LocationCoords {
  latitude: number;
  longitude: number;
}

export default function PlantIdentification() {
  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const [isLoading, setIsLoading] = useState(false);
  const [plantResult, setPlantResult] = useState<PlantResult | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [confidence, setConfidence] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'pt', label: 'Português' },
    { code: 'it', label: 'Italiano' },
    { code: 'ja', label: '日本語' },
    { code: 'zh', label: '中文' },
    { code: 'ko', label: '한국어' },
    { code: 'ar', label: 'العربية' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'ru', label: 'Русский' },
    { code: 'vi', label: 'Tiếng Việt' },
    { code: 'th', label: 'ภาษาไทย' },
    { code: 'tl', label: 'Filipino' },
  ];

  /**
   * Initialize camera stream
   */
  const initializeCamera = async () => {
    try {
      setIsLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'environment' },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }

      // Get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocation({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
          },
          () => console.warn('Location access denied')
        );
      }

      toast.success('Camera ready! Point at a plant to identify');
    } catch (error) {
      toast.error('Camera access denied. Please enable camera permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Capture frame from camera and send to backend
   */
  const captureFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      setIsLoading(true);

      const context = canvasRef.current.getContext('2d');
      if (!context) throw new Error('Canvas context unavailable');

      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);

      canvasRef.current.toBlob(async (blob) => {
        if (!blob) {
          toast.error('Failed to capture frame');
          return;
        }

        await identifyPlant(blob);
      }, 'image/jpeg', 0.85);
    } catch (error) {
      toast.error('Failed to capture frame');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle uploaded image file
   */
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await identifyPlant(file);
  };

  /**
   * Send image to backend for plant identification
   */
  const identifyPlant = async (imageFile: Blob) => {
    try {
      setIsLoading(true);
      setConfidence(0);

      const formData = new FormData();
      formData.append('image', imageFile, 'plant.jpg');
      formData.append('location', JSON.stringify(location));

      const response = await fetch(`/api/identify?lang=${selectedLanguage}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Identification failed');

      const result: PlantResult = await response.json();
      setPlantResult(result);
      setConfidence(Math.round(result.confidence * 100));

      // Save to FloraIQ location history
      if (location) {
        try {
          await fetch('/api/location/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plantIdentification: result, location: coords, userId: 'current_user' }),
          });
        } catch {}
      }

      toast.success(`✨ Identified: ${result.scientificName}`);
    } catch (error) {
      toast.error('Failed to identify plant');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get risk level badge color
   */
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'safe':
        return 'bg-green-100 text-green-800';
      case 'caution':
        return 'bg-yellow-100 text-yellow-800';
      case 'dangerous':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    if (mode === 'camera' && !streamRef.current) {
      initializeCamera();
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-900 mb-2">🌿 Flora IQ</h1>
          <p className="text-lg text-gray-700">Real-time plant identification powered by AI</p>
        </div>

        {/* Controls */}
        <div className="flex gap-4 justify-center mb-8 flex-wrap">
          <Button
            onClick={() => setMode('camera')}
            variant={mode === 'camera' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Camera size={18} /> Camera
          </Button>
          <Button
            onClick={() => setMode('upload')}
            variant={mode === 'upload' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Upload size={18} /> Upload Image
          </Button>

          {/* Language Selector */}
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 flex items-center gap-2"
          >
            <Globe size={18} className="inline mr-2" />
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>

          {location && (
            <div className="px-4 py-2 bg-blue-100 text-blue-900 rounded-lg flex items-center gap-2">
              <MapPin size={16} /> Location detected
            </div>
          )}
        </div>

        {/* Camera or Upload View */}
        {mode === 'camera' ? (
          <Card className="mb-8 overflow-hidden bg-black">
            <div className="relative aspect-video bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Capture Button */}
              <button
                onClick={captureFrame}
                disabled={isLoading}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-full p-4 transition"
              >
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Camera size={24} />}
              </button>
            </div>
          </Card>
        ) : (
          <Card className="mb-8 p-8 text-center bg-white border-2 border-dashed border-gray-300 hover:border-green-500 transition cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-4 w-full"
            >
              <Upload size={48} className="text-gray-400" />
              <div>
                <p className="text-lg font-semibold text-gray-900">Click to upload image</p>
                <p className="text-sm text-gray-600">or drag and drop</p>
              </div>
            </button>
          </Card>
        )}

        {/* Results */}
        {plantResult && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Main Plant Card */}
            <Card className="bg-white p-8 shadow-lg">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-green-900">{plantResult.scientificName}</h2>
                  <p className="text-lg text-gray-700 mt-2">
                    {plantResult.commonNames[selectedLanguage] || plantResult.commonNames['en']}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-4xl font-bold text-blue-600">{confidence}%</div>
                  <p className="text-sm text-gray-600">confidence</p>

                  <span className={`inline-block mt-4 px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(plantResult.riskLevel)}`}>
                    {plantResult.riskLevel === 'safe' ? '✓ Safe' : plantResult.riskLevel === 'caution' ? '⚠️ Caution' : '🚫 Dangerous'}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 mb-6">{plantResult.description}</p>

              {/* Visual Features */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Leaf Shape</p>
                  <p className="font-semibold text-gray-900">{plantResult.imageAnalysis.leafShape}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Color</p>
                  <p className="font-semibold text-gray-900">{plantResult.imageAnalysis.color}</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Texture</p>
                  <p className="font-semibold text-gray-900">{plantResult.imageAnalysis.texture}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Height</p>
                  <p className="font-semibold text-gray-900">{plantResult.imageAnalysis.estimatedHeight}</p>
                </div>
              </div>

              {/* Characteristics */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Key Characteristics</h3>
                <div className="flex flex-wrap gap-2">
                  {plantResult.characteristics.map((char, i) => (
                    <span key={i} className="px-3 py-1 bg-green-100 text-green-900 rounded-full text-sm">
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Care Instructions */}
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-amber-900 mb-4">🌱 Care Instructions</h3>
              <p className="text-amber-900 text-lg whitespace-pre-wrap">
                {plantResult.careInstructions[selectedLanguage] || plantResult.careInstructions['en']}
              </p>
            </Card>

            {/* Habitat Info */}
            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">🌍 Natural Habitat</h3>
              <p className="text-blue-900 text-lg">{plantResult.habitat}</p>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                onClick={() => setPlantResult(null)}
                variant="outline"
                className="px-6 py-2"
              >
                Identify Another Plant
              </Button>

              {location && (
                <Button
                  onClick={() => { /* saved automatically */ }}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <MapPin size={18} /> Save to Species Map
                </Button>
              )}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <Loader2 className="animate-spin text-green-600" size={48} />
            <p className="text-lg text-gray-700">Identifying with FloraIQ AI...</p>
          </div>
        )}
      </div>
    </div>
  );
}
