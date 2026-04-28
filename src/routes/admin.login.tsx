import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ShieldCheck, Sparkles, ArrowRight, Lock, Mail } from "lucide-react";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"creds" | "mfa">("creds");
  const [email, setEmail] = useState("admin@asvf.com");
  const [password, setPassword] = useState("demo123");
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [challengeId, setChallengeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (step !== "mfa") return;
    setTimer(30);
    const id = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [step]);

  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const submitCreds = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      setChallengeId(res.challengeId);
      if (res.mfaRequired) {
        setStep("mfa");
        toast.info("Enter the 6-digit code (use 123456 in this demo)");
      } else {
        navigate({ to: "/admin" });
      }
    } catch (err) {
      triggerShake();
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const submitMfa = async (full: string) => {
    setLoading(true);
    try {
      await authApi.verifyMfa(challengeId, full);
      toast.success("Welcome back");
      navigate({ to: "/admin" });
    } catch (err) {
      triggerShake();
      setCode(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
      toast.error(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const onCodeChange = (i: number, v: string) => {
    const ch = v.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = ch;
    setCode(next);
    if (ch && i < 5) inputs.current[i + 1]?.focus();
    const full = next.join("");
    if (full.length === 6) submitMfa(full);
  };

  const onCodeKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  return (
    <div className="min-h-dvh grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="hidden lg:flex relative overflow-hidden" style={{ background: "var(--a-grad)" }}>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "radial-gradient(circle at 20% 30%, white 0%, transparent 40%), radial-gradient(circle at 80% 70%, white 0%, transparent 35%)",
        }} />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Sparkles className="size-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">ASVF Console</span>
          </div>

          <div className="space-y-6 max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold">
              <ShieldCheck className="size-3.5" />
              Secured with multi-factor auth
            </div>
            <h1 className="text-4xl font-bold tracking-tight leading-[1.05]">
              Build, edit, and ship your firm's story.
            </h1>
            <p className="text-white/85 text-base leading-relaxed">
              A premium content studio for managing pages, portfolio, team, and news — designed for clarity at any scale.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-4">
              {[
                { v: "12+", l: "Modules" },
                { v: "99.9%", l: "Uptime" },
                { v: "MFA", l: "Required" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4">
                  <div className="text-2xl font-bold">{s.v}</div>
                  <div className="text-[11px] uppercase tracking-widest text-white/70 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/60">© ASVF — All systems nominal.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="admin-scope flex items-center justify-center px-6 py-12 bg-[var(--a-bg)]">
        <div className={`w-full max-w-md ${shake ? "animate-[a-shake_0.4s]" : ""}`}>
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="size-9 rounded-xl flex items-center justify-center" style={{ background: "var(--a-grad)" }}>
              <Sparkles className="size-4.5 text-white" />
            </div>
            <span className="font-bold tracking-tight">ASVF Console</span>
          </div>

          {step === "creds" ? (
            <form onSubmit={submitCreds} className="a-fade-in space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
                <p className="text-sm text-[var(--a-text-muted)] mt-1.5">Sign in to your admin workspace</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="a-label">Email</label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--a-text-muted)]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="a-input pl-10"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="a-label">Password</label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--a-text-muted)]" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="a-input pl-10"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="a-btn a-btn-primary w-full disabled:opacity-60">
                {loading ? "Signing in…" : (<>Secure Login <ArrowRight className="size-4" /></>)}
              </button>

              <div className="text-center text-[11px] text-[var(--a-text-muted)] border-t border-[var(--a-border)] pt-4">
                Demo: <span className="font-mono">admin@asvf.com</span> / <span className="font-mono">demo123</span> / MFA <span className="font-mono">123456</span>
              </div>
            </form>
          ) : (
            <div className="a-fade-in space-y-6">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl flex items-center justify-center" style={{ background: "var(--a-grad-soft)", color: "var(--a-accent)" }}>
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Two-factor verification</h2>
                  <p className="text-sm text-[var(--a-text-muted)]">Enter the 6-digit code from your authenticator app</p>
                </div>
              </div>

              <div className="flex gap-2 justify-between">
                {code.map((c, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputs.current[i] = el; }}
                    inputMode="numeric"
                    maxLength={1}
                    value={c}
                    onChange={(e) => onCodeChange(i, e.target.value)}
                    onKeyDown={(e) => onCodeKey(i, e)}
                    className="a-input text-center text-xl font-bold size-12 p-0"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-[var(--a-text-muted)]">
                <span>{timer > 0 ? `Resend code in ${timer}s` : "Didn't get it?"}</span>
                <button
                  disabled={timer > 0}
                  onClick={() => { setTimer(30); toast.info("New code sent"); }}
                  className="font-semibold text-[var(--a-accent)] disabled:text-[var(--a-text-muted)] disabled:cursor-not-allowed"
                >
                  Resend
                </button>
              </div>

              <button
                type="button"
                onClick={() => { setStep("creds"); setCode(["", "", "", "", "", ""]); }}
                className="text-xs text-[var(--a-text-muted)] hover:text-[var(--a-accent)] transition-colors"
              >
                ← Use a different account
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes a-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
