import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const CURRENT = new Date().getMonth();

const CALENDAR: Record<number, { forage: string[]; plants: string[]; mushrooms: string[]; wildlife: string[]; tip: string }> = {
  0: { forage:["Wild fern shoots (paku pakis) — peak season","Bamboo shoots after rain","Ulam raja — lush growth","Pegaga — abundant in wet areas"], plants:["Plant padi — Musim Rendeng begins","Sow kangkung","Plant ginger and turmeric rhizomes"], mushrooms:["Cendawan tiram on logs","Termite mushroom after rain"], wildlife:["Terubok fish season in Batang Sarawak","Migrating birds arriving"], tip:"January is the height of Northeast Monsoon — heavy rain means excellent mushroom season and lush fern growth." },
  1: { forage:["Paku pakis — still abundant","Moringa leaves — fresh growth","Wild ginger shoots"], plants:["Continue padi planting","Sow tomato and chili seeds","Plant sweet potato slips"], mushrooms:["Cendawan kuning after rain","Wood ear on fallen logs"], wildlife:["Terubok season ends","Hornets active — avoid nests"], tip:"February brings drier spells between rain. Good time to find wild ginger along riverbanks." },
  2: { forage:["Bamboo shoots — excellent after rain","Wild banana flowers","Rambutan flowers (not yet fruit but edible)"], plants:["Harvest padi if planted January","Plant corn — good season","Sow cucumber seeds"], mushrooms:["Bracket fungi on dead trees","Lingzhi appearing"], wildlife:["Bearded pig foraging season begins","Proboscis monkey most active"], tip:"March: transition to drier season begins. Bamboo shoots explode after any rain." },
  3: { forage:["Wild fruits starting — jungle strawberries","Pegaga peak","Daun kaduk and jungle herbs"], plants:["Plant durian (grafted) — good season","Sow watermelon","Transplant chili seedlings"], mushrooms:["Termite mushroom common near mounds"], wildlife:["Bird migration peak — good birdwatching","Butterflies very active"], tip:"April brings excellent foraging for jungle herbs. Forest floor rich with edibles." },
  4: { forage:["Durian season starts (May-Aug)","Wild mango available","Jackfruit and cempedak"], plants:["Harvest rambutan (early varieties)","Continue vegetable planting","Oil palm harvesting ongoing"], mushrooms:["Cendawan kuning season","Rain forest mushrooms abundant"], wildlife:["Durian season — wildlife competition (orangutan, bears, deer)","Proboscis monkeys near river","Giant forest bees swarm near Tualang trees"], tip:"May: King of Fruits season begins! Monitor durian orchards. Wildlife activity peaks around fruiting trees." },
  5: { forage:["Durian peak season","Rambutan abundance","Langsat starting","Wild rambutans in forest"], plants:["Padi Gadu (second season) planting","Harvest pineapple","Plant sago — good season"], mushrooms:["After rain — termite mushroom common"], wildlife:["Bearded pig migration may begin in Borneo interior","Sambar deer in forest edge at dawn"], tip:"June: Multi-fruit season. Best time to forage Sarawak jungle for wild fruits. Check fruiting trees early morning." },
  6: { forage:["Rambutan peak — everywhere","Langsat abundant","Wild tamarind pods","Kedondong fruit"], plants:["Harvest early padi Gadu","Plant long beans","Sow kangkung heavily"], mushrooms:["Wood ear fungus — wet logs","Lingzhi season"], wildlife:["Rambutan season brings massive insect and wildlife activity","Hornbill active near fruiting figs"], tip:"July: Best month for tropical fruit foraging. Farmers markets overflow with rambutan. Pick from roadside trees (ask permission)." },
  7: { forage:["Last durian — buy cheap!","Mangosteen season","Starfruit season starts","Pomelo ripening"], plants:["Second padi harvest (if Gadu planted June)","Plant garlic and onion","Sow mustard greens"], mushrooms:["Gelam/tea tree mushroom season"], wildlife:["Bird of paradise sightings (rare)","Orangutan active in fruiting forest"], tip:"August: Mangosteen season! Queen of Fruits. Very short season. Also last chance for cheap durian." },
  8: { forage:["Wild fig season — watch for ficus trees","Pegaga — lush new growth","Ulam raja continues"], plants:["Prepare beds for next monsoon planting","Plant ginger (last chance before wet)","Sow fast crops — 30 day varieties"], mushrooms:["After September rains begin — bracket fungi"], wildlife:["Bird migration begins south","Fish spawning in many rivers — no-take period for some species"], tip:"September: Transition month. Prepare for Northeast Monsoon. Plant quick crops before heavy rain arrives." },
  9: { forage:["Pandan leaves at peak aromatic quality","Wild galangal in forest edges","Bamboo shoots after first monsoon rain"], plants:["Plant padi seeds for Rendeng (early)","Sow kangkung — prime growing season","Harvest sweet potato"], mushrooms:["Mushroom explosion as monsoon arrives","Termite mushroom common post-rain"], wildlife:["Migratory birds arriving in Sarawak","Fruit bat activity increases with fruiting"], tip:"October: First Northeast Monsoon rains bring mushroom bonanza. First 3 days after rain = best mushroom foraging." },
  10: { forage:["Paku pakis — excellent season","Tapioca leaves — abundant","Wild greens everywhere with rain"], plants:["Plant most vegetables — growing season","Plant padi Rendeng full effort","Rambutan trees flower (fruit Feb-Mar)"], mushrooms:["Best month for all mushrooms — peak season","Cendawan susu rimau — very rare but check"], wildlife:["Terubok fish season begins","Migratory ducks arrive in wetlands"], tip:"November: Best vegetable growing month in Sarawak. Everything grows fast with consistent rain and warmth." },
  11: { forage:["Year-end pineapple season","Star fruit late crop","Moringa — lush growth","Banana flowers abundant"], plants:["Harvest padi Rendeng","Plant Christmas vegetables — cabbage, radish","Prepare soil for New Year planting"], mushrooms:["Continue monsoon mushroom season"], wildlife:["Terubok peak season — Jan is best","Bats and swiftlets active near caves"], tip:"December: Harvest and celebration month. Padi harvest complete. Markets full of seasonal produce. Great birdwatching at RAMSAR wetlands." },
};

