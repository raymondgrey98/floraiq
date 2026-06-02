import { useState, useRef, useCallback } from "react";
import { Link } from "wouter";
import { ChevronLeft, Plus, Trash2, Upload, Microscope, RotateCcw } from "lucide-react";

interface Label {
  id: string;
  x: number; // percent 0-100
  y: number; // percent 0-100
  part: string;
  custom?: string;
}

const PLANT_PARTS: Record<string, { icon: string; color: string; info: string; function: string }> = {
  "Flower":   { icon:"🌸", color:"#ec4899", info:"Reproductive organ that attracts pollinators. Contains petals, stamens, and pistil.",                function:"Sexual reproduction, seed production, pollinator attraction" },
  "Fruit":    { icon:"🍅", color:"#ef4444", info:"Developed ovary containing seeds. Protects and disperses seeds. Edible in many species.",               function:"Seed protection, animal-assisted seed dispersal, nutrition storage" },
  "Leaf":     { icon:"🍃", color:"#22c55e", info:"Primary photosynthesis organ. Captures sunlight and CO₂ to produce sugars and oxygen.",                  function:"Photosynthesis, gas exchange, transpiration, food factory" },
  "Stem":     { icon:"🌿", color:"#84cc16", info:"Structural support connecting roots to leaves and flowers. Transports water and nutrients via xylem/phloem.", function:"Support, water transport, nutrient distribution, storage" },
  "Root":     { icon:"🪱", color:"#a78bfa", info:"Anchors plant in soil. Absorbs water and minerals. Some roots store energy (carrot, turmeric).",           function:"Anchoring, water absorption, mineral uptake, energy storage" },
  "Bark":     { icon:"🌲", color:"#92400e", info:"Outer protective layer of woody stems. Contains cork cells. Insulates against temperature extremes.",       function:"Protection, insulation, gas exchange via lenticels" },
  "Seed":     { icon:"🌰", color:"#f59e0b", info:"Contains embryo and food reserves. Protected by seed coat. Dispersed by wind, water, animals.",             function:"Reproduction, dormancy survival, species dispersal" },
  "Bud":      { icon:"🌱", color:"#10b981", info:"Undeveloped shoot containing embryonic leaves or flowers. Covered by protective bud scales.",               function:"New growth initiation, dormancy protection, flowering trigger" },
  "Petal":    { icon:"🌺", color:"#f472b6", info:"Coloured leaf-like structures of a flower. Attract pollinators through colour, pattern, and scent.",        function:"Pollinator attraction, pollen transfer facilitation" },
  "Stamen":   { icon:"⚡", color:"#fbbf24", info:"Male reproductive organ. Consists of anther (pollen-producing) and filament (stalk).",                     function:"Pollen production, male gamete delivery" },
  "Pistil":   { icon:"🎯", color:"#c084fc", info:"Female reproductive organ. Consists of stigma, style, and ovary. Receives pollen.",                        function:"Pollen reception, fertilisation, seed development" },
  "Node":     { icon:"🔵", color:"#60a5fa", info:"Point on stem where leaves, branches, or roots attach. Zone of active cell division.",                     function:"Leaf attachment, branching, adventitious root formation" },
};

const PRESETS = [
  { name:"Full Plant", labels:[
    { id:"1", x:50, y:15, part:"Flower" },
    { id:"2", x:65, y:30, part:"Fruit" },
    { id:"3", x:30, y:40, part:"Leaf" },
    { id:"4", x:50, y:60, part:"Stem" },
    { id:"5", x:50, y:88, part:"Root" },
  ]},
  { name:"Flower Detail", labels:[
    { id:"1", x:50, y:20, part:"Petal" },
    { id:"2", x:50, y:50, part:"Stamen" },
    { id:"3", x:50, y:65, part:"Pistil" },
    { id:"4", x:20, y:80, part:"Stem" },
  ]},
  { name:"Tree", labels:[
    { id:"1", x:50, y:15, part:"Bud" },
    { id:"2", x:25, y:35, part:"Leaf" },
    { id:"3", x:50, y:55, part:"Bark" },
    { id:"4", x:50, y:85, part:"Root" },
  ]},
];

