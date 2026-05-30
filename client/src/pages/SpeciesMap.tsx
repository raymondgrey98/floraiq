import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Globe, Filter } from "lucide-react";
import { Link } from "wouter";

/**
 * FloraIQ Species Map Page
 * Interactive map with organism markers
 */
export default function SpeciesMap() {
  const [filterType, setFilterType] = useState("all");

  const filterOptions = ["All", "Plant", "Insect", "Bird", "Mushroom", "Reptile", "Marine"];
  const markerColors: Record<string, string> = {
    plant: "bg-green-500",
    insect: "bg-yellow-500",
    bird: "bg-blue-500",
    mushroom: "bg-purple-500",
    reptile: "bg-lime-500",
    marine: "bg-cyan-500",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold">Species Map</h1>
          </div>
          <Link href="/">
            <Button variant="ghost">Back</Button>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-16 z-30 glass border-b border-border">
        <div className="container flex items-center gap-4 py-4">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <div className="flex gap-2 overflow-x-auto">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => setFilterType(option.toLowerCase())}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  filterType === option.toLowerCase()
                    ? "bg-emerald-500 text-white"
                    : "glass border border-border/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative h-[calc(100vh-8rem)]">
        {/* Map Container */}
        <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
          {/* Map Background */}
          <svg className="w-full h-full opacity-20" viewBox="0 0 1000 600">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="1000" height="600" fill="url(#grid)" />
          </svg>

          {/* Markers */}
          <div className="absolute inset-0">
            {/* Sample markers */}
            {[
              { x: "25%", y: "35%", type: "plant", name: "Oak Tree", scientific: "Quercus robur" },
              { x: "45%", y: "50%", type: "bird", name: "Eagle", scientific: "Aquila chrysaetos" },
              { x: "65%", y: "40%", type: "insect", name: "Butterfly", scientific: "Papilio machaon" },
              { x: "75%", y: "60%", type: "mushroom", name: "Porcini", scientific: "Boletus edulis" },
              { x: "35%", y: "70%", type: "reptile", name: "Snake", scientific: "Natrix natrix" },
            ].map((marker, idx) => (
              <div
                key={idx}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: marker.x, top: marker.y }}
              >
                <div className={`w-4 h-4 rounded-full ${markerColors[marker.type]} animate-pulse`} />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 glass rounded-lg p-3 border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-sm">
                  <p className="font-semibold">{marker.name}</p>
                  <p className="text-xs text-muted-foreground italic">{marker.scientific}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 glass rounded-lg p-4 border border-border/50">
            <h3 className="font-semibold mb-3 text-sm">Legend</h3>
            <div className="space-y-2">
              {Object.entries(markerColors).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2 text-sm">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  <span className="text-muted-foreground capitalize">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
