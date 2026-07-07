/**
 * FloraIQ Spotlight — a premium ⌘K command palette / universal launcher.
 *
 * Opens from anywhere with ⌘K / Ctrl+K, or by dispatching a
 * `window` event: `window.dispatchEvent(new Event("floraiq:command"))`
 * (the home search bar does exactly that).
 *
 * Uses cmdk's headless <Command> primitive inside our own overlay (not
 * Command.Dialog) — full styling control, no Radix Dialog dependency.
 * Fully keyboard driven (↑ ↓ to move, ↵ to open, Esc to close).
 */
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Command } from "cmdk";
import { ScanLine, Globe2, Sprout, Notebook, User, Zap, CornerDownLeft, Search } from "lucide-react";
import { TOOLS, CATS, type Tool } from "@/lib/tools";

interface QuickAction { id: string; title: string; href: string; Icon: typeof ScanLine; keywords: string[]; }

const QUICK: QuickAction[] = [
  { id: "q-scan",    title: "Identify / Scan",  href: "/scan",    Icon: ScanLine, keywords: ["camera", "photo", "identify", "snap"] },
  { id: "q-map",     title: "Species Map",      href: "/map",     Icon: Globe2,   keywords: ["map", "sightings", "gbif", "world"] },
  { id: "q-garden",  title: "My Garden",        href: "/garden",  Icon: Sprout,   keywords: ["plants", "collection", "care", "water"] },
  { id: "q-journal", title: "My Discoveries",   href: "/journal", Icon: Notebook, keywords: ["history", "scans", "journal"] },
  { id: "q-profile", title: "My Profile",       href: "/profile", Icon: User,     keywords: ["account", "settings", "badges"] },
  { id: "q-tools",   title: "Browse All Tools", href: "/tools",   Icon: Zap,      keywords: ["everything", "hub"] },
];

// Tools grouped by category, "All" excluded (it's a filter, not a destination).
const GROUPS = CATS.filter(c => c !== "All").map(cat => ({
  cat,
  items: TOOLS.filter(t => t.cat === cat && t.live),
}));

