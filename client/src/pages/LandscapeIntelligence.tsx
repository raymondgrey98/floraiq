import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Globe, Upload, Search, AlertTriangle, Leaf, Zap, MapPin } from "lucide-react";
import { Link } from "wouter";

/**
 * FloraIQ Landscape Intelligence Page
 * Military-style dashboard with environment analysis
 */
export default function LandscapeIntelligence() {
  const [activeTab, setActiveTab] = useState("scanner");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "scanner", label: "Scanner" },
    { id: "cooking", label: "Cooking Guide" },
    { id: "region", label: "Region Intel" },
    { id: "history", label: "History" },
  ];

  const ediblePlants = [
    { name: "Moringa", icon: "🌿" },
    { name: "Dandelion", icon: "🌼" },
    { name: "Stinging Nettle", icon: "🌱" },
    { name: "Bamboo Shoot", icon: "🎋" },
    { name: "Wild Garlic", icon: "🧄" },
  ];

  const regions = [
    { emoji: "🦁", title: "Apex Predators", items: ["Lion", "Tiger", "Bear"] },
    { emoji: "🐍", title: "Venomous Creatures", items: ["Cobra", "Viper", "Scorpion"] },
    { emoji: "☠️", title: "Toxic Plants", items: ["Hemlock", "Nightshade", "Ricin"] },
    { emoji: "🍃", title: "Edible Plants", items: ["Clover", "Sorrel", "Chickweed"] },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold">Landscape Intelligence</h1>
          </div>
          <Link href="/">
            <Button variant="ghost">Back</Button>
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-16 z-30 glass border-b border-border">
        <div className="container flex gap-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-4 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-emerald-500 text-emerald-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container py-12">
        {/* Scanner Tab */}
        {activeTab === "scanner" && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Upload Zone */}
            <div className="glass rounded-xl border-2 border-dashed border-emerald-500/30 p-12 text-center">
              <MapPin className="w-16 h-16 text-emerald-500/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Upload Environment Photo</h3>
              <p className="text-muted-foreground mb-6">Analyze landscape, terrain, and environmental conditions</p>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white hover-glow">
                <Upload className="w-5 h-5 mr-2" />
                Upload Image
              </Button>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Environment Type */}
              <div className="glass rounded-lg p-6 border border-border/50 card-hover">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-400" />
                  Environment Type
                </h4>
                <div className="space-y-2">
                  <div className="inline-block bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-semibold">
                    Tropical Rainforest
                  </div>
                </div>
              </div>

              {/* Climate Zone */}
              <div className="glass rounded-lg p-6 border border-border/50 card-hover">
                <h4 className="font-semibold mb-4">Climate Zone</h4>
                <div className="space-y-2">
                  <div className="inline-block bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold">
                    Tropical Wet
                  </div>
                </div>
              </div>

              {/* Safety Score */}
              <div className="glass rounded-lg p-6 border border-border/50 card-hover">
                <h4 className="font-semibold mb-4">Camping Safety</h4>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">7/10</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Moderate Risk</span>
                </div>
              </div>
            </div>

            {/* Dangers Section */}
            <div className="glass rounded-lg p-6 border border-red-500/20">
              <h4 className="font-semibold mb-4 flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                Potential Dangers
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="font-semibold text-sm mb-2">🦁 Apex Predators</p>
                  <p className="text-sm text-muted-foreground">Jaguar, Anaconda, Caiman</p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="font-semibold text-sm mb-2">🐍 Venomous Creatures</p>
                  <p className="text-sm text-muted-foreground">Fer-de-Lance, Bushmaster</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cooking Guide Tab */}
        {activeTab === "cooking" && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="glass rounded-lg p-6 border border-border/50">
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Enter plant name (e.g., Moringa)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  <Search className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {ediblePlants.map((plant) => (
                  <button
                    key={plant.name}
                    className="glass px-4 py-2 rounded-full border border-emerald-500/30 hover:border-emerald-500 transition text-sm"
                  >
                    {plant.icon} {plant.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Cooking Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {["Boiling", "Roasting", "Raw", "Preservation"].map((method) => (
                <div key={method} className="glass rounded-lg p-6 border border-border/50 card-hover text-center">
                  <h4 className="font-semibold mb-2">{method}</h4>
                  <p className="text-sm text-muted-foreground">15-30 min</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Region Intel Tab */}
        {activeTab === "region" && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="glass rounded-lg p-6 border border-border/50 mb-8">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Enter country or region..."
                  className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Get Intel</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {regions.map((region) => (
                <div key={region.title} className="glass rounded-lg p-6 border border-border/50 card-hover">
                  <h4 className="font-semibold mb-4 text-lg">{region.emoji} {region.title}</h4>
                  <ul className="space-y-2">
                    {region.items.map((item) => (
                      <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="glass rounded-lg p-8 border border-border/50 text-center">
            <Zap className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No analysis history yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
