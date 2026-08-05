/**
 * PermissionGate — first-run permission screen (Android/iOS only).
 *
 * Requesting permissions automatically on mount is unreliable in a WebView:
 * the call can fire before the Capacitor bridge is ready and fail silently,
 * which leaves Android showing "No permissions allowed".
 *
 * Triggering the request from a real button tap is reliable, and it also gives
 * the user context for WHY each permission is needed. Shown once; re-runnable
 * any time from Profile via `openPermissionGate()`.
 */
import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Camera as CameraIcon, MapPin, Bell, Mic, ShieldCheck, Check, X } from "lucide-react";
import { requestAllPermissions, type PermissionReport } from "@/lib/permissions";

const SEEN_KEY = "floraiq_permissions_asked";

/** Open the permission screen from anywhere (e.g. a Profile button). */
export function openPermissionGate() {
  window.dispatchEvent(new Event("floraiq:permissions"));
}

const ITEMS = [
  { Icon: CameraIcon, title: "Camera & Photos", why: "Take or pick a photo to identify plants and wildlife." },
  { Icon: MapPin,     title: "Location",        why: "Pin your finds on the map and show species near you." },
  { Icon: Bell,       title: "Notifications",   why: "Watering and plant-care reminders." },
  { Icon: Mic,        title: "Microphone",      why: "Identify birds and insects by their sound." },
];

export default function PermissionGate() {
  const [open, setOpen]       = useState(false);
  const [busy, setBusy]       = useState(false);
  const [report, setReport]   = useState<PermissionReport | null>(null);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    // First launch → show the gate (after first paint so the bridge is ready).
    if (!localStorage.getItem(SEEN_KEY)) {
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const onOpen = () => { setReport(null); setOpen(true); };
    window.addEventListener("floraiq:permissions", onOpen);
    return () => window.removeEventListener("floraiq:permissions", onOpen);
  }, []);

  if (!open) return null;

  const grant = async () => {
    setBusy(true);
    try {
      const r = await requestAllPermissions();
      setReport(r);
      localStorage.setItem(SEEN_KEY, "1");
    } finally {
      setBusy(false);
    }
  };

  const close = () => { localStorage.setItem(SEEN_KEY, "1"); setOpen(false); };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(3,8,5,0.86)", backdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}>
      <div
        style={{
          width: "min(400px, 100%)", maxHeight: "88vh", overflowY: "auto",
          background: "rgba(9,17,13,0.99)", borderRadius: 24,
          border: "1px solid rgba(16,185,129,0.28)",
          boxShadow: "0 30px 90px rgba(0,0,0,0.6)", padding: 24,
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: "linear-gradient(135deg,#34d399,#059669)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ShieldCheck size={20} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 900, color: "white", margin: 0, lineHeight: 1.2 }}>
              Enable FloraIQ
            </h2>
            <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", margin: 0 }}>
              Android needs your permission for these
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "18px 0" }}>
          {ITEMS.map(({ Icon, title, why }) => (
            <div key={title} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                background: "rgba(16,185,129,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={15} color="#34d399" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.9)", margin: 0 }}>{title}</p>
                <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.45 }}>{why}</p>
              </div>
            </div>
          ))}
        </div>

        {report && (
          <div style={{
            background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: 14, padding: 12, marginBottom: 14,
          }}>
            {Object.entries(report).map(([k, v]) => {
              const ok = v === "granted";
              return (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11.5, padding: "2px 0" }}>
                  {ok ? <Check size={12} color="#4ade80" /> : <X size={12} color="#f87171" />}
                  <span style={{ color: "rgba(255,255,255,0.75)", textTransform: "capitalize" }}>{k}</span>
                  <span style={{ marginLeft: "auto", color: ok ? "#4ade80" : "#f87171" }}>{v}</span>
                </div>
              );
            })}
            <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.4)", marginTop: 8, marginBottom: 0 }}>
              Anything not granted can be enabled in Settings → Apps → FloraIQ → Permissions.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={report ? close : grant}
          disabled={busy}
          style={{
            width: "100%", padding: "13px 16px", borderRadius: 14, border: "none",
            cursor: "pointer", fontSize: 14, fontWeight: 800, color: "white",
            background: "linear-gradient(135deg,#059669,#10b981)",
            opacity: busy ? 0.6 : 1,
            boxShadow: "0 4px 18px rgba(16,185,129,0.35)",
          }}>
          {busy ? "Requesting…" : report ? "Start using FloraIQ" : "Allow permissions"}
        </button>

        {!report && (
          <button
            type="button"
            onClick={close}
            style={{
              width: "100%", marginTop: 8, padding: 10, borderRadius: 12,
              background: "transparent", border: "none", cursor: "pointer",
              fontSize: 12, color: "rgba(255,255,255,0.35)",
            }}>
            Not now
          </button>
        )}
      </div>
    </div>
  );
}