export default function ForagingCalendar() {
  const [month, setMonth] = useState(CURRENT);
  const data = CALENDAR[month];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <span className="text-2xl">📆</span>
          <div><h1 className="text-xl font-bold">Foraging Calendar</h1><p className="text-xs text-muted-foreground">What's edible in Malaysia each month</p></div>
        </div>
      </div>
      <div className="container py-6 max-w-4xl">
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5 mb-6">
          {MONTHS.map((m, i) => <button type="button" key={m} onClick={() => setMonth(i)} className={`py-2 rounded-lg text-xs font-bold transition-all ${month === i ? "bg-emerald-500 text-white" : i === CURRENT ? "glass border border-emerald-500/40 text-emerald-400" : "glass border border-border/40 text-muted-foreground hover:border-emerald-500/30"}`}>{m.slice(0,3)}</button>)}
        </div>
        <h2 className="text-2xl font-bold mb-1">{MONTHS[month]}</h2>
        <div className="glass rounded-lg p-3 border border-blue-500/20 mb-5"><p className="text-xs text-blue-300">💡 {data.tip}</p></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[["🌿 Wild Forage — What to Find", data.forage, "border-emerald-500/20", "emerald"],
            ["🌱 What to Plant", data.plants, "border-blue-500/20", "blue"],
            ["🍄 Mushroom Season", data.mushrooms, "border-purple-500/20", "purple"],
            ["🦜 Wildlife Activity", data.wildlife, "border-amber-500/20", "amber"]].map(([title, items, border]) => (
            <div key={String(title)} className={`glass rounded-xl p-5 border ${border}`}>
              <h3 className="font-bold text-sm mb-3">{String(title)}</h3>
              <ul className="space-y-1.5">{(items as string[]).map(item => <li key={item} className="flex gap-2 text-sm text-muted-foreground"><span className="text-emerald-400 flex-shrink-0">•</span>{item}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
