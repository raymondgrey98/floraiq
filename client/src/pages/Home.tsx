import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Leaf, Waves, AlertTriangle, Compass, Zap, Globe, BookOpen, BarChart3, Droplets, Bug, Skull } from "lucide-react";

/**
 * FloraIQ Home Page
 * Premium dark theme with emerald green accents
 * Hero section, feature cards with hover effects, and CTAs
 */
export default function Home() {
  const features = [
    {
      icon: Leaf,
      title: "Plant ID",
      description: "Identify flowers, leaves, trees, herbs",
      color: "from-green-500 to-emerald-600",
      href: "/scan",
    },
    {
      icon: AlertTriangle,
      title: "Survival Toolkit",
      description: "Emergency guides, SOS beacon, first aid",
      color: "from-amber-500 to-orange-600",
      href: "/survival",
    },
    {
      icon: Globe,
      title: "Landscape OSINT",
      description: "Environment analysis, terrain intel",
      color: "from-blue-500 to-cyan-600",
      href: "/landscape",
    },
    {
      icon: Compass,
      title: "Species Map",
      description: "Track organisms by location",
      color: "from-purple-500 to-pink-600",
      href: "/map",
    },
    {
      icon: Zap,
      title: "Farm Assistant",
      description: "Crop planning, hydroponics guide",
      color: "from-green-400 to-lime-500",
      href: "/farm",
    },
    {
      icon: BookOpen,
      title: "Species Library",
      description: "Comprehensive species database",
      color: "from-indigo-500 to-blue-600",
      href: "/history",
    },
    {
      icon: BarChart3,
      title: "Plant Journal",
      description: "Track your discoveries & scans",
      color: "from-rose-500 to-red-600",
      href: "/journal",
    },
    {
      icon: Waves,
      title: "Forage Map",
      description: "Find edible & medicinal plants near you",
      color: "from-teal-500 to-green-600",
      href: "/forage",
    },
    {
      icon: BarChart3,
      title: "Farm Finance",
      description: "Track income, expenses & profit in RM",
      color: "from-amber-500 to-yellow-600",
      href: "/finance",
    },
    {
      icon: Droplets,
      title: "Water Tracker",
      description: "Never forget to water your plants again",
      color: "from-blue-500 to-cyan-600",
      href: "/water",
    },
    {
      icon: Bug,
      title: "Disease Diagnosis",
      description: "AI detects plant diseases from a photo",
      color: "from-red-500 to-rose-600",
      href: "/disease",
    },
    {
      icon: Skull,
      title: "Toxic Plants",
      description: "Poisonous plants in Malaysia — symptoms & first aid",
      color: "from-red-700 to-red-900",
      href: "/toxic",
    },
  ];

  const stats = [
    { label: "Scans", value: "2.5M+" },
    { label: "Species", value: "450K+" },
    { label: "Countries", value: "195+" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">FloraIQ</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">Features</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition">Docs</a>
            <Link href="/login">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 pointer-events-none" />
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Nature Intelligence</span>
              <br />
              <span className="text-foreground">for Everyone</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Identify any plant, animal, or environment with AI. From casual nature lovers to survival experts, FloraIQ has you covered.
            </p>

            {/* Stats Bar */}
            <div className="flex justify-center gap-8 mb-12 flex-wrap">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-emerald-400">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/scan">
                <Button size="lg" className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white hover-glow">
                  <Leaf className="w-5 h-5 mr-2" />
                  Identify Now
                </Button>
              </Link>
              <Link href="/survival">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-amber-500 text-amber-400 hover:bg-amber-500/10">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Survival Mode
                </Button>
              </Link>
              <Link href="/landscape">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Globe className="w-5 h-5 mr-2" />
                  Landscape
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to explore, identify, and understand nature
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Link key={idx} href={feature.href}>
                  <div className="glass card-hover rounded-xl p-6 border border-border/50 group cursor-pointer hover:border-emerald-500/50 transition-all animate-fade-in-up">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-transparent to-green-600/20 pointer-events-none" />
        
        <div className="container relative z-10">
          <div className="glass rounded-2xl p-12 md:p-16 border border-emerald-500/30 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Explore?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of nature enthusiasts discovering the world around them
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white hover-glow">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 mt-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-5 h-5 text-emerald-400" />
                <span className="font-bold">FloraIQ</span>
              </div>
              <p className="text-sm text-muted-foreground">Nature intelligence for everyone</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">About</a></li>
                <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition">License</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© 2024 FloraIQ. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground transition">Twitter</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition">GitHub</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
