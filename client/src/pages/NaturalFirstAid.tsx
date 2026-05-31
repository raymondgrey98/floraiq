import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, AlertTriangle } from "lucide-react";

const AIDS = [
  { condition:"Cuts & Wounds", emoji:"🩸", plants:[{name:"Turmeric (Kunyit)",use:"Pack wound with turmeric paste — strong antibacterial, stops bleeding"},{name:"Daun Sirih (Betel Leaf)",use:"Press fresh leaf on wound — antiseptic, stops bleeding fast"},{name:"Spider web (bersih)",use:"Emergency — pack web in clean wound as coagulant"},{name:"Banana leaf inner stem",use:"Squeeze sap onto cut — mild antiseptic, cooling"}], warning:"Deep wounds or heavy bleeding — seek medical help immediately. Clean wound first." },
  { condition:"Mosquito Bites & Stings", emoji:"🦟", plants:[{name:"Aloe Vera",use:"Apply fresh gel directly — cools, reduces itching and swelling"},{name:"Basil leaves",use:"Crush fresh leaves, apply juice — antihistamine effect"},{name:"Lemongrass",use:"Rub cut stem on bites — repels and soothes"},{name:"Baking soda + water",use:"Paste on sting — neutralises acid venom"}], warning:"Severe allergic reaction (throat swelling, difficulty breathing) — call 999 immediately." },
  { condition:"Bee/Wasp Sting", emoji:"🐝", plants:[{name:"Raw onion or garlic",use:"Slice and press on sting — draws out venom"},{name:"Mud or clay",use:"Apply cool mud — traditional method, draws venom"},{name:"Daun sirih",use:"Crush and apply — antiseptic, reduces swelling"},{name:"Ice (if available)",use:"Apply wrapped ice — reduces pain and swelling"}], warning:"Remove stinger first by scraping (not squeezing). Multiple stings or allergy = emergency 999." },
  { condition:"Fever", emoji:"🌡️", plants:[{name:"Hempedu Bumi",use:"Boil leaves, drink tea — proven antipyretic in studies"},{name:"Sambung Nyawa",use:"Eat 3-5 raw leaves or juice — reduces fever in Malay tradition"},{name:"Young coconut water",use:"Drink fresh — rehydrates, cooling, electrolytes"},{name:"Pegaga juice",use:"Drink fresh juice — cooling, anti-inflammatory"}], warning:"Fever above 39°C for more than 2 days, or with stiff neck/rash — seek doctor immediately." },
  { condition:"Headache", emoji:"🤕", plants:[{name:"Halia (Ginger)",use:"Boil and drink — anti-inflammatory, relieves tension headache"},{name:"Lemongrass tea",use:"Boil serai, drink — relieves headache and sinus"},{name:"Daun mint",use:"Crush fresh leaves, rub on temples"},{name:"Pandan leaves",use:"Smell fresh crushed leaves — aromatherapy effect"}], warning:"Sudden severe headache, worst of life, with neck stiffness or vision changes = emergency." },
  { condition:"Stomach Pain/Diarrhoea", emoji:"🤢", plants:[{name:"Young guava leaves",use:"Boil 5-6 young leaves, drink tea — proven anti-diarrhoea"},{name:"Ginger tea",use:"Boil ginger slices — relieves nausea, cramps, bloating"},{name:"Coconut water",use:"Drink fresh — rehydration, electrolytes lost in diarrhoea"},{name:"Banana",use:"Eat ripe banana — binds stool, adds potassium"}], warning:"Bloody diarrhoea, high fever, or signs of dehydration (no urination) — seek medical help." },
  { condition:"Toothache", emoji:"🦷", plants:[{name:"Clove oil",use:"Soak cotton ball, apply to tooth — eugenol proven dental anaesthetic"},{name:"Garlic",use:"Crush raw garlic, apply to tooth — allicin is antibacterial"},{name:"Raw ginger",use:"Chew raw ginger near painful tooth — anti-inflammatory"},{name:"Salt water rinse",use:"Warm salt water gargle — kills bacteria, reduces swelling"}], warning:"Abscess, extreme swelling, or fever = dental emergency. Antibiotics needed." },
  { condition:"Burns (Minor)", emoji:"🔥", plants:[{name:"Aloe Vera gel",use:"Apply fresh gel immediately — proven to speed healing, reduces pain"},{name:"Coconut oil",use:"Apply thin layer on mild burn — antimicrobial, moisturising"},{name:"Raw honey",use:"Apply medical grade honey — powerful antibacterial wound dressing"},{name:"Cool water first",use:"Run cool (not cold) water for 20 minutes before applying anything"}], warning:"Burns larger than palm, deep burns, face/hand/genitals burns = emergency hospital." },
  { condition:"Leech Bite", emoji:"🩸", plants:[{name:"Salt",use:"Pour salt on leech — detaches immediately and safely"},{name:"Tobacco juice",use:"Apply — causes leech to release"},{name:"Lime juice",use:"Squeeze citrus on leech — acid causes release"},{name:"Do NOT pull",use:"Pulling leaves mouth parts in wound causing infection"}], warning:"Don't panic — leeches are not dangerous. Clean wound after, apply antiseptic." },
  { condition:"Eye Irritation", emoji:"👁️", plants:[{name:"Clean water",use:"Flush eye with clean water for 10-15 minutes immediately"},{name:"Cool cucumber slice",use:"Place on closed eyelid — reduces inflammation"},{name:"Rose water",use:"Drop in eye as wash — cooling, mild antiseptic"},{name:"Cool used tea bag",use:"Place on closed eye — tannins reduce swelling"}], warning:"Chemical in eye, severe pain, or vision change = emergency hospital. Don't rub." },
  { condition:"Muscle Pain & Cramps", emoji:"💪", plants:[{name:"Turmeric + black pepper",use:"Drink as paste in warm milk — curcumin reduces inflammation"},{name:"Ginger compress",use:"Grate ginger, wrap in cloth, apply warm to muscle"},{name:"Lemongrass oil rub",use:"Massage oil into muscle — improves circulation"},{name:"Banana",use:"Eat for potassium — prevents and relieves cramps"}], warning:"Severe swelling, bruising after injury, or inability to bear weight = seek medical help." },
  { condition:"Skin Rash / Allergy", emoji:"🔴", plants:[{name:"Aloe Vera",use:"Apply gel — cools, soothes, anti-inflammatory"},{name:"Coconut oil",use:"Apply to dry irritated skin — antimicrobial, moisturising"},{name:"Oatmeal paste",use:"Apply to rash — proven to reduce itching and inflammation"},{name:"Daun sirih",use:"Boil leaves, use as wash on affected skin — antiseptic"}], warning:"Rash with breathing difficulty, throat swelling, or spreading rapidly = 999 emergency." },
];

