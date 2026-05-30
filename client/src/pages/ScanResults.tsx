import { Button } from "@/components/ui/button";
import { useState } from "react";
import { X, Share2, Download, MapPin, Leaf, AlertTriangle, Zap } from "lucide-react";
import { Link } from "wouter";

/**
 * FloraIQ Scan Results Page
 * Interactive results with animations and detailed organism information
 */
export default function ScanResults() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isExpanded, setIsExpanded] = useState(false);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "survival", label: "Survival" },
    { id: "taxonomy", label: "Taxonomy" },
    { id: "uses", label: "Uses" },
    { id: "location", label: "Location" },
  ];

  const organism = {
    name: "Monarch Butterfly",
    scientific: "Danaus plexippus",
    confidence: 94,
    dangerLevel: "SAFE",
    image: "🦋",
    description: "The Monarch butterfly is one of the most recognizable and well-studied butterflies in North America. Known for its distinctive orange and black coloration.",
    overview: {
      habitat: "Meadows, fields, and gardens with milkweed plants",
      lifespan: "2-6 weeks (except overwintering generation: 6-8 months)",
      diet: "Nectar from flowers; larvae feed on milkweed",
      behavior: "Known for their incredible multi-generational migration",
    },
    survival: {
      edible: false,
      toxicity: "Toxic to predators due to milkweed consumption",
      tips: [
        "Monarchs are not dangerous to humans",
        "Handle gently if needed - wings are delicate",
        "Important pollinator - protect milkweed habitats",
      ],
    },
    taxonomy: {
      kingdom: "Animalia",
      phylum: "Arthropoda",
      class: "Insecta",
      order: "Lepidoptera",
      family: "Nymphalidae",
      genus: "Danaus",
      species: "D. plexippus",
    },
    uses: [
      "Pollinator for native plants",
      "Indicator species for ecosystem health",
      "Educational value for studying migration",
      "Cultural significance in Mexican traditions",
    ],
    location: {
      detected: "North America",
      confidence: "High",
      coordinates: "40.7128° N, 74.0060° W",
      season: "Summer (July-September)",
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold">Scan Result</h1>
          <Link href="/scan">
            <Button variant="ghost" size="icon">
              <X className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Result Card */}
          <div className="lg:col-span-2">
            <div
              className={`glass rounded-2xl border border-emerald-500/30 overflow-hidden card-hover transition-all duration-500 ${
                isExpanded ? "lg:col-span-3" : ""
              }`}
            >
              {/* Image Section */}
              <div className="bg-gradient-to-br from-emerald-500/20 to-green-600/20 h-64 flex items-center justify-center text-8xl relative overflow-hidden">
                <div className="animate-float">{organism.image}</div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent pointer-events-none" />
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-4xl font-bold mb-2">{organism.name}</h2>
                  <p className="text-lg text-muted-foreground italic mb-4">{organism.scientific}</p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    <div className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full font-semibold">
                      {organism.confidence}% Confidence
                    </div>
                    <div className={`px-4 py-2 rounded-full font-semibold ${
                      organism.dangerLevel === "SAFE"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {organism.dangerLevel}
                    </div>
                  </div>

                  <p className="text-foreground leading-relaxed">{organism.description}</p>
                </div>

                {/* Tabs */}
                <div className="border-b border-border/50 mb-6 overflow-x-auto">
                  <div className="flex gap-8">
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

                {/* Tab Content */}
                <div className="animate-fade-in-up">
                  {activeTab === "overview" && (
                    <div className="space-y-4">
                      {Object.entries(organism.overview).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-start">
                          <span className="text-muted-foreground capitalize font-medium">{key}:</span>
                          <span className="text-right max-w-xs">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "survival" && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-amber-400" />
                          Toxicity
                        </h4>
                        <p className="text-muted-foreground">{organism.survival.toxicity}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Survival Tips</h4>
                        <ul className="space-y-2">
                          {organism.survival.tips.map((tip, idx) => (
                            <li key={idx} className="flex gap-3 text-muted-foreground">
                              <span className="text-emerald-400 mt-1">✓</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === "taxonomy" && (
                    <div className="space-y-3">
                      {Object.entries(organism.taxonomy).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center p-3 bg-background/50 rounded-lg border border-border/50">
                          <span className="text-muted-foreground capitalize font-medium">{key}</span>
                          <span className="font-semibold">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "uses" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {organism.uses.map((use, idx) => (
                        <div key={idx} className="glass rounded-lg p-4 border border-border/50 card-hover">
                          <p className="font-semibold text-sm">{use}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "location" && (
                    <div className="space-y-4">
                      <div className="glass rounded-lg p-6 border border-border/50">
                        <div className="flex items-start gap-4 mb-4">
                          <MapPin className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold mb-2">Detected Location</h4>
                            <p className="text-muted-foreground mb-2">{organism.location.detected}</p>
                            <p className="text-sm text-muted-foreground">Coordinates: {organism.location.coordinates}</p>
                            <p className="text-sm text-muted-foreground">Season: {organism.location.season}</p>
                          </div>
                        </div>
                        <div className="bg-background/50 rounded-lg h-48 flex items-center justify-center text-muted-foreground border border-border/50">
                          🗺️ Interactive Map
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="glass rounded-lg p-6 border border-border/50">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Result
                </Button>
                <Button variant="outline" className="w-full border-border/50">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button variant="outline" className="w-full border-border/50">
                  <Leaf className="w-4 h-4 mr-2" />
                  Add to Journal
                </Button>
              </div>
            </div>

            {/* Similar Species */}
            <div className="glass rounded-lg p-6 border border-border/50">
              <h3 className="font-semibold mb-4">Similar Species</h3>
              <div className="space-y-3">
                {["Viceroy Butterfly", "Queen Butterfly", "Painted Lady"].map((species) => (
                  <button
                    key={species}
                    className="w-full text-left p-3 rounded-lg bg-background/50 border border-border/50 hover:border-emerald-500/50 transition text-sm"
                  >
                    {species}
                  </button>
                ))}
              </div>
            </div>

            {/* Information */}
            <div className="glass rounded-lg p-6 border border-border/50">
              <h3 className="font-semibold mb-4">Did You Know?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Monarch butterflies migrate up to 3,000 miles from Canada to Mexico, making it one of the longest insect migrations on Earth!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
