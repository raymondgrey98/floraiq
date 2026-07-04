import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { createClient, type User, type Session } from "@supabase/supabase-js";
import type { PhotoMeta } from "@/lib/exif";

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) || "";
// Supports both new publishable key format (sb_publishable_...) and legacy anon key
const SUPABASE_ANON_KEY = (
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY        as string) ||
  ""
);

// True when real Supabase credentials were provided at build time
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Export so Login/Signup/Profile can call auth methods directly.
// createClient throws on empty strings, which would crash the whole app at
// module load when env vars are absent (e.g. CI-built APKs) — fall back to
// inert placeholder credentials so the UI still boots; auth calls are
// guarded by `supabaseConfigured`.
export const supabase = createClient(
  SUPABASE_URL || "https://placeholder.supabase.co",
  SUPABASE_ANON_KEY || "sb_publishable_placeholder",
);

// ── Shared type (matches server/ai-service.ts output) ────────────────────────
export interface PlantIdentificationResult {
  scientificName: string;
  commonNames: Record<string, string>;
  confidence: number;
  description: string;
  characteristics: string[];
  careInstructions: { watering: string; sunlight: string; soil: string; temperature: string };
  habitat: string;
  riskLevel: "safe" | "caution" | "dangerous";
  imageAnalysis: { leafShape: string; color: string; texture: string; estimatedHeight: string };
  disease?: string;
  fertilizer?: string;
  soilAdvice?: string;
  gbif?: { usageKey: number; kingdom: string; family: string; confidence: number; status: string };
  scanMode?: string;
  photoUrl?: string;
  date?: string;
  id?: number;
}

// ── Context shape ─────────────────────────────────────────────────────────────
interface WorkstationContextType {
  // Auth
  user:        User | null;
  session:     Session | null;
  authLoading: boolean;
  signOut:     () => Promise<void>;
  // Scan pipeline state
  activeScanBlob:   Blob | null;
  activeScanResult: PlantIdentificationResult | null;
  activeScanMode:   string;
  /** EXIF provenance of a gallery-uploaded photo (null for live captures) */
  activeScanPhotoMeta: PhotoMeta | null;
  setActiveScanBlob:   (blob: Blob | null)                       => void;
  setActiveScanResult: (result: PlantIdentificationResult | null) => void;
  setActiveScanMode:   (mode: string)                            => void;
  setActiveScanPhotoMeta: (meta: PhotoMeta | null)               => void;
  clearScan:           () => void;
}

const WorkstationContext = createContext<WorkstationContextType | undefined>(undefined);

export function WorkstationProvider({ children }: { children: React.ReactNode }) {
  const [user,        setUser]        = useState<User | null>(null);
  const [session,     setSession]     = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [activeScanBlob,   setActiveScanBlob]   = useState<Blob | null>(null);
  const [activeScanResult, setActiveScanResult] = useState<PlantIdentificationResult | null>(null);
  const [activeScanMode,   setActiveScanMode]   = useState<string>("plant");
  const [activeScanPhotoMeta, setActiveScanPhotoMeta] = useState<PhotoMeta | null>(null);

  // ── Supabase auth bootstrap ─────────────────────────────────────────────────
  useEffect(() => {
    // Supabase only works if URL + key are configured
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    if (SUPABASE_URL) await supabase.auth.signOut();
    setActiveScanBlob(null);
    setActiveScanResult(null);
  }, []);

  const clearScan = useCallback(() => {
    setActiveScanBlob(null);
    setActiveScanResult(null);
    setActiveScanPhotoMeta(null);
  }, []);

  return (
    <WorkstationContext.Provider value={{
      user, session, authLoading, signOut,
      activeScanBlob, activeScanResult, activeScanMode, activeScanPhotoMeta,
      setActiveScanBlob, setActiveScanResult, setActiveScanMode, setActiveScanPhotoMeta,
      clearScan,
    }}>
      {children}
    </WorkstationContext.Provider>
  );
}

export function useWorkstation() {
  const ctx = useContext(WorkstationContext);
  if (!ctx) throw new Error("useWorkstation must be used inside <WorkstationProvider>");
  return ctx;
}