export default function NaturalFirstAid() {
  const [selected, setSelected] = useState(AIDS[0]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">🩹</span>
          <div><h1 className="text-xl font-bold">Plant First Aid</h1><p className="text-xs text-muted-foreground">Jungle & kampung plant remedies — Malaysia</p></div>
        </div>
      </div>
      <div className="container py-4 max-w-5xl">
        <div className="glass rounded-xl p-3 border border-amber-500/30 mb-4"><p className="text-xs text-amber-300">⚠️ These are traditional remedies for minor conditions. Always seek proper medical care for serious injuries or illness. Call 999 for emergencies.</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            {AIDS.map(a => (
              <button type="button" key={a.condition} onClick={() => setSelected(a)}
                className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${selected.condition === a.condition ? "border-red-500/60 bg-red-500/5" : "border-border/40 hover:border-red-500/30"}`}>
                <span className="text-xl">{a.emoji}</span>
                <p className="font-semibold text-sm">{a.condition}</p>
              </button>
            ))}
          </div>
          <div className="lg:col-span-2">
            <div className="glass rounded-xl p-5 border border-red-500/30 space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">{selected.emoji} {selected.condition}</h2>
              <div className="space-y-2">
                {selected.plants.map(p => (
                  <div key={p.name} className="glass rounded-lg p-3 border border-green-500/20">
                    <p className="font-semibold text-sm text-green-300">🌿 {p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.use}</p>
                  </div>
                ))}
              </div>
              <div className="glass rounded-lg p-3 border border-red-500/30 bg-red-950/20">
                <p className="text-xs font-bold text-red-400 mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />When to seek help</p>
                <p className="text-xs text-muted-foreground">{selected.warning}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
