import React, { useState } from "react";
import axios from "axios";
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Password strength
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@$!%*?&.^#()\-_=+]/.test(password),
  };
  const strength = Object.values(checks).filter(Boolean).length;
  const strengthLabel = ["", "Weak", "Weak", "Fair", "Good", "Strong"][
    strength
  ];
  const strengthColor = [
    "",
    "#ef4444",
    "#ef4444",
    "#f59e0b",
    "#22c55e",
    "#6366f1",
  ][strength];

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");

    if (!name || !email || !phone || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (strength < 5) {
      setError("Please create a stronger password meeting all requirements.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`, {
        name,
        email,
        phone,
        password,
        role: "STUDENT",
      });
      navigate("/signin", { state: { registered: true } });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm";

  const PasswordCheck = ({ ok, label }) => (
    <div
      className={`flex items-center gap-1.5 text-xs transition-colors ${ok ? "text-green-400" : "text-slate-600"}`}
    >
      <CheckCircle2
        size={12}
        className={ok ? "text-green-400" : "text-slate-700"}
      />
      {label}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* ── Left panel – branding ── */}
      <div className="hidden lg:flex lg:w-[42%] relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-950 via-slate-900 to-black" />
        <div className="absolute top-0 right-0 w-112.5 h-112.5 bg-indigo-600/20 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-87.5 h-87.5 bg-purple-600/15 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <GraduationCap size={22} className="text-white" />
          </div>
          <button onClick={() => navigate("/")}>
            <span className="text-white font-black text-xl tracking-tight">
              Campus Connect
            </span></button>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles size={18} className="text-indigo-400" />
              <span className="text-indigo-400 text-sm font-semibold uppercase tracking-widest">
                Join the community
              </span>
            </div>
            <h1 className="text-5xl font-black text-white leading-tight mb-4">
              Your career
              <br />
              <span className="bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                starts here.
              </span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              Create your student profile, track applications, and get notified
              about the best placement drives.
            </p>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-wrap gap-2 mt-10"
          >
            {[
              "📋 Drive Tracker",
              "🔔 Smart Alerts",
              "💬 Forum",
              "📊 Analytics",
              "🔖 Bookmarks",
            ].map((f) => (
              <span
                key={f}
                className="px-3 py-1.5 bg-white/5 border border-white/10 text-slate-400 text-xs font-semibold rounded-full"
              >
                {f}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Right panel – form ── */}
      <div className="w-full lg:w-[58%] flex items-center justify-center p-6 relative overflow-y-auto">
        <div className="absolute inset-0 bg-slate-950" />
        <div className="absolute w-96 h-96 bg-indigo-700/8 rounded-full blur-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-lg py-10"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="text-white font-black text-lg">
              Campus Connect
            </span>
          </div>

          <h2 className="text-3xl font-black text-white mb-1">
            Create account
          </h2>
          <p className="text-slate-500 mb-8 text-sm">
            Join thousands of students already placed
          </p>

          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name + Phone row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative group">
                <User
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors"
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className={inputClass}
                />
              </div>
              <div className="relative group">
                <Phone
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative group">
              <Mail
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className={inputClass}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className={`${inputClass} pr-12`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {/* Password strength */}
            {password.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="px-1"
              >
                {/* Bar */}
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex-1 h-1 rounded-full transition-all duration-300"
                      style={{
                        background:
                          i <= strength
                            ? strengthColor
                            : "rgba(255,255,255,0.05)",
                      }}
                    />
                  ))}
                  <span
                    className="text-xs font-semibold ml-2"
                    style={{ color: strengthColor }}
                  >
                    {strengthLabel}
                  </span>
                </div>
                {/* Checklist */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <PasswordCheck ok={checks.length} label="8+ characters" />
                  <PasswordCheck ok={checks.upper} label="Uppercase letter" />
                  <PasswordCheck ok={checks.lower} label="Lowercase letter" />
                  <PasswordCheck ok={checks.number} label="Number" />
                  <PasswordCheck
                    ok={checks.special}
                    label="Special character"
                  />
                </div>
              </motion.div>
            )}

            {/* Confirm password */}
            <div className="relative group">
              <Lock
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors"
              />
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className={`${inputClass} pr-12 ${confirmPassword && password !== confirmPassword
                    ? "ring-2 ring-red-500/50 border-red-500/30"
                    : confirmPassword && password === confirmPassword
                      ? "ring-2 ring-green-500/50 border-green-500/30"
                      : ""
                  }`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors"
              >
                {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all duration-200 shadow-lg shadow-indigo-900/40 hover:shadow-indigo-700/40 group mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <>
                  Create Account
                  <ArrowRight
                    size={17}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-slate-600 text-xs font-medium">
              Already have an account?
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <Link
            to="/signin"
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/40 text-slate-300 hover:text-white font-bold rounded-2xl transition-all duration-200"
          >
            Sign in instead
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
