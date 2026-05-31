import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Leaf, CheckCircle, XCircle, Search } from "lucide-react";

interface Companion {
  plant: string;
  emoji: string;
  goodWith: { name: string; reason: string }[];
  badWith: { name: string; reason: string }[];
  notes: string;
}

const DATA: Companion[] = [
  {
    plant: "Tomato", emoji: "🍅",
    goodWith: [
      { name: "Basil", reason: "Repels aphids and whitefly, improves flavour" },
      { name: "Marigold", reason: "Repels nematodes and aphids from soil" },
      { name: "Carrot", reason: "Loosens soil around tomato roots" },
      { name: "Garlic", reason: "Repels spider mites and fungal disease" },
      { name: "Parsley", reason: "Attracts predatory insects that eat pests" },
    ],
    badWith: [
      { name: "Fennel", reason: "Toxic chemical inhibits tomato growth" },
      { name: "Brassica (Cabbage)", reason: "Compete for same nutrients, stunt each other" },
      { name: "Corn", reason: "Both attract earworms — doubles pest pressure" },
    ],
    notes: "Plant basil 30cm away. Marigolds as border. Avoid planting near last year's tomato spot.",
  },
  {
    plant: "Chili", emoji: "🌶️",
    goodWith: [
      { name: "Basil", reason: "Improves pepper flavour and repels aphids" },
      { name: "Carrot", reason: "Deep roots improve soil drainage" },
      { name: "Tomato", reason: "Shared pests confused by mixed planting" },
      { name: "Marigold", reason: "Repels nematodes in tropical soil" },
    ],
    badWith: [
      { name: "Fennel", reason: "Allelopathic — stunts chili growth" },
      { name: "Apricot", reason: "Susceptible to same fungal disease" },
    ],
    notes: "Chili grows well with most nightshades. Avoid rotating where solanums grew before.",
  },
  {
    plant: "Kangkung", emoji: "🥬",
    goodWith: [
      { name: "Lemongrass", reason: "Repels insects that target water spinach" },
      { name: "Pandan", reason: "Natural pest deterrent, aromatic barrier" },
      { name: "Sweet Potato", reason: "Ground cover reduces weeds, shares water" },
    ],
    badWith: [
      { name: "Mint", reason: "Mint is invasive and will crowd kangkung" },
    ],
    notes: "Fast-growing, good for mixed beds. Grows well in pots near water features.",
  },
  {
    plant: "Cucumber", emoji: "🥒",
    goodWith: [
      { name: "Marigold", reason: "Repels beetles and nematodes" },
      { name: "Sunflower", reason: "Provides trellis and shade for roots" },
      { name: "Dill", reason: "Attracts predatory wasps that eat cucumber pests" },
      { name: "Radish", reason: "Repels cucumber beetles underground" },
      { name: "Beans", reason: "Fix nitrogen for cucumbers to use" },
    ],
    badWith: [
      { name: "Potato", reason: "Both attract blight and spread disease" },
      { name: "Sage", reason: "Inhibits cucumber growth" },
      { name: "Fennel", reason: "Allelopathic to most garden vegetables" },
    ],
    notes: "Train cucumbers vertically to maximise space. Marigold border essential.",
  },
  {
    plant: "Padi / Rice", emoji: "🌾",
    goodWith: [
      { name: "Azolla (Water Fern)", reason: "Fixes nitrogen directly in paddy water" },
      { name: "Fish (Carp)", reason: "Eat pests, fertilise with waste" },
      { name: "Duck", reason: "Eat pests, weeds, fertilise — traditional Sarawak method" },
    ],
    badWith: [
      { name: "Corn", reason: "Compete for water in wet season" },
    ],
    notes: "Azolla + rice = free nitrogen fertilizer. Traditional integrated rice-fish farming used in Sarawak.",
  },
  {
    plant: "Banana", emoji: "🍌",
    goodWith: [
      { name: "Lemongrass", reason: "Repels insects and improves soil drainage" },
      { name: "Sweet Potato", reason: "Covers ground, reduces weeds" },
      { name: "Taro", reason: "Uses same water, ground cover" },
      { name: "Ginger", reason: "Root companion, shares nutrients well" },
    ],
    badWith: [
      { name: "Other Bananas", reason: "Plant different varieties to avoid Panama disease spread" },
    ],
    notes: "Banana circles — plant in a ring with compost in the centre. Very effective in Sarawak.",
  },
  {
    plant: "Papaya", emoji: "🍈",
    goodWith: [
      { name: "Marigold", reason: "Repels nematodes in tropical soil" },
      { name: "Basil", reason: "Repels whitefly that vector papaya ringspot virus" },
      { name: "Lemongrass", reason: "Deters pests, aromatic barrier" },
    ],
    badWith: [
      { name: "Banana", reason: "Both susceptible to Fusarium wilt — don't plant together" },
      { name: "Other Papaya", reason: "Plant only male + female, not too close" },
    ],
    notes: "Plant at least one male per 10 females for pollination. Marigold ring essential.",
  },
  {
    plant: "Lettuce", emoji: "🥗",
    goodWith: [
      { name: "Carrot", reason: "Different root depth — no competition" },
      { name: "Radish", reason: "Radish matures fast, creates space for lettuce" },
      { name: "Chive", reason: "Repels aphids from lettuce" },
      { name: "Mint", reason: "Repels slugs and aphids" },
      { name: "Tall plants", reason: "Shade lettuce from harsh Malaysian sun" },
    ],
    badWith: [
      { name: "Fennel", reason: "Inhibits lettuce germination and growth" },
      { name: "Parsley", reason: "Compete for nutrients in hot weather" },
    ],
    notes: "Grow lettuce in shade of taller plants to avoid bolting in Malaysia heat.",
  },
  {
    plant: "Pumpkin / Labu", emoji: "🎃",
    goodWith: [
      { name: "Corn", reason: "3 Sisters: corn provides trellis, pumpkin shades weeds" },
      { name: "Beans", reason: "Beans fix nitrogen, pumpkin uses it" },
      { name: "Marigold", reason: "Repels cucumber beetles and squash bugs" },
      { name: "Nasturtium", reason: "Trap crop — draws aphids away from pumpkin" },
    ],
    badWith: [
      { name: "Potato", reason: "Share blight disease, stunt each other" },
    ],
    notes: "The 3 Sisters (corn + beans + pumpkin) is one of the most effective companion systems.",
  },
  {
    plant: "Sweet Potato / Keledek", emoji: "🍠",
    goodWith: [
      { name: "Dill", reason: "Repels aphids attacking sweet potato vines" },
      { name: "Thyme", reason: "Repels pests and improves soil drainage" },
      { name: "Banana", reason: "Ground cover, shares tropical soil well" },
    ],
    badWith: [
      { name: "Squash", reason: "Both sprawl and compete for ground space" },
    ],
    notes: "Let vines sprawl as living mulch. Very low maintenance in Sarawak climate.",
  },
  {
    plant: "Durian", emoji: "🌵",
    goodWith: [
      { name: "Cocoa", reason: "Shade-tolerant, good understorey crop" },
      { name: "Rambutan", reason: "Different fruiting seasons, share space efficiently" },
      { name: "Coffee", reason: "Thrives in durian shade, shared water" },
      { name: "Pineapple", reason: "Ground cover beneath durian canopy" },
    ],
    badWith: [
      { name: "Mango", reason: "Same fruiting season — compete for pollinators" },
    ],
    notes: "Durian orchards in Sarawak traditionally interplanted with cocoa or rambutan.",
  },
  {
    plant: "Longbean / Kacang Panjang", emoji: "🫘",
    goodWith: [
      { name: "Corn", reason: "Beans fix nitrogen, corn uses it — classic pairing" },
      { name: "Carrot", reason: "Different root depth — complementary" },
      { name: "Cucumber", reason: "Beans provide nitrogen for cucumber" },
    ],
    badWith: [
      { name: "Garlic", reason: "Inhibits legume nitrogen fixation" },
      { name: "Onion", reason: "Same — alliums stunt bean growth" },
      { name: "Fennel", reason: "Toxic to most legumes" },
    ],
    notes: "Never plant with onion family. Great trellis plant — grow vertically.",
  },
];

