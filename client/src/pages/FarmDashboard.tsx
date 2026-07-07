import { useState, type ReactElement } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChartBar, CalendarBlank, Users, Plus, MagnifyingGlass, Funnel,
  List, SquaresFour, ArrowLeft, Flag, CalendarCheck, Clock, CheckCircle, Warning
} from "@phosphor-icons/react";

type Priority = "High" | "Medium" | "Low";
type Status   = "planned" | "inprogress" | "completed" | "overdue";

interface Task {
  id: string; title: string; date: string; days: number;
  location: string; priority: Priority; status: Status; assignees: string[];
}

const INITIAL_TASKS: Task[] = [
  { id:"1",  title:"Scout for early blight symptoms",          date:"Apr 16",days:9,  location:"Field — potato block A",           priority:"High",   status:"planned",    assignees:["👩","👨"] },
  { id:"2",  title:"Weekly scouting for fungal spread",        date:"May 16",days:30, location:"Apple orchard — west field",        priority:"Medium", status:"inprogress", assignees:["👩","👨","👩"] },
  { id:"3",  title:"Check drainage, fix standing water",       date:"Apr 27",days:12, location:"Pumpkin field south",               priority:"High",   status:"inprogress", assignees:["👨"] },
  { id:"4",  title:"Monitor disease hotspots",                 date:"Jul 15",days:90, location:"Strawberry tunnels 4-6",            priority:"Low",    status:"inprogress", assignees:["👩","👨","👩"] },
  { id:"5",  title:"Record baseline crop health",              date:"Apr 05",days:21, location:"Corn pivot 1 — quadrant NE",        priority:"Low",    status:"completed",  assignees:["👨","👩"] },
  { id:"6",  title:"Calibrate moisture sensors",               date:"Mar 18",days:45, location:"Irrigation control room",           priority:"Medium", status:"completed",  assignees:["👩","👨","👩"] },
  { id:"7",  title:"Clean and sanitize harvest crates",        date:"Apr 14",days:9,  location:"Packing area — wash station 1",     priority:"High",   status:"completed",  assignees:["👩","👨","👩"] },
  { id:"8",  title:"Preventive sprayer maintenance",           date:"Apr 10",days:0,  location:"Service yard — maintenance lane 2", priority:"High",   status:"overdue",    assignees:["👩","👨","👩","👩","👨"] },
  { id:"9",  title:"Apply post-harvest soil amendments",       date:"Jun 01",days:14, location:"Field B — rows 12-24",              priority:"Medium", status:"planned",    assignees:["👨"] },
  { id:"10", title:"Install new drip irrigation lines",        date:"Jun 10",days:20, location:"Greenhouse 3 — east section",       priority:"High",   status:"planned",    assignees:["👩","👨"] },
];

const COLS: { key: Status; label: string; color: string; dot: string }[] = [
  { key:"planned",    label:"Planned",     color:"bg-pink-500/15 border-pink-500/30 text-pink-400",    dot:"bg-pink-500" },
  { key:"inprogress", label:"In Progress", color:"bg-amber-500/15 border-amber-500/30 text-amber-400", dot:"bg-amber-400" },
  { key:"completed",  label:"Completed",   color:"bg-emerald-500/15 border-emerald-500/30 text-emerald-400", dot:"bg-emerald-500" },
  { key:"overdue",    label:"Overdue",     color:"bg-red-500/15 border-red-500/30 text-red-400",       dot:"bg-red-500" },
];

const PRIORITY_COLORS: Record<Priority, string> = {
  High:   "bg-red-500/15 text-red-400 border-red-500/25",
  Medium: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  Low:    "bg-blue-500/15 text-blue-400 border-blue-500/25",
};

const STATUS_ICON: Record<Status, ReactElement> = {
  planned:    <CalendarBlank size={12} />,
  inprogress: <Clock size={12} />,
  completed:  <CheckCircle size={12} className="text-emerald-400" />,
  overdue:    <Warning size={12} className="text-red-400" />,
};

