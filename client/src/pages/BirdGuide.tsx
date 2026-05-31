import { useState, useRef } from "react";
import { Link } from "wouter";
import { ChevronLeft, Search, ExternalLink, Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const BIRDS = [
  { name:"White-Rumped Shama",scientific:"Copsychus malabaricus",emoji:"🐦",status:"LC",habitat:"Forests, gardens",call:"One of Malaysia's best singers — flute-like notes",found:"Common in Sarawak forests and gardens",note:"Popular caged bird in Malaysia. IUCN Least Concern." },
  { name:"Hornbill (Rhinoceros)",scientific:"Buceros rhinoceros",emoji:"🦜",status:"VU",habitat:"Lowland rainforest",call:"Loud roaring bark, heard far",found:"Symbol of Sarawak — Borneo forests",note:"State bird of Sarawak. Vulnerable due to deforestation." },
  { name:"Proboscis Monkey Bird",scientific:"Artamus leucoryn",emoji:"🐦",status:"LC",habitat:"Open areas, ricefields",call:"Harsh chattering",found:"Borneo, open farmland",note:"White-breasted woodswallow. Common near Kuching." },
  { name:"Common Myna",scientific:"Acridotheres tristis",emoji:"🐦",status:"LC",habitat:"Urban, farmland",call:"Loud varied chattering, mimics sounds",found:"Everywhere in Malaysian cities",note:"Very intelligent. Learns to mimic humans and car alarms." },
  { name:"Kingfisher (Collared)",scientific:"Todiramphus chloris",emoji:"🐦",status:"LC",habitat:"Mangroves, coasts, rivers",call:"Loud kek-kek-kek",found:"Common along Kuching rivers and coast",note:"White and blue. Most common kingfisher in Malaysia." },
  { name:"Brahminy Kite",scientific:"Haliastur indus",emoji:"🦅",status:"LC",habitat:"Coasts, rivers, wetlands",call:"Mewing cry",found:"Common in Kuching, coastal Sarawak",note:"Reddish-brown and white. Often seen soaring over rivers." },
  { name:"Long-Tailed Parakeet",scientific:"Psittacula longicauda",emoji:"🦜",status:"VU",habitat:"Forests, plantations",call:"Loud screeching in flocks",found:"Borneo, Peninsular Malaysia",note:"Vulnerable. Green with long tail. Flocks at sunrise." },
  { name:"Olive-Winged Bulbul",scientific:"Pycnonotus plumosus",emoji:"🐦",status:"LC",habitat:"Forests, gardens",call:"Cheerful whistled phrases",found:"Very common in Sarawak",note:"One of the most common birds in Malaysian gardens." },
  { name:"Plantain Squirrel",scientific:"Callosciurus notatus",emoji:"🐿️",status:"LC",habitat:"Gardens, forests",call:"Loud chip-chip alarm call",found:"Everywhere in Sarawak",note:"Technically a squirrel but often mistaken for a bird noise." },
  { name:"Rufous Piculet",scientific:"Sasia abnormis",emoji:"🐦",status:"LC",habitat:"Forest undergrowth",call:"High-pitched trill",found:"Borneo lowland forests",note:"Tiny woodpecker — one of the world's smallest." },
  { name:"Oriental Pied Hornbill",scientific:"Anthracoceros albirostris",emoji:"🦜",status:"LC",habitat:"Forest edges, plantations",call:"Loud cackling call",found:"Common in Sarawak — often seen near towns",note:"Most common hornbill in Malaysia. Black and white." },
  { name:"Little Egret",scientific:"Egretta garzetta",emoji:"🦢",status:"LC",habitat:"Wetlands, ricefields, rivers",call:"Harsh croak",found:"Common in Sarawak wetlands and ricefields",note:"White heron. Follows farmers in ricefields for insects." },
  { name:"Pacific Swallow",scientific:"Hirundo tahitica",emoji:"🐦",status:"LC",habitat:"Open areas, coasts, towns",call:"Soft twittering",found:"Everywhere in Malaysia",note:"Most common swallow. Nests under bridges and rooftops." },
  { name:"Asian Koel",scientific:"Eudynamys scolopaceus",emoji:"🐦",status:"LC",habitat:"Forests, gardens, urban",call:"Famous rising koo-OO-el repeated endlessly",found:"Very common in Malaysian cities",note:"Brood parasite — lays eggs in crow nests. Loud at dawn." },
  { name:"Stork-Billed Kingfisher",scientific:"Pelargopsis capensis",emoji:"🐦",status:"LC",habitat:"Rivers, mangroves",call:"Loud laughing call",found:"Common along Sarawak rivers",note:"Largest kingfisher in Malaysia. Huge red bill." },
];

export default function BirdGuide() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(BIRDS[0]);
  const [recording, setRecording] = useState(false);
  const [xenoResults, setXenoResults] = useState<any[]>([]);
  const [xenoLoading, setXenoLoading] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);

  const filtered = BIRDS.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.scientific.toLowerCase().includes(search.toLowerCase()) ||
    b.found.toLowerCase().includes(search.toLowerCase())
  );

  async function searchXeno(name: string) {
    setXenoLoading(true); setXenoResults([]);
    try {
      const r = await fetch(`https://xeno-canto.org/api/2/recordings?query=${encodeURIComponent(name + " cnt:Malaysia")}`, { signal: AbortSignal.timeout(8000) });
      const d = await r.json();
      setXenoResults((d.recordings || []).slice(0, 4));
    } catch { setXenoResults([]); }
    finally { setXenoLoading(false); }
  }

  function selectBird(b: typeof BIRDS[0]) {
    setSelected(b); setXenoResults([]);
    searchXeno(b.scientific);
  }

  const STATUS_COLORS: Record<string, string> = {
    LC: "text-green-400 bg-green-500/20", NT: "text-yellow-400 bg-yellow-500/20",
    VU: "text-amber-400 bg-amber-500/20", EN: "text-orange-400 bg-orange-500/20",
    CR: "text-red-400 bg-red-500/20",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🐦</span>
          <div>
            <h1 className="text-xl font-bold">Bird Guide</h1>
            <p className="text-xs text-muted-foreground">Sarawak & Malaysia birds + Xeno-canto sounds</p>
          </div>
        </div>
        <div className="container pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search birds..." className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <div className="container py-4 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5 max-h-[80vh] overflow-y-auto">
            {filtered.map(b => (
              <button type="button" key={b.scientific} onClick={() => selectBird(b)}
                className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${
                  selected.scientific === b.scientific ? "border-blue-500/60 bg-blue-500/5" : "border-border/40 hover:border-blue-500/30"
                }`}>
                <span className="text-xl">{b.emoji}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{b.name}</p>
                  <p className="text-xs text-muted-foreground italic truncate">{b.scientific}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-xl p-5 border border-blue-500/30">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-xl font-bold">{selected.name}</h2>
                  <p className="text-sm italic text-muted-foreground">{selected.scientific}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${STATUS_COLORS[selected.status] || ""}`}>{selected.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[["🏡 Habitat", selected.habitat],["📢 Call", selected.call],["📍 Found In", selected.found],["📝 Notes", selected.note]].map(([l,v]) => (
                  <div key={String(l)} className="glass rounded-lg p-3 border border-border/40">
                    <p className="text-xs font-bold text-blue-400 mb-1">{l}</p>
                    <p className="text-xs text-muted-foreground">{v}</p>
                  </div>
                ))}
              </div>

              {/* Xeno-canto sounds */}
              <div className="border-t border-border/40 pt-4">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-2 flex items-center gap-2">
                  🎵 Bird Sounds — Xeno-canto
                  {xenoLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                </p>
                {xenoResults.length > 0 ? (
                  <div className="space-y-2">
                    {xenoResults.map((r, i) => (
                      <div key={i} className="glass rounded-lg p-3 border border-blue-500/20">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-semibold">{r.loc || "Unknown location"} — {r.cnt}</p>
                          <span className="text-xs text-muted-foreground">{r.q} quality</span>
                        </div>
                        <audio controls className="w-full h-8" src={`https:${r.file}`} />
                      </div>
                    ))}
                  </div>
                ) : !xenoLoading && (
                  <p className="text-xs text-muted-foreground">No recordings found for this species in Malaysia.</p>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <a href={`https://ebird.org/species/${selected.scientific.replace(" ","").toLowerCase()}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs glass border border-border/50 px-3 py-1.5 rounded-lg text-teal-400 hover:text-teal-300">eBird</a>
                <a href={`https://xeno-canto.org/explore?query=${encodeURIComponent(selected.scientific)}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs glass border border-border/50 px-3 py-1.5 rounded-lg text-blue-400 hover:text-blue-300">Xeno-canto</a>
                <a href={`https://www.inaturalist.org/search?q=${encodeURIComponent(selected.scientific)}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs glass border border-border/50 px-3 py-1.5 rounded-lg text-green-400 hover:text-green-300">iNaturalist</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