export default function CompanionPlanting() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Companion | null>(DATA[0]);

  const filtered = DATA.filter(d =>
    d.plant.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center gap-3 h-16">
          <Link href="/tools"><button type="button" aria-label="Back" className="text-muted-foreground hover:text-white"><ChevronLeft className="w-5 h-5" /></button></Link>
          <Leaf className="w-6 h-6 text-emerald-400" />
          <div>
            <h1 className="text-xl font-bold">Companion Planting</h1>
            <p className="text-xs text-muted-foreground">Which plants grow better together</p>
          </div>
        </div>
      </div>

      <div className="container py-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plant list */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search plant..."
                className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            {filtered.map(d => (
              <button type="button" key={d.plant} onClick={() => setSelected(d)}
                className={`w-full text-left glass rounded-xl p-3 border transition-all flex items-center gap-3 ${
                  selected?.plant === d.plant ? "border-emerald-500/60 bg-emerald-500/5" : "border-border/50 hover:border-emerald-500/30"
                }`}>
                <span className="text-2xl">{d.emoji}</span>
                <span className="font-semibold">{d.plant}</span>
              </button>
            ))}
          </div>

          {/* Detail */}
          {selected && (
            <div className="lg:col-span-2 space-y-4">
              <div className="glass rounded-xl p-5 border border-emerald-500/30">
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-1">
                  <span>{selected.emoji}</span>{selected.plant}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">{selected.notes}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2 mb-3">
                      <CheckCircle className="w-4 h-4" />Good Companions
                    </h3>
                    <div className="space-y-2">
                      {selected.goodWith.map(g => (
                        <div key={g.name} className="glass rounded-lg p-3 border border-emerald-500/20">
                          <p className="font-semibold text-sm text-emerald-300">{g.name}</p>
                          <p className="text-xs text-muted-foreground">{g.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-red-400 flex items-center gap-2 mb-3">
                      <XCircle className="w-4 h-4" />Bad Companions
                    </h3>
                    <div className="space-y-2">
                      {selected.badWith.map(b => (
                        <div key={b.name} className="glass rounded-lg p-3 border border-red-500/20">
                          <p className="font-semibold text-sm text-red-300">{b.name}</p>
                          <p className="text-xs text-muted-foreground">{b.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
