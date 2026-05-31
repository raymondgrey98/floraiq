import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const TEAS = [
  { name:"Serai (Lemongrass) Tea",emoji:"🌾",parts:"Stems",brew:"Bruise 2-3 stems, boil 10 min in 500ml water",flavour:"Citrusy, refreshing, slightly sweet",benefits:"Anxiety relief, digestion, fever reduction, mosquito repellent",cold:true,add:"Pandan leaf, ginger, honey",common:"Most common herbal tea in Malaysia — sold everywhere" },
  { name:"Pandan Tea",emoji:"🌿",parts:"Fresh or dried leaves",brew:"Boil 5-6 leaves tied in knot for 10 min",flavour:"Nutty, vanilla-like, aromatic",benefits:"Anxiety, blood pressure, pain relief",cold:true,add:"Lemongrass, coconut milk, sugar",common:"Very common in Malaysia — natural green colour" },
  { name:"Halia (Ginger) Tea",emoji:"🌿",parts:"Fresh rhizome",brew:"Slice 5-6 pieces, boil 15 min with jaggery or honey",flavour:"Spicy, warming, pungent",benefits:"Nausea, cold, flu, digestion, anti-inflammatory",cold:false,add:"Lemon, honey, turmeric (golden milk)",common:"Universal remedy in Malaysia — teh halia available in all mamak" },
  { name:"Kunyit (Turmeric) Tea",emoji:"🌿",parts:"Fresh or dried rhizome",brew:"Boil sliced turmeric 15 min, add black pepper (enhances absorption)",flavour:"Earthy, slightly bitter, warm",benefits:"Anti-inflammatory, joint pain, liver health, antioxidant",cold:false,add:"Ginger, honey, black pepper, coconut milk",common:"Golden milk popular. Bright yellow colour from curcumin" },
  { name:"Pegaga (Gotu Kola) Tea",emoji:"🌿",parts:"Fresh or dried leaves",brew:"Boil handful leaves 10 min or blend fresh",flavour:"Mild, slightly grassy, fresh",benefits:"Memory, brain function, wound healing, anxiety",cold:true,add:"Honey, lime, fresh",common:"Traditional Malay health drink. Sold fresh in markets" },
  { name:"Misai Kucing Tea",emoji:"🌿",parts:"Fresh or dried leaves and flowers",brew:"Boil handful dried herb 10-15 min",flavour:"Mild, slightly earthy",benefits:"Kidney stones, UTI, hypertension, gout",cold:true,add:"Honey, lemon",common:"Widely sold in Malaysian pharmacies and health shops" },
  { name:"Hempedu Bumi Tea",emoji:"🌿",parts:"Dried whole plant",brew:"Boil dried herb 15 min — very bitter",flavour:"EXTREMELY bitter — traditional bitter tea",benefits:"Fever, malaria, liver protection, immune boost",cold:false,add:"Honey (lots of it!), or take as capsule",common:"Sold in pharmacies. Traditional fever remedy — very bitter but effective" },
  { name:"Daun Jambu Batu Tea",emoji:"🍃",parts:"Young guava leaves",brew:"Boil 10 young leaves 10 min",flavour:"Mild astringent, slightly tannic",benefits:"Diarrhoea (proven), blood sugar, antibacterial",cold:true,add:"Honey, ginger",common:"Traditional anti-diarrhoea remedy backed by science" },
  { name:"Roselle Tea",emoji:"🌺",parts:"Dried calyx (sepals)",brew:"Pour boiling water over dried roselle, steep 5 min",flavour:"Tart, cranberry-like, refreshing",benefits:"Blood pressure, antioxidant, digestion, vitamin C",cold:true,add:"Honey, sugar, ice",common:"Widely grown in Malaysia. Brilliant red colour. Also called hibiscus tea" },
  { name:"Moringa Leaf Tea",emoji:"🌿",parts:"Fresh or dried leaves",brew:"Steep dried leaves 5-10 min or blend fresh",flavour:"Mild, slightly grassy, similar to green tea",benefits:"Nutrition powerhouse — all vitamins, protein, iron",cold:true,add:"Honey, lemon, ginger",common:"Growing in popularity as superfood tea. Easy to grow at home" },
  { name:"Peppermint / Wild Mint Tea",emoji:"🌿",parts:"Fresh leaves",brew:"Steep fresh or dried leaves 5 min in hot water",flavour:"Cool, refreshing, minty",benefits:"Headache, IBS, digestion, sinus relief, focus",cold:true,add:"Honey, lemon, fresh",common:"Grows in Malaysian highlands. Great cold brew in fridge overnight" },
  { name:"Butterfly Pea Flower Tea",emoji:"💙",parts:"Dried flowers",brew:"Steep 5-10 flowers in hot water — turns blue",flavour:"Mild, slightly earthy, light floral",benefits:"Antioxidant, memory, eye health, hair growth",cold:true,add:"Lemon juice changes colour to purple! Add honey",common:"Very popular Instagram tea in Malaysia — magical colour change with lemon" },
  { name:"Cinnamon Bark Tea",emoji:"🌳",parts:"Bark sticks or powder",brew:"Simmer 1 stick in water 20 min",flavour:"Warm, sweet, spicy",benefits:"Blood sugar, digestion, antibacterial, antioxidant",cold:false,add:"Honey, apple, clove, ginger",common:"Kayu manis — common spice in Malaysian kitchen. Easy tea." },
  { name:"Daun Salam Tea",emoji:"🌿",parts:"Fresh or dried bay-like leaves",brew:"Boil 5-7 leaves 10-15 min",flavour:"Mild, slightly herbal, warming",benefits:"Blood sugar, cholesterol, digestion",cold:false,add:"Honey, ginger",common:"Indonesian/Malaysian bay leaf — different from European bay. Common in Malaysian cooking" },
];

export default function WildTea() {
  const [selected, setSelected] = useState(TEAS[0]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🍵</span>
          <div><h1 className="text-xl font-bold">Wild Tea Plants</h1><p className="text-xs text-muted-foreground">14 Malaysian plants you can brew into tea</p></div>
        </div>
      </div>
      <div className="container py-4 max-w-5xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
          {TEAS.map(t => (
            <button type="button" key={t.name} onClick={() => setSelected(t)}
              className={`glass rounded-xl p-3 border transition-all text-center ${selected.name === t.name ? "border-amber-500/60 bg-amber-500/10" : "border-border/40 hover:border-amber-500/30"}`}>
              <p className="text-2xl mb-1">{t.emoji}</p>
              <p className="text-xs font-semibold leading-tight">{t.name.split(" ")[0]}</p>
            </button>
          ))}
        </div>
        <div className="glass rounded-xl p-6 border border-amber-500/30">
          <div className="flex items-center gap-3 mb-4"><span className="text-4xl">{selected.emoji}</span><div><h2 className="text-xl font-bold">{selected.name}</h2><p className="text-xs text-muted-foreground">{selected.common}</p></div>{selected.cold && <span className="ml-auto text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full font-bold">Can Cold Brew</span>}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[["🌿 Parts Used", selected.parts],["🫖 How to Brew", selected.brew],["👅 Flavour", selected.flavour],["💊 Benefits", selected.benefits],["➕ Add With", selected.add]].map(([l,v]) => (
              <div key={String(l)} className="glass rounded-lg p-3 border border-border/40"><p className="text-xs font-bold text-amber-400 mb-1">{l}</p><p className="text-sm text-muted-foreground">{v}</p></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
