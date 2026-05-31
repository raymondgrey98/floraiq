import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Search } from "lucide-react";

const PLANTS = [
  { name:"Pegaga",scientific:"Centella asiatica",emoji:"🌿",tradition:"Malay/Iban",uses:"Memory, wound healing, anxiety, skin",preparation:"Juice fresh leaves. Eat raw as ulam. Boil as tea.",dose:"1 cup juice or tea daily",warning:"Avoid in pregnancy. Don't exceed dose.",modern:"Proven: neuroprotective, wound healing (asiaticoside)" },
  { name:"Sambung Nyawa",scientific:"Gynura procumbens",emoji:"🌿",tradition:"Malay",uses:"Diabetes, hypertension, cancer (traditional)",preparation:"Eat 3-5 raw leaves daily or juice.",dose:"3-5 leaves daily",warning:"May interact with blood thinners. Not for pregnant women.",modern:"Studies show anti-diabetic, anti-inflammatory effects" },
  { name:"Hempedu Bumi",scientific:"Andrographis paniculata",emoji:"🌿",tradition:"Malay/Chinese",uses:"Fever, malaria, liver, immune support",preparation:"Boil dried leaves. Very bitter — often in capsule form.",dose:"Tea 3× daily during illness",warning:"Do NOT use in pregnancy. Very bitter — causes nausea if overdosed.",modern:"Proven anti-malarial, liver protective, immune stimulant" },
  { name:"Tongkat Ali",scientific:"Eurycoma longifolia",emoji:"🌳",tradition:"Malay/Iban",uses:"Male vitality, energy, testosterone, fertility",preparation:"Boil root bark. Widely sold in shops.",dose:"200-400mg extract daily",warning:"Avoid with hormone-sensitive conditions. Not for children.",modern:"Clinical trials confirm testosterone boost and anti-fatigue" },
  { name:"Kacip Fatimah",scientific:"Labisia pumila",emoji:"🌿",tradition:"Malay",uses:"Women's health, post-partum recovery, libido",preparation:"Boil roots and leaves. Sold in sachets.",dose:"1-2 cups daily",warning:"Avoid in pregnancy. Consult doctor if on medication.",modern:"Phytoestrogen effects confirmed in studies" },
  { name:"Misai Kucing",scientific:"Orthosiphon aristatus",emoji:"🌿",tradition:"Malay",uses:"Kidney stones, UTI, hypertension, gout",preparation:"Boil fresh or dried leaves for tea.",dose:"2-3 cups daily",warning:"Do not use if severe kidney disease. Drink plenty of water.",modern:"Diuretic effect proven. Reduces uric acid in studies" },
  { name:"Daun Dukung Anak",scientific:"Phyllanthus niruri",emoji:"🌿",tradition:"Malay",uses:"Hepatitis B, kidney stones, diabetes, fever",preparation:"Boil whole plant. Drink as tea.",dose:"1-2 cups daily",warning:"May lower blood sugar. Monitor if diabetic.",modern:"Antiviral against HBV proven. WHO recognises hepatoprotective" },
  { name:"Selusuh Fatimah",scientific:"Labisia spp.",emoji:"🌿",tradition:"Iban/Dayak",uses:"Childbirth facilitation (traditional Sarawak)",preparation:"Traditional decoction by Bidang (healer).",dose:"Traditional dose only",warning:"Only under experienced Bidang supervision. Never self-administer.",modern:"Used for centuries in Sarawak. Phytochemistry under study" },
  { name:"Akar Kuning",scientific:"Arcangelisia flava",emoji:"🌳",tradition:"Iban/Dayak",uses:"Malaria, jaundice, fever, infections",preparation:"Boil roots. Yellow-coloured water used as medicine.",dose:"1 cup decoction 2× daily",warning:"High dose toxic. Consult traditional healer for dose.",modern:"Berberine content proven antimalarial and antibacterial" },
  { name:"Mengkudu / Noni",scientific:"Morinda citrifolia",emoji:"🍈",tradition:"Malay",uses:"Hypertension, pain, immune, cancer (traditional)",preparation:"Blend ripe fruit with water. Ferment as juice.",dose:"30ml juice 2× daily",warning:"High potassium — avoid in kidney disease. Foul smell when ripe.",modern:"Antioxidant, pain relief, modest immune effects confirmed" },
  { name:"Pokok Cili Api",scientific:"Capsicum frutescens",emoji:"🌶️",tradition:"Malay/SEA",uses:"Pain relief (topical), circulation, metabolism",preparation:"Apply chili paste to joints. Eat for internal circulation.",dose:"Topical: small amount to painful area",warning:"Avoid on broken skin or near eyes.",modern:"Capsaicin proven analgesic — in many pharma products" },
  { name:"Halia Bara",scientific:"Zingiber zerumbet",emoji:"🌿",tradition:"Malay",uses:"Headache, toothache, anti-inflammatory, muscle pain",preparation:"Squeeze rhizome juice onto affected area or drink boiled rhizome.",dose:"External: apply juice. Internal: 1 cup decoction",warning:"Large doses may irritate stomach.",modern:"Zerumbone: proven anti-cancer, anti-inflammatory in studies" },
  { name:"Kunyit Hitam",scientific:"Curcuma caesia",emoji:"🌿",tradition:"Iban",uses:"Respiratory, snake bites (traditional Sarawak use)",preparation:"Boil black turmeric rhizome. Drink tea.",dose:"1 cup 2× daily",warning:"Expert ID essential — black turmeric rare and sometimes confused with toxic plants.",modern:"High curcuminoid content. Anti-inflammatory studies ongoing" },
  { name:"Bawang Dayak",scientific:"Eleutherine palmifolia",emoji:"🌸",tradition:"Dayak/Iban Borneo",uses:"Hypertension, cancer (traditional), heart disease",preparation:"Slice bulb, boil or eat raw.",dose:"2-3 slices daily or 1 cup tea",warning:"May lower blood pressure — monitor if on medication.",modern:"Multiple phytochemicals with anti-cancer properties identified" },
  { name:"Kayu Manis Hutan",scientific:"Cinnamomum spp.",emoji:"🌳",tradition:"Malay",uses:"Diabetes, digestion, anti-fungal",preparation:"Boil bark to make tea. Add to food.",dose:"1 cup tea daily, or 1/2 teaspoon powder",warning:"High dose thins blood. Avoid before surgery.",modern:"Blood sugar lowering effect proven in multiple trials" },
];

