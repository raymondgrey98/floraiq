import { useState } from "react";
import { Leaf, Mail, Lock } from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/context/WorkstationContext";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in all fields."); return; }
    if (!supabase) { toast.error("Auth not configured."); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Welcome back!");
    setLocation("/");
  }

  async function handleGoogleLogin() {
    if (!supabase) { toast.error("Auth not configured."); return; }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) toast.error(error.message);
  }

  async function handleForgotPassword() {
    if (!email) { toast.error("Enter your email address first."); return; }
    if (!supabase) { toast.error("Auth not configured."); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("Reset link sent — check your email.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#07100c" }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(16,185,129,0.08) 0%,transparent 60%)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative w-full max-w-sm">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#34d399,#059669)", boxShadow: "0 0 24px rgba(16,185,129,0.4)" }}>
            <Leaf size={28} color="white" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-center text-white mb-1">Welcome back</h1>
        <p className="text-center text-sm mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
          Sign in to your FloraIQ account
        </p>

        <form onSubmit={handleEmailLogin} className="space-y-4 mb-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-white/70 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(52,211,153,0.5)" }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(16,185,129,0.15)",
                }}
                onFocus={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.45)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.08)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.15)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-white/70">Password</label>
              <button type="button" onClick={handleForgotPassword}
                className="text-xs font-semibold transition-opacity hover:opacity-70"
                style={{ color: "#34d399" }}>
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(52,211,153,0.5)" }} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(16,185,129,0.15)" }}
                onFocus={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.45)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.08)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "rgba(16,185,129,0.15)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-black text-sm text-white disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#059669,#10b981)", boxShadow: "0 4px 24px rgba(16,185,129,0.35)" }}>
            {loading ? "Signing in…" : "Sign In"}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>or</span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold text-white/80 mb-6 transition-all hover:bg-white/8"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
          <svg width={18} height={18} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
          No account?{" "}
          <Link href="/signup">
            <span className="font-bold cursor-pointer" style={{ color: "#34d399" }}>Sign up free</span>
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
