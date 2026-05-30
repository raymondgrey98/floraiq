import { Button } from "@/components/ui/button";
import { useState } from "react";
import { User, Lock, CreditCard } from "lucide-react";
import { Link } from "wouter";

/**
 * FloraIQ Profile Page
 */
export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "password", label: "Password", icon: Lock },
    { id: "subscription", label: "Subscription", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <Link href="/">
            <Button variant="ghost">Back</Button>
          </Link>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass rounded-lg p-6 border border-border/50 sticky top-20">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-2xl font-bold text-white mb-4">
                JD
              </div>
              <h3 className="font-semibold mb-1">John Doe</h3>
              <p className="text-sm text-muted-foreground mb-6">john@example.com</p>

              {/* Tab Navigation */}
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="glass rounded-lg p-8 border border-border/50 animate-fade-in-up">
                <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue="John Doe"
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="john@example.com"
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                      defaultValue="Nature enthusiast and plant lover"
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none h-24"
                    />
                  </div>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <div className="glass rounded-lg p-8 border border-border/50 animate-fade-in-up">
                <h2 className="text-2xl font-bold mb-6">Change Password</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    Update Password
                  </Button>
                </div>
              </div>
            )}

            {/* Subscription Tab */}
            {activeTab === "subscription" && (
              <div className="space-y-6 animate-fade-in-up">
                {/* Current Plan */}
                <div className="glass rounded-lg p-8 border border-border/50">
                  <h2 className="text-2xl font-bold mb-6">Current Plan</h2>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Free Plan</h3>
                      <p className="text-muted-foreground">Limited scans and features</p>
                    </div>
                    <span className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full font-semibold">
                      Active
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground mb-6">
                    <p>✓ 10 scans per month</p>
                    <p>✓ Basic organism identification</p>
                    <p>✗ Landscape intelligence</p>
                    <p>✗ Priority support</p>
                  </div>
                </div>

                {/* Upgrade Card */}
                <div className="glass rounded-lg p-8 border border-emerald-500/30 bg-emerald-500/5">
                  <h3 className="text-xl font-semibold mb-4">Upgrade to Pro</h3>
                  <p className="text-muted-foreground mb-6">
                    Get unlimited scans, advanced features, and priority support
                  </p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-bold">$9.99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white hover-glow">
                    Upgrade Now
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