export default function CommandPalette() {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState("");
  const [, setLocation]   = useLocation();

  // Global hotkeys (⌘K / Ctrl+K, Esc) + the home-search-bar open event.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(o => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("floraiq:command", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("floraiq:command", onOpen);
    };
  }, []);

  // Fresh query on open + lock background scroll while open.
  useEffect(() => {
    if (open) { setQuery(""); document.body.style.overflow = "hidden"; }
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const go = (href: string) => { setOpen(false); setLocation(href); };

  const renderTool = (t: Tool) => (
    <Command.Item
      key={t.id + t.href}
      value={`${t.title} ${t.desc}`}
      keywords={[t.cat, t.id]}
      onSelect={() => go(t.href)}>
      <span className="cp-emoji">{t.emoji}</span>
      <span className="cp-text">
        <span className="cp-title">{t.title}</span>
        <span className="cp-desc">{t.desc}</span>
      </span>
      <span className="cp-tag">{t.cat}</span>
    </Command.Item>
  );

  if (!open) return null;

  return (
    <>
      <style>{`
        .cp-overlay {
          position: fixed; inset: 0; z-index: 120;
          background: rgba(3,8,5,0.66); backdrop-filter: blur(8px);
          animation: cpFade .16s ease;
        }
        .cp-dialog {
          position: fixed; left: 50%; top: 11vh; transform: translateX(-50%);
          width: min(640px, calc(100vw - 28px)); z-index: 121;
          animation: cpPop .18s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes cpFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes cpPop  { from { opacity: 0; transform: translateX(-50%) translateY(-8px) scale(.98) }
                            to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1) } }
        .cp-root {
          background: rgba(9,17,13,0.98); color: #fff;
          border: 1px solid rgba(16,185,129,0.28); border-radius: 20px;
          box-shadow: 0 30px 90px rgba(0,0,0,0.6), 0 0 60px rgba(16,185,129,0.08);
          overflow: hidden; backdrop-filter: blur(28px);
        }
        .cp-inputwrap { display:flex; align-items:center; gap:10px; padding:16px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.07); }
        [cmdk-input] {
          flex:1; background: transparent; border: none; outline: none;
          color: #fff; font-size: 16px; font-weight: 500;
        }
        [cmdk-input]::placeholder { color: rgba(255,255,255,0.32); }
        [cmdk-list] {
          max-height: min(56vh, 460px); overflow-y: auto; overscroll-behavior: contain;
          padding: 8px; scrollbar-width: thin; scrollbar-color: rgba(16,185,129,0.25) transparent;
        }
        [cmdk-list]::-webkit-scrollbar { width: 6px; }
        [cmdk-list]::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.25); border-radius: 99px; }
        [cmdk-group-heading] {
          font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(52,211,153,0.55); padding: 12px 10px 6px;
        }
        [cmdk-item] {
          display: flex; align-items: center; gap: 12px;
          padding: 9px 11px; border-radius: 12px; cursor: pointer;
          color: rgba(255,255,255,0.85); content-visibility: auto;
        }
        [cmdk-item][data-selected="true"] {
          background: linear-gradient(135deg, rgba(16,185,129,0.20), rgba(16,185,129,0.10));
          box-shadow: inset 0 0 0 1px rgba(16,185,129,0.35);
        }
        [cmdk-item] .cp-emoji {
          width: 32px; height: 32px; flex-shrink: 0; border-radius: 10px; font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.05);
        }
        [cmdk-item][data-selected="true"] .cp-emoji { background: rgba(16,185,129,0.18); }
        .cp-qicon { color: #34d399; }
        .cp-text { display:flex; flex-direction:column; min-width:0; flex:1; }
        .cp-title { font-size: 13.5px; font-weight: 600; line-height: 1.2; }
        .cp-desc { font-size: 11.5px; color: rgba(255,255,255,0.4); line-height: 1.3;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .cp-tag {
          flex-shrink: 0; font-size: 9px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase;
          color: rgba(255,255,255,0.32); background: rgba(255,255,255,0.05);
          padding: 3px 7px; border-radius: 99px;
        }
        [cmdk-empty] { padding: 36px 16px; text-align: center; color: rgba(255,255,255,0.4); font-size: 13px; }
        .cp-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding: 9px 16px; border-top: 1px solid rgba(255,255,255,0.06);
          font-size: 10.5px; color: rgba(255,255,255,0.35);
        }
        .cp-kbd { display:inline-flex; align-items:center; gap:4px; }
        .cp-key { font-family: monospace; font-size: 10px; padding: 1px 5px; border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.5); }
      `}</style>

      <div className="cp-overlay" onClick={() => setOpen(false)} />
      <div className="cp-dialog" role="dialog" aria-label="FloraIQ Spotlight">
        <Command className="cp-root" label="FloraIQ Spotlight" loop shouldFilter>
          <div className="cp-inputwrap">
            <Search size={18} color="rgba(52,211,153,0.7)" />
            <Command.Input
              autoFocus
              value={query}
              onValueChange={setQuery}
              placeholder="Search FloraIQ — tools, plants, animals, actions…"
            />
          </div>

          <Command.List>
            <Command.Empty>No matches. Try “mushroom”, “water”, or “map”.</Command.Empty>

            <Command.Group heading="Quick actions">
              {QUICK.map(q => (
                <Command.Item
                  key={q.id}
                  value={q.title}
                  keywords={q.keywords}
                  onSelect={() => go(q.href)}>
                  <span className="cp-emoji"><q.Icon size={16} className="cp-qicon" /></span>
                  <span className="cp-text">
                    <span className="cp-title">{q.title}</span>
                  </span>
                  <span className="cp-tag">Go</span>
                </Command.Item>
              ))}
            </Command.Group>

            {GROUPS.map(g => (
              <Command.Group key={g.cat} heading={g.cat}>
                {g.items.map(renderTool)}
              </Command.Group>
            ))}
          </Command.List>

          <div className="cp-footer">
            <span className="cp-kbd"><span className="cp-key">↑</span><span className="cp-key">↓</span> navigate</span>
            <span className="cp-kbd"><CornerDownLeft size={11} /> open · <span className="cp-key">esc</span> close</span>
          </div>
        </Command>
      </div>
    </>
  );
}