export default function MedicinalPlants() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(PLANTS[0]);
  const filtered = PLANTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.tradition.toLowerCase().includes(search.toLowerCase()) || p.uses.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">💊</span>
          <div><h1 className="text-xl font-bold">Medicinal Plants</h1><p className="text-xs text-muted-foreground">Traditional Malay, Iban & Dayak plant medicine</p></div>
        </div>
        <div className="container pb-3">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, use, or tradition..." className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
        </div>
      </div>
      <div className="container py-4 max-w-5xl">
        <div className="glass rounded-xl p-3 border border-amber-500/30 mb-4"><p className="text-xs text-amber-300">⚠️ Information is for educational purposes only. Consult a doctor or traditional healer before using medicinal plants. Not a substitute for medical treatment.</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5 max-h-[80vh] overflow-y-auto">
            {filtered.map(p => (
              <button type="button" key={p.name} onClick={() => setSelected(p)}
                className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selected.name === p.name ? "border-purple-500/60 bg-purple-500/5" : "border-border/40 hover:border-purple-500/30"}`}>
                <span className="text-xl">{p.emoji}</span>
                <div className="min-w-0"><p className="font-semibold text-sm truncate">{p.name}</p><p className="text-xs text-muted-foreground">{p.tradition} tradition</p></div>
              </button>
            ))}
          </div>
          <div className="lg:col-span-2">
            <div className="glass rounded-xl p-5 border border-purple-500/30 space-y-3">
              <div className="flex items-center gap-3 mb-1"><span className="text-3xl">{selected.emoji}</span><div><h2 className="text-xl font-bold">{selected.name}</h2><p className="text-xs text-muted-foreground italic">{selected.scientific}</p><p className="text-xs text-purple-400 font-bold">{selected.tradition} Traditional Medicine</p></div></div>
              {[["🌿 Traditional Uses", selected.uses, "border-green-500/30"],["🫖 Preparation", selected.preparation, "border-blue-500/30"],["📏 Dose", selected.dose, "border-emerald-500/30"],["🔬 Modern Research", selected.modern, "border-cyan-500/30"],["⚠️ Caution", selected.warning, "border-red-500/30"]].map(([l,v,b]) => (
                <div key={String(l)} className={`glass rounded-lg p-3 border ${b}`}><p className="text-xs font-bold text-muted-foreground mb-1">{l}</p><p className="text-sm">{v}</p></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
