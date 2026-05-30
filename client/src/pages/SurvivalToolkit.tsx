import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AlertTriangle, Flame, Droplet, Home, Compass, Heart, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";

/**
 * FloraIQ Survival Toolkit Page
 * Amber/orange accent theme for danger awareness
 */
export default function SurvivalToolkit() {
  const [activeTab, setActiveTab] = useState("scanner");

  const tabs = [
    { id: "scanner", label: "🔍 Scanner" },
    { id: "guide", label: "📖 Guide" },
    { id: "sos", label: "🆘 SOS" },
    { id: "trails", label: "🗺️ Trails" },
  ];

  const guides = [
    {
      icon: Flame,
      title: "Fire Starting",
      description: "Learn essential fire-building techniques for survival situations",
    },
    {
      icon: Droplet,
      title: "Water Purification",
      description: "Methods to find and purify water in wilderness environments",
    },
    {
      icon: Home,
      title: "Shelter Building",
      description: "Construct emergency shelters using natural materials",
    },
    {
      icon: Compass,
      title: "Navigation",
      description: "Navigate without tools using natural landmarks and sky",
    },
    {
      icon: Heart,
      title: "First Aid",
      description: "Basic medical care in remote locations",
    },
  ];

  const emergencyNumbers = [
    { region: "🇪🇺 EU", number: "112" },
    { region: "🇺🇸 US", number: "911" },
    { region: "🇬🇧 UK", number: "999" },
    { region: "🇦🇺 AU", number: "000" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Survival Toolkit</h1>
              <p className="text-xs text-muted-foreground">For hikers, campers, wilderness explorers</p>
            </div>
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
                  ? "border-amber-500 text-amber-400"
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
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <div className="glass rounded-xl p-12 border border-amber-500/30 text-center">
              <AlertTriangle className="w-16 h-16 text-amber-500/50 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-3">Survival Scanner</h3>
              <p className="text-muted-foreground mb-8">
                Identify dangerous organisms and learn survival techniques
              </p>
              <Link href="/scan?mode=survival">
                <Button className="bg-amber-500 hover:bg-amber-600 text-white hover-glow">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Open Survival Scanner
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Guide Tab */}
        {activeTab === "guide" && (
          <div className="space-y-6 animate-fade-in-up">
            {guides.map((guide, idx) => {
              const Icon = guide.icon;
              return (
                <div
                  key={idx}
                  className="glass rounded-lg p-6 border border-border/50 card-hover cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/30 transition">
                      <Icon className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{guide.title}</h4>
                      <p className="text-sm text-muted-foreground">{guide.description}</p>
                    </div>
                    <span className="text-amber-400 group-hover:translate-x-1 transition">→</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SOS Tab */}
        {activeTab === "sos" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <div className="glass rounded-xl p-12 border-2 border-red-500/50 bg-red-500/5 text-center">
              <div className="text-6xl mb-6 animate-pulse-glow">🆘</div>
              <h2 className="text-3xl font-bold text-red-400 mb-4">Emergency SOS Beacon</h2>
              <p className="text-muted-foreground mb-8">
                Send an emergency distress signal to rescue services and emergency contacts
              </p>

              <Button className="w-full bg-red-500 hover:bg-red-600 text-white h-16 text-lg font-bold mb-6 animate-pulse-glow">
                SEND SOS
              </Button>

              <p className="text-sm text-muted-foreground mb-8">
                ✓ Works offline — sends when connected
              </p>

              {/* Emergency Numbers */}
              <div className="bg-background/50 rounded-lg p-6 border border-border/50">
                <h4 className="font-semibold mb-4">Emergency Numbers</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {emergencyNumbers.map((item) => (
                    <div key={item.number} className="glass rounded-lg p-4 border border-border/50 text-center">
                      <div className="text-2xl font-bold text-emerald-400 mb-1">{item.number}</div>
                      <div className="text-xs text-muted-foreground">{item.region}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trails Tab */}
        {activeTab === "trails" && (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <div className="glass rounded-lg p-8 border border-border/50 mb-8">
              <h3 className="font-semibold mb-6">Register Trail</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Trail Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Mount Everest Base Camp"
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Destination</label>
                  <input
                    type="text"
                    placeholder="e.g., Everest Region, Nepal"
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Expected Return</label>
                    <input
                      type="datetime-local"
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Emergency Contact</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                  <MapPin className="w-5 h-5 mr-2" />
                  Register Trail
                </Button>
              </div>
            </div>

            {/* Active Trails */}
            <div>
              <h3 className="font-semibold mb-4">Active Trails</h3>
              <div className="glass rounded-lg p-6 border border-border/50 text-center">
                <p className="text-muted-foreground">No active trails registered</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