const DEFAULT_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Tomato_plant_with_fruit_and_flower.jpg/800px-Tomato_plant_with_fruit_and_flower.jpg";

export default function PlantAnatomy() {
  const [image, setImage] = useState(DEFAULT_IMAGE);
  const [labels, setLabels] = useState<Label[]>(PRESETS[0].labels);
  const [selectedPart, setSelectedPart] = useState("Leaf");
  const [selected, setSelected] = useState<Label | null>(null);
  const [mode, setMode] = useState<"label"|"view">("view");
  const imgRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImageClick(e: React.MouseEvent<HTMLDivElement>) {
    if (mode !== "label") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const newLabel: Label = { id: Date.now().toString(), x, y, part: selectedPart };
    setLabels(prev => [...prev, newLabel]);
    setSelected(newLabel);
  }

  function removeLabel(id: string) {
    setLabels(prev => prev.filter(l => l.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImage(url);
    setLabels([]);
  }

  const info = selected ? PLANT_PARTS[selected.part] : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-14">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <Microscope className="w-5 h-5 text-emerald-400" />
          <div className="flex-1"><h1 className="text-lg font-bold">Plant Anatomy Lab</h1><p className="text-[11px] text-muted-foreground">Tap to label any part of a plant</p></div>
          <div className="flex gap-2">
            <button type="button" onClick={() => fileRef.current?.click()} className="text-xs glass border border-border/50 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-white flex items-center gap-1">
              <Upload className="w-3 h-3" />Upload
            </button>
            <button type="button" onClick={() => setLabels([])} className="text-xs glass border border-border/50 px-2 py-1.5 rounded-lg text-muted-foreground hover:text-red-400">
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={uploadImage} className="hidden" />
        </div>
      </div>

      <div className="container py-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Main image + labels */}
          <div className="lg:col-span-2 space-y-3">
            {/* Mode toggle */}
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setMode("view")} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${mode === "view" ? "bg-emerald-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>👁️ View</button>
              <button type="button" onClick={() => setMode("label")} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${mode === "label" ? "bg-blue-500 text-white" : "glass border border-border/50 text-muted-foreground"}`}>
                <Plus className="w-4 h-4" />Label Mode
              </button>
              {mode === "label" && <span className="text-xs text-blue-400 animate-pulse">Tap on plant to place label</span>}
            </div>

            {/* Presets */}
            <div className="flex gap-2">
              {PRESETS.map(p => (
                <button type="button" key={p.name} onClick={() => setLabels(p.labels)} className="text-xs glass border border-border/50 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-white transition">
                  {p.name}
                </button>
              ))}
            </div>

            {/* Image with labels */}
            <div
              ref={imgRef}
              onClick={handleImageClick}
              className={`relative rounded-2xl overflow-hidden border border-border/40 bg-black/20 ${mode === "label" ? "cursor-crosshair" : "cursor-default"}`}
              style={{ aspectRatio: "4/3" }}
            >
              <img
                src={image}
                alt="Plant"
                className="w-full h-full object-cover select-none"
                draggable={false}
                onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}
              />

              {/* Label pins */}
              {labels.map(label => {
                const partData = PLANT_PARTS[label.part];
                const isSelected = selected?.id === label.id;
                return (
                  <div
                    key={label.id}
                    style={{ left: `${label.x}%`, top: `${label.y}%`, position: "absolute", transform: "translate(-50%, -50%)", zIndex: isSelected ? 20 : 10 }}
                    onClick={(e) => { e.stopPropagation(); setSelected(isSelected ? null : label); }}
                  >
                    {/* Pin dot */}
                    <div className="relative group cursor-pointer">
                      <div
                        className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs shadow-lg transition-all ${isSelected ? "scale-125" : "scale-100 hover:scale-110"}`}
                        style={{ background: partData?.color || "#10b981" }}
                      >
                        <span>{partData?.icon || "📍"}</span>
                      </div>
                      {/* Label bubble */}
                      <div className={`absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap transition-all ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                        <div className="glass border border-white/20 rounded-lg px-2 py-1 flex items-center gap-1.5 shadow-xl">
                          <span className="text-xs font-bold text-white">{label.part}</span>
                          {mode === "label" && (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeLabel(label.id); }}
                              className="text-red-400 hover:text-red-300 ml-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        {/* Connector line */}
                        <div className="absolute right-full top-1/2 w-4 h-px" style={{ background: partData?.color || "#10b981" }} />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Mode hint overlay */}
              {mode === "label" && labels.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="glass border border-blue-500/40 rounded-xl px-4 py-2 text-sm text-blue-300">
                    👆 Tap anywhere on the plant to add a label
                  </div>
                </div>
              )}
            </div>

            {/* Selected part info card */}
            {selected && info && (
              <div className="glass rounded-2xl p-5 border" style={{ borderColor: info.color + "40" }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{info.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg">{selected.part}</h3>
                    <p className="text-xs text-muted-foreground">Plant anatomy</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="glass rounded-xl p-3 border border-border/30">
                    <p className="text-xs font-bold text-muted-foreground mb-1">DESCRIPTION</p>
                    <p className="text-sm">{info.info}</p>
                  </div>
                  <div className="glass rounded-xl p-3 border border-border/30">
                    <p className="text-xs font-bold text-muted-foreground mb-1">FUNCTION</p>
                    <p className="text-sm text-emerald-400">{info.function}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — part picker + legend */}
          <div className="space-y-4">
            {/* Active label selector */}
            {mode === "label" && (
              <div className="glass rounded-2xl p-4 border border-blue-500/20">
                <p className="text-xs font-bold text-muted-foreground mb-3">PLACING LABEL</p>
                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  {Object.entries(PLANT_PARTS).map(([part, data]) => (
                    <button
                      type="button"
                      key={part}
                      onClick={() => setSelectedPart(part)}
                      className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${selectedPart === part ? "bg-emerald-500/20 border border-emerald-500/40" : "hover:bg-border/30"}`}
                    >
                      <span className="text-lg">{data.icon}</span>
                      <span className="text-sm font-semibold">{part}</span>
                      <div className="ml-auto w-2 h-2 rounded-full" style={{ background: data.color }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="glass rounded-2xl p-4 border border-border/40">
              <p className="text-xs font-bold text-muted-foreground mb-3">PLANT PARTS GUIDE</p>
              <div className="space-y-2">
                {Object.entries(PLANT_PARTS).map(([part, data]) => {
                  const hasLabel = labels.some(l => l.part === part);
                  return (
                    <button
                      type="button"
                      key={part}
                      onClick={() => {
                        const found = labels.find(l => l.part === part);
                        if (found) setSelected(found === selected ? null : found);
                      }}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all text-left ${hasLabel ? "opacity-100" : "opacity-40"} ${selected?.part === part ? "bg-border/30" : "hover:bg-border/20"}`}
                    >
                      <span className="text-base">{data.icon}</span>
                      <span className="text-xs font-medium flex-1">{part}</span>
                      {hasLabel && <div className="w-2 h-2 rounded-full" style={{ background: data.color }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Use last scan */}
            <div className="glass rounded-2xl p-4 border border-emerald-500/20">
              <p className="text-xs font-bold text-muted-foreground mb-2">USE YOUR SCAN</p>
              <p className="text-xs text-muted-foreground mb-3">Load your last scanned plant and label its parts</p>
              <button
                type="button"
                onClick={() => {
                  const scan = localStorage.getItem("floraiq_last_scan");
                  if (scan) {
                    const data = JSON.parse(scan);
                    if (data.photoUrl) { setImage(data.photoUrl); setLabels([]); }
                  }
                }}
                className="w-full py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-sm font-bold hover:bg-emerald-500/30 transition"
              >
                Load Last Scan →
              </button>
            </div>

            {/* Stats */}
            <div className="glass rounded-2xl p-4 border border-border/40">
              <p className="text-xs font-bold text-muted-foreground mb-3">CURRENT LABELS</p>
              <p className="text-3xl font-bold text-emerald-400 mb-1">{labels.length}</p>
              <p className="text-xs text-muted-foreground">parts labeled</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {labels.map(l => (
                  <span key={l.id} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: (PLANT_PARTS[l.part]?.color || "#10b981") + "22", color: PLANT_PARTS[l.part]?.color || "#10b981" }}>
                    {l.part}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
