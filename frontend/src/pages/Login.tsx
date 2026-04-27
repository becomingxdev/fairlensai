import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  Building2,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

// ─── Sub-components ────────────────────────────────────────────────

const StatBox = ({ label, sub }: { label: string; sub: string }) => (
  <div className="bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm p-4 rounded-2xl">
    <h4 className="text-white font-bold text-xl">{label}</h4>
    <p className="text-[9px] text-slate-500 font-bold tracking-widest">{sub}</p>
  </div>
);

const InputGroup = ({
  icon,
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex flex-col">
    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
        {icon}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
        placeholder={placeholder}
      />
    </div>
  </div>
);

// ─── Animated Gauge ────────────────────────────────────────────────

const BiasGauge = () => (
  <div className="flex flex-col items-center">
    <div className="relative w-72 h-40 overflow-hidden">
      {/* Arc */}
      <svg viewBox="0 0 100 50" className="w-full">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#ef4444" />
            <stop offset="50%"  stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      {/* Animated Needle */}
      <motion.div
        className="absolute bottom-0 left-1/2 w-[3px] h-32 origin-bottom rounded-full"
        style={{
          x: "-50%",
          background:
            "linear-gradient(to top, rgba(255,255,255,0.2), rgba(255,255,255,0.95))",
        }}
        animate={{ rotate: [-60, 45, -20, 70, 10] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        {/* Glowing tip */}
        <div className="w-3 h-3 bg-white rounded-full absolute top-0 -left-[5px] shadow-[0_0_15px_rgba(255,255,255,0.9)]" />
      </motion.div>

      {/* Center pivot */}
      <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-5 h-5 bg-[#0a0f1e] border-[3px] border-white rounded-full z-20" />
    </div>

    <div className="flex justify-between w-72 px-8 mt-4 text-[10px] uppercase font-bold tracking-widest">
      <span className="text-red-500">Biased</span>
      <span className="text-emerald-500">Fair</span>
    </div>
  </div>
);

// ─── Main Auth Page ────────────────────────────────────────────────

const Login = () => {
  const navigate = useNavigate();
  const { login, register, loginWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Form state
  const [name, setName]       = useState("");
  const [org, setOrg]         = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) {
      alert("Please fill all required fields.");
      return;
    }
    if (!isLogin && !name) {
      alert("Please enter your full name.");
      return;
    }

    setIsAuthenticating(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name, org);
      }
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Auth error:", error);
      alert(error.message || "An error occurred during authentication.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Google Auth error:", error);
      alert(error.message || "An error occurred during Google authentication.");
    } finally {
      setIsAuthenticating(false);
    }
  };


  return (
    <div className="flex h-screen w-full bg-white dark:bg-[#0f172a] font-sans overflow-hidden transition-colors duration-300">

      {/* ── LEFT: Dark Branding Panel ───────────────────────────── */}
      <div className="hidden lg:flex w-1/2 bg-[#0a0f1e] relative p-12 flex-col justify-between overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2 border border-slate-700 rounded-lg bg-slate-800/50">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl tracking-tight">FairLens AI</h1>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-semibold">
              Bias Audit Platform
            </p>
          </div>
        </div>

        {/* Center: Gauge + Mission */}
        <div className="relative z-10 flex flex-col items-center">
          <BiasGauge />

          <div className="mt-12 text-left w-full max-w-md">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">
              Our Mission
            </p>
            <h2 className="text-4xl font-bold text-white leading-tight mb-6">
              Make AI fair, transparent, and accountable.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Detect disparate impact, audit automated decisions against the EEOC
              4/5ths rule, and generate defensible fairness reports — in minutes,
              not quarters.
            </p>
          </div>
        </div>

        {/* Bottom: Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          <StatBox label="4/5"   sub="EEOC RULE" />
          <StatBox label="0–100" sub="FAIRNESS SCORE" />
          <StatBox label="SOC-2" sub="AUDIT TRAIL" />
        </div>
      </div>

      {/* ── RIGHT: Auth Form ────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-white dark:bg-[#0f172a] overflow-y-auto transition-colors duration-300">
        <div className="w-full max-w-md">

          {/* Animated heading swap */}
          <AnimatePresence mode="wait">
            <motion.header
              key={isLogin ? "login-header" : "register-header"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {isLogin ? "Sign in to your workspace" : "Create your workspace"}
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                {isLogin
                  ? "Continue auditing automated decisions."
                  : "Start your first fairness audit in under two minutes."}
              </p>
            </motion.header>
          </AnimatePresence>

          {/* Google SSO (UI only) */}
          <button
            id="google-sso-btn"
            onClick={handleGoogleLogin}
            disabled={isAuthenticating}
            className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22l.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative flex items-center py-4 mb-2">
            <div className="flex-grow border-t border-slate-100 dark:border-slate-800" />
            <span className="mx-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              or
            </span>
            <div className="flex-grow border-t border-slate-100 dark:border-slate-800" />
          </div>

          {/* Form — animates fields in/out */}
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  key="name-org-row"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 gap-4 overflow-hidden"
                >
                  <InputGroup
                    icon={<User size={18} />}
                    label="Full name"
                    placeholder="Ada Lovelace"
                    value={name}
                    onChange={setName}
                  />
                  <InputGroup
                    icon={<Building2 size={18} />}
                    label="Organization"
                    placeholder="Acme Corp"
                    value={org}
                    onChange={setOrg}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <InputGroup
              icon={<Mail size={18} />}
              label="Work email"
              placeholder="you@company.com"
              type="email"
              value={email}
              onChange={setEmail}
            />

            {/* Password with Forgot link */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                {isLogin && (
                  <button
                    type="button"
                    className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  size={18}
                />
                <input
                  id="password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isAuthenticating}
              className="w-full mt-8 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-2xl font-bold shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 group transition-all"
            >
              {isAuthenticating ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <footer className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            {isLogin ? (
              <p>
                New to FairLens?{" "}
                <button
                  id="switch-to-register"
                  onClick={() => setIsLogin(false)}
                  className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  id="switch-to-login"
                  onClick={() => setIsLogin(true)}
                  className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
            <p className="mt-6 text-[11px] text-slate-400 dark:text-slate-500">
              © 2026 FairLens AI · All audits are deterministic and reproducible.
            </p>
          </footer>

        </div>
      </div>
    </div>
  );
};

export default Login;