function TaskCard({ task, onMove }: { task: Task; onMove: (id: string, s: Status) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div layout initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
      className="rounded-2xl p-4 border border-white/8 cursor-pointer hover:border-white/16 transition-all"
      style={{ background:"rgba(255,255,255,0.04)" }}
      onClick={() => setOpen(o => !o)}>
      <p className="text-sm font-semibold leading-snug mb-2">{task.title}</p>
      <div className="flex items-center gap-2 text-[11px] text-white/40 mb-2">
        <CalendarBlank size={11} />{task.date}
        <span>·</span>
        <Clock size={11} />{task.days > 0 ? `${task.days} days` : "Due today"}
      </div>
      <p className="text-[11px] text-white/35 mb-3 truncate">{task.location}</p>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${PRIORITY_COLORS[task.priority]}`}>
          <Flag size={9} weight="fill" />{task.priority}
        </span>
        <div className="flex -space-x-1.5">
          {task.assignees.slice(0,3).map((a,i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-xs">{a}</div>
          ))}
          {task.assignees.length > 3 && <div className="w-6 h-6 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[9px] text-white/50">+{task.assignees.length-3}</div>}
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }}
            className="mt-3 pt-3 border-t border-white/8 space-y-1.5 overflow-hidden">
            <p className="text-[11px] text-white/40">Move to:</p>
            <div className="flex gap-1.5 flex-wrap">
              {COLS.filter(c => c.key !== task.status).map(c => (
                <button key={c.key} type="button" onClick={e => { e.stopPropagation(); onMove(task.id, c.key); setOpen(false); }}
                  className="text-[10px] font-bold px-2 py-1 rounded-lg glass border border-white/10 hover:bg-white/8 transition">
                  {c.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FarmDashboard() {
  const [tasks, setTasks]       = useState<Task[]>(INITIAL_TASKS);
  const [view, setView]         = useState<"kanban"|"list">("kanban");
  const [tab, setTab]           = useState<"tasks"|"workers"|"calendar">("tasks");
  const [search, setSearch]     = useState("");
  const [showNew, setShowNew]   = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPrio, setNewPrio]   = useState<Priority>("Medium");
  const [newDate, setNewDate]   = useState("");
  const [newLoc, setNewLoc]     = useState("");

  function moveTask(id: string, status: Status) {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, status } : t));
  }

  function addTask() {
    if (!newTitle.trim()) return;
    const t: Task = { id:Date.now().toString(), title:newTitle, date:newDate || "TBD", days:7,
      location:newLoc || "Not specified", priority:newPrio, status:"planned", assignees:["👤"] };
    setTasks(ts => [t, ...ts]);
    setNewTitle(""); setNewDate(""); setNewLoc(""); setShowNew(false);
  }

  const filtered = tasks.filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.location.toLowerCase().includes(search.toLowerCase()));

  const stats = COLS.map(c => ({ ...c, count: tasks.filter(t => t.status === c.key).length }));

  return (
    <div className="min-h-screen text-white" style={{ background:"#0d0f0d" }}>
      {/* Satellite image header background */}
      <div className="relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=60" alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d0f0d]" />

        {/* Top nav */}
        <div className="relative px-6 py-4 flex items-center justify-between border-b border-white/8">
          <div className="flex items-center gap-3">
            <Link href="/farm">
              <button type="button" aria-label="Back to farm" className="w-8 h-8 rounded-xl bg-white/8 flex items-center justify-center hover:bg-white/12 transition">
                <ArrowLeft size={16} />
              </button>
            </Link>
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center">
              <span className="text-sm">🌾</span>
            </div>
            <div>
              <p className="font-black text-base leading-none">Farm Control</p>
              <p className="text-[10px] text-white/40">Task management · Field intelligence</p>
            </div>
          </div>
          <div className="flex gap-1">
            {[["tasks","Tasks"],["workers","Workers"],["calendar","Calendar"]].map(([k,l]) => (
              <button key={k} type="button" onClick={() => setTab(k as any)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${tab === k ? "bg-white/12 text-white" : "text-white/40 hover:text-white/60"}`}>{l}</button>
            ))}
          </div>
          <button type="button" onClick={() => setShowNew(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
            style={{ background:"linear-gradient(135deg,#16a34a,#15803d)" }}>
            <Plus size={16} weight="bold" />New task
          </button>
        </div>

        {/* Stats banner */}
        <div className="relative px-6 py-5">
          <p className="text-2xl font-black mb-1 uppercase tracking-wide">MANAGE · CREATE · ASSIGN</p>
          <p className="text-sm text-white/50 mb-4">Track all farm tasks in one place</p>
          <div className="flex gap-3">
            {stats.map(s => (
              <div key={s.key} className={`px-4 py-2 rounded-xl border text-sm font-bold flex items-center gap-2 ${s.color}`}>
                <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                {s.label} <span className="opacity-60">({s.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-3 flex items-center gap-3 border-b border-white/6">
        <div className="relative flex-1 max-w-xs">
          <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-white/10 text-sm bg-white/5 focus:outline-none focus:border-emerald-500/50 placeholder:text-white/30" />
        </div>
        <button type="button" className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-xs text-white/50 hover:bg-white/5 transition">
          <Funnel size={14} />Filter
        </button>
        <div className="ml-auto flex gap-1">
          <button type="button" onClick={() => setView("kanban")}
            className={`p-2 rounded-xl transition-all ${view==="kanban" ? "bg-white/12 text-white" : "text-white/35 hover:text-white/60"}`}>
            <SquaresFour size={16} />
          </button>
          <button type="button" onClick={() => setView("list")}
            className={`p-2 rounded-xl transition-all ${view==="list" ? "bg-white/12 text-white" : "text-white/35 hover:text-white/60"}`}>
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Kanban */}
      {tab === "tasks" && view === "kanban" && (
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto min-h-[60vh]">
          {COLS.map(col => {
            const colTasks = filtered.filter(t => t.status === col.key);
            return (
              <div key={col.key} className="space-y-3">
                <div className={`flex items-center justify-between px-3 py-2 rounded-xl border ${col.color}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                    <span className="text-xs font-bold">{col.label}</span>
                  </div>
                  <span className="text-xs opacity-60">{colTasks.length}</span>
                </div>
                <div className="space-y-2 min-h-[200px]">
                  {colTasks.map(task => <TaskCard key={task.id} task={task} onMove={moveTask} />)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List view */}
      {tab === "tasks" && view === "list" && (
        <div className="px-6 py-5 space-y-2">
          {filtered.map(task => (
            <div key={task.id} className="flex items-center gap-4 rounded-2xl p-4 border border-white/8 hover:bg-white/4 transition"
              style={{ background:"rgba(255,255,255,0.03)" }}>
              <div className="w-8 h-8 flex items-center justify-center">{STATUS_ICON[task.status]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{task.title}</p>
                <p className="text-xs text-white/35 truncate">{task.location}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border hidden sm:block ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>
              <span className="text-xs text-white/35 hidden md:block">{task.date}</span>
              <div className="flex -space-x-1">
                {task.assignees.slice(0,2).map((a,i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-white/10 border border-white/15 text-xs flex items-center justify-center">{a}</div>
                ))}
              </div>
              <select value={task.status} onChange={e => moveTask(task.id, e.target.value as Status)}
                className="text-[10px] bg-white/5 border border-white/10 rounded-lg px-2 py-1 focus:outline-none text-white/60">
                {COLS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Workers */}
      {tab === "workers" && (
        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name:"Alex Chen",    role:"Crop Scout",          shift:"On shift",  team:"Scouting team A",  tasks:3, completion:87 },
            { name:"Maria Santos", role:"Irrigation Tech",     shift:"Off shift", team:"Water management",  tasks:2, completion:92 },
            { name:"Raj Patel",    role:"Harvest Supervisor",  shift:"On shift",  team:"Harvest team B",    tasks:5, completion:76 },
            { name:"Fatima Omar",  role:"Quality Inspector",   shift:"On shift",  team:"Quality control",   tasks:4, completion:94 },
            { name:"Lucas Brown",  role:"Equipment Tech",      shift:"Off shift", team:"Maintenance crew",  tasks:1, completion:68 },
            { name:"Aisha Diallo", role:"Pest Scout",          shift:"On shift",  team:"IPM team",          tasks:3, completion:88 },
          ].map(w => (
            <div key={w.name} className="rounded-2xl p-5 border border-white/8 hover:border-emerald-500/20 transition"
              style={{ background:"rgba(255,255,255,0.04)" }}>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-xl flex-shrink-0">👤</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{w.name}</p>
                  <p className="text-xs text-white/40">{w.role}</p>
                  <p className="text-xs text-white/30">{w.team}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${w.shift === "On shift" ? "bg-emerald-500/15 text-emerald-400" : "bg-white/8 text-white/35"}`}>{w.shift}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-white/40">
                  <span>Tasks assigned</span><span className="text-white">{w.tasks}</span>
                </div>
                <div className="flex justify-between text-xs text-white/40">
                  <span>Completion rate</span><span className="text-emerald-400 font-bold">{w.completion}%</span>
                </div>
                <div className="h-1.5 bg-white/8 rounded-full">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width:`${w.completion}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Calendar placeholder */}
      {tab === "calendar" && (
        <div className="px-6 py-10 text-center text-white/30">
          <CalendarCheck size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-bold">Task Calendar</p>
          <p className="text-sm mt-1">Full calendar view coming soon</p>
        </div>
      )}

      {/* New task modal */}
      <AnimatePresence>
        {showNew && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <motion.div initial={{ scale:0.9, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.9, y:20 }}
              className="w-full max-w-md rounded-2xl p-6 border border-white/12"
              style={{ background:"#1a1e1a" }}>
              <div className="flex items-center justify-between mb-5">
                <p className="font-bold text-lg">New Task</p>
                <button type="button" onClick={() => setShowNew(false)} className="text-white/40 hover:text-white text-xl">×</button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Task title</label>
                  <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Check irrigation lines"
                    className="w-full px-3 py-2.5 rounded-xl border border-white/12 bg-white/5 text-sm focus:outline-none focus:border-emerald-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Due date</label>
                    <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-white/12 bg-white/5 text-sm focus:outline-none focus:border-emerald-500/50" />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Priority</label>
                    <select value={newPrio} onChange={e => setNewPrio(e.target.value as Priority)}
                      className="w-full px-3 py-2.5 rounded-xl border border-white/12 bg-white/5 text-sm focus:outline-none focus:border-emerald-500/50">
                      {(["High","Medium","Low"] as Priority[]).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Location / Field</label>
                  <input value={newLoc} onChange={e => setNewLoc(e.target.value)} placeholder="e.g. Field B — rows 10-20"
                    className="w-full px-3 py-2.5 rounded-xl border border-white/12 bg-white/5 text-sm focus:outline-none focus:border-emerald-500/50" />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button type="button" onClick={() => setShowNew(false)} className="flex-1 py-2.5 rounded-xl border border-white/12 text-sm font-bold text-white/50 hover:bg-white/5 transition">Cancel</button>
                <button type="button" onClick={addTask} className="flex-1 py-2.5 rounded-xl text-sm font-bold transition"
                  style={{ background:"linear-gradient(135deg,#16a34a,#15803d)" }}>Add Task</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
