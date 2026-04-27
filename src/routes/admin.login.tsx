import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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
  const [code, setCode] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [loading, setLoading] = useState(false);

  const submitCreds = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      setChallengeId(res.challengeId);
      if (res.mfaRequired) {
        setStep("mfa");
        toast.info("Enter your authenticator code (use 123456 in this demo)");
      } else {
        navigate({ to: "/admin" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const submitMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.verifyMfa(challengeId, code);
      toast.success("Welcome back");
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md bg-card rounded-3xl p-8 md:p-10 shadow-[var(--shadow-soft)] border border-navy-ink/5">
        <div className="flex items-center gap-2 mb-8">
          <div className="size-8 rounded-lg bg-amber-brand" />
          <span className="font-heading font-bold text-lg">ASVF Admin</span>
        </div>

        {step === "creds" ? (
          <form onSubmit={submitCreds} className="space-y-5">
            <h1 className="text-2xl font-bold">Sign in</h1>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-navy-ink/60">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 w-full px-4 py-3 rounded-xl border border-navy-ink/10 bg-cream-warm/50 focus:outline-none focus:border-amber-brand"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-navy-ink/60">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 w-full px-4 py-3 rounded-xl border border-navy-ink/10 bg-cream-warm/50 focus:outline-none focus:border-amber-brand"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy-ink text-cream-warm py-3 rounded-full font-bold hover:bg-amber-brand hover:text-navy-ink transition-colors disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Continue →"}
            </button>
            <p className="text-xs text-navy-ink/50 text-center">Demo: admin@asvf.com / demo123 / MFA 123456</p>
          </form>
        ) : (
          <form onSubmit={submitMfa} className="space-y-5">
            <h1 className="text-2xl font-bold">Two-factor verification</h1>
            <p className="text-sm text-navy-ink/60">Enter the 6-digit code from your authenticator app.</p>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              required
              autoFocus
              className="w-full px-4 py-4 rounded-xl border border-navy-ink/10 bg-cream-warm/50 text-center text-2xl tracking-[0.5em] font-bold focus:outline-none focus:border-amber-brand"
            />
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-amber-brand text-navy-ink py-3 rounded-full font-bold hover:bg-amber-glow transition-colors disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify & sign in"}
            </button>
            <button type="button" onClick={() => setStep("creds")} className="text-xs text-navy-ink/50 hover:text-amber-brand">
              ← Use a different account
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
