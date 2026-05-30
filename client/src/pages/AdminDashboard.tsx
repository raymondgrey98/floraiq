import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BarChart3, Users, Zap, Leaf, Search, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

/**
 * FloraIQ Admin Dashboard
 * Dark purple accent for admin theme
 */
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("stats");

  const tabs = [
    { id: "stats", label: "Stats" },
    { id: "users", label: "Users" },
    { id: "trails", label: "Emergency Trails" },
  ];

  const stats = [
    { label: "Total Users", value: "12,543", icon: Users, color: "from-blue-500 to-cyan-600" },
    { label: "Total Scans", value: "2.5M", icon: Zap, color: "from-yellow-500 to-orange-600" },
    { label: "Subscribers", value: "3,421", icon: Leaf, color: "from-green-500 to-emerald-600" },
    { label: "Species DB", value: "450K+", icon: BarChart3, color: "from-purple-500 to-pink-600" },
  ];

  const users = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "User", joined: "2024-01-15" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Pro", joined: "2024-02-20" },
    { id: 3, name: "Carol White", email: "carol@example.com", role: "User", joined: "2024-03-10" },
  ];

  const overduePaths = [
    { name: "John Doe", trail: "Mount Everest", dueDate: "2024-05-10", status: "Overdue" },
    { name: "Sarah Lee", trail: "Grand Canyon", dueDate: "2024-05-12", status: "Overdue" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
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
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container py-12">
        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="glass rounded-lg p-6 border border-border/50 card-hover">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} p-3 mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Charts Placeholder */}
            <div className="glass rounded-lg p-8 border border-border/50">
              <h3 className="font-semibold mb-6">Activity Overview</h3>
              <div className="h-64 bg-background/50 rounded-lg flex items-center justify-center text-muted-foreground">
                <BarChart3 className="w-12 h-12 opacity-20" />
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Search */}
            <div className="glass rounded-lg p-4 border border-border/50">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="glass rounded-lg border border-border/50 overflow-hidden">
              <table className="w-full">
                <thead className="bg-background/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Joined</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-border/50 hover:bg-background/50 transition">
                      <td className="px-6 py-4 text-sm">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === "Pro"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{user.joined}</td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-red-400 hover:text-red-300 transition">Ban</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Emergency Trails Tab */}
        {activeTab === "trails" && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="glass rounded-lg border border-red-500/20 bg-red-500/5 p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                Overdue Hikers
              </h3>
              <div className="space-y-4">
                {overduePaths.map((path, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-red-500/20">
                    <div>
                      <p className="font-semibold">{path.name}</p>
                      <p className="text-sm text-muted-foreground">{path.trail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-red-400 font-semibold">{path.dueDate}</p>
                      <Button size="sm" variant="outline" className="mt-2 border-red-500/30 text-red-400 hover:bg-red-500/10">
                        View on Maps
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
