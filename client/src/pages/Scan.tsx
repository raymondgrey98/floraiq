import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Leaf, Bug, Bird, Waves, AlertTriangle, Upload, Camera, X, Sprout, Snail } from "lucide-react";
import { Link, useLocation } from "wouter";

/**
 * FloraIQ Scan/Identify Page
 * Premium organism selector with upload zone and animations
 */
export default function Scan() {
  const [selectedMode, setSelectedMode] = useState<string>("plant");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const modes = [
    { id: "plant", label: "Plant / Herb", icon: Leaf, color: "from-green-500 to-emerald-600" },
    { id: "insect", label: "Insect / Bug", icon: Bug, color: "from-yellow-500 to-orange-600" },
    { id: "bird", label: "Bird", icon: Bird, color: "from-blue-500 to-cyan-600" },
    { id: "mushroom", label: "Mushroom", icon: Sprout, color: "from-purple-500 to-pink-600" },
    { id: "reptile", label: "Reptile / Amphibian", icon: Snail, color: "from-lime-500 to-green-600" },
    { id: "marine", label: "Marine Life", icon: Waves, color: "from-blue-600 to-teal-600" },
    { id: "survival", label: "Survival Scan", icon: AlertTriangle, color: "from-red-500 to-orange-600" },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (previewImage) {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        // Navigate to results page
        window.location.href = '/scan-results';
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <X className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Identify Organism</h1>
          </div>
        </div>
      </div>

      <div className="container py-12">
        {/* Scan Mode Selector */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-6 text-muted-foreground">SCAN MODE</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {modes.map((mode) => {
              const Icon = mode.icon;
              const isSelected = selectedMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`glass rounded-lg p-6 border-2 transition-all duration-300 group ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
                      : "border-border/50 hover:border-emerald-500/50"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${mode.color} p-3 mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold text-sm">{mode.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Upload Zone */}
        <div className="max-w-2xl mx-auto mb-12">
          {!previewImage ? (
            <div className="glass rounded-xl border-2 border-dashed border-emerald-500/30 p-12 text-center hover:border-emerald-500/60 transition-colors">
              <div className="mb-6">
                <Camera className="w-16 h-16 text-emerald-500/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Upload or Capture</h3>
                <p className="text-muted-foreground">Drag and drop your image here, or click to browse</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer hover-glow">
                    <span>
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Image
                    </span>
                  </Button>
                </label>
                <Button variant="outline" className="border-emerald-500/30 text-emerald-400">
                  <Camera className="w-5 h-5 mr-2" />
                  Open Camera
                </Button>
              </div>
            </div>
          ) : (
            <div className="glass rounded-xl p-6 border border-emerald-500/30">
              <div className="relative mb-6 rounded-lg overflow-hidden">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-96 object-cover"
                />
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full p-2 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white h-12 text-lg font-semibold hover-glow"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin mr-2">
                      <div className="w-5 h-5 border-2 border-emerald-300 border-t-white rounded-full" />
                    </div>
                    Running Gemini → GPT-4o → Claude chain...
                  </>
                ) : (
                  "Analyze Image"
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="max-w-2xl mx-auto glass rounded-lg p-6 border border-border/50">
          <h3 className="font-semibold mb-3">Tips for Best Results</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Use clear, well-lit photos with good focus</li>
            <li>• Include distinctive features (leaves, flowers, patterns)</li>
            <li>• Avoid blurry or partially obscured subjects</li>
            <li>• Multiple angles improve identification accuracy</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
