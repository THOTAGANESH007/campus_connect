import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Building,
  Briefcase,
  Calendar,
  ChevronDown,
  Tag,
  AlertCircle,
  Send,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { createQuestion } from "../../services/interviewQuestionService";

const ROUNDS = [
  "Aptitude",
  "Technical",
  "Coding",
  "HR",
  "Group Discussion",
  "Case Study",
  "Other",
];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const YEARS = Array.from({ length: 6 }, (_, i) => `${2020 + i}`);

const DIFF_COLOR = {
  Easy: "text-emerald-400",
  Medium: "text-amber-400",
  Hard: "text-red-400",
};

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm";

const labelClass = "block text-slate-300 text-sm font-semibold mb-2";

const CreateInterviewQuestion = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: "",
    jobRole: "",
    driveYear: new Date().getFullYear(),
    roundType: "Technical",
    difficulty: "Medium",
    questionTitle: "",
    questionContent: "",
    answerHint: "",
    tags: "",
    isAnonymous: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");
      const created = await createQuestion({ ...formData, tags: tagsArray });
      navigate(`/interview-questions/${created._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 overflow-x-hidden">

      {/* Immersive Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">

        {/* Back Link */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/interview-questions")}
          className="group flex items-center gap-3 text-slate-400 hover:text-white transition-all font-black text-xs uppercase tracking-widest mb-12"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
            <ArrowLeft size={16} />
          </div>
          Discard & Back
        </motion.button>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 space-y-4 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest">
            <Sparkles size={14} />
            Contributor Network
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Share Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Success Story.
            </span>
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl leading-relaxed mx-auto md:mx-0">
            Your insights help thousands of students navigate their career journey. Let's document your experience with clarity and detail.
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center gap-4 text-red-500 font-bold"
          >
            <AlertCircle size={24} />
            {error}
          </motion.div>
        )}

        {/* Main Form Card */}
        <motion.form
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-14 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">

            {/* Company Details Group */}
            <div className="space-y-8 md:col-span-2">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-4">
                <div className="w-8 h-[2px] bg-slate-800" />
                Contextual Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Organization</label>
                  <div className="relative group">
                    <Building className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                    <input
                      type="text"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Google, Atlassian..."
                      className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Job Role</label>
                  <div className="relative group">
                    <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-purple-400 transition-colors" size={18} />
                    <input
                      type="text"
                      name="jobRole"
                      required
                      value={formData.jobRole}
                      onChange={handleChange}
                      placeholder="SDE Intern, Analyst..."
                      className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Year</label>
                  <div className="relative group">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input
                      type="number"
                      name="driveYear"
                      required
                      value={formData.driveYear}
                      onChange={handleChange}
                      className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Round Details Group */}
            <div className="space-y-8">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-4">
                <div className="w-8 h-[2px] bg-slate-800" />
                Assessment Scope
              </h3>
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Round Category</label>
                  <div className="flex flex-wrap gap-2">
                    {ROUNDS.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setFormData({ ...formData, roundType: r })}
                        className={`px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.roundType === r ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20" : "bg-white/5 text-slate-500 border-white/5 hover:border-white/20"}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Complexity Level</label>
                  <div className="flex gap-2">
                    {["Easy", "Medium", "Hard"].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setFormData({ ...formData, difficulty: d })}
                        className={`flex-1 py-3.5 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.difficulty === d ? (d === "Easy" ? "bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/20" : d === "Medium" ? "bg-amber-600 text-white border-amber-500 shadow-amber-600/20" : "bg-red-600 text-white border-red-500 shadow-red-600/20") : "bg-white/5 text-slate-500 border-white/5 hover:border-white/20"}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Group */}
            <div className="space-y-8">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-4">
                <div className="w-8 h-[2px] bg-slate-800" />
                Identification
              </h3>
              <div
                onClick={() => setFormData({ ...formData, isAnonymous: !formData.isAnonymous })}
                className="group cursor-pointer p-8 bg-white/5 border border-white/5 rounded-[2rem] hover:border-indigo-500/20 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${formData.isAnonymous ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-500"}`}>
                    {formData.isAnonymous ? <EyeOff size={28} /> : <Eye size={28} />}
                  </div>
                  <div>
                    <p className="text-white font-black text-sm uppercase tracking-tight">Post Anonymously</p>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none mt-1">Hide your profile from visitors</p>
                  </div>
                </div>
                <div className={`w-12 h-7 rounded-full transition-all relative ${formData.isAnonymous ? "bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]" : "bg-slate-800"}`}>
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${formData.isAnonymous ? "right-1" : "left-1"}`} />
                </div>
              </div>
            </div>

            {/* Content Area Group */}
            <div className="md:col-span-2 space-y-8 pt-10 border-t border-white/5">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-4">
                <div className="w-8 h-[2px] bg-slate-800" />
                Core Narrative
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Engaging Headline</label>
                  <input
                    type="text"
                    name="questionTitle"
                    required
                    value={formData.questionTitle}
                    onChange={handleChange}
                    placeholder="Summarize the core challenge..."
                    className="w-full px-8 py-6 bg-white/5 border border-white/5 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-black text-2xl tracking-tight"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Experience Deep-Dive</label>
                  <textarea
                    name="questionContent"
                    required
                    rows="6"
                    value={formData.questionContent}
                    onChange={handleChange}
                    placeholder="Describe the problem, your thought process, and the interviewer's focus..."
                    className="w-full px-8 py-7 bg-white/5 border border-white/5 rounded-[2.5rem] text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium resize-none leading-relaxed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Sparkles size={14} className="text-amber-500" />
                    Advanced Guidance (Optional)
                  </label>
                  <textarea
                    name="answerHint"
                    rows="3"
                    value={formData.answerHint}
                    onChange={handleChange}
                    placeholder="Share tips, complexity analysis, or key edge cases..."
                    className="w-full px-8 py-7 bg-white/5 border border-white/5 rounded-[2.5rem] text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-medium resize-none leading-relaxed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Classification Tags (CSV)</label>
                  <div className="relative group">
                    <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="react, system-design, algorithms..."
                      className="w-full pl-16 pr-8 py-6 bg-white/5 border border-white/5 rounded-2xl text-white placeholder-slate-700 focus:outline-none font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="md:col-span-2 pt-14 border-t border-white/5 text-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full max-w-lg mx-auto group relative py-6 bg-white text-slate-950 rounded-[2.5rem] font-bold text-xl uppercase tracking-[0.2em] transition-all shadow-2xl shadow-white/10 hover:shadow-white/20 hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50"
              >
                <div className="relative z-10 flex items-center justify-center gap-4">
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                      <Sparkles size={24} />
                    </motion.div>
                  ) : (
                    <>
                      <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      Broadcast Story
                    </>
                  )}
                </div>
              </button>
              <p className="mt-6 text-slate-500 text-xs font-black uppercase tracking-widest">By broadcasting, you agree to community sharing guidelines</p>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default CreateInterviewQuestion;
