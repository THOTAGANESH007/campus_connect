import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { getQuestionById, updateQuestion } from "../../services/interviewQuestionService";
import { toast } from "react-hot-toast";

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

const EditInterviewQuestion = () => {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const data = await getQuestionById(id);
        setFormData({
          ...data,
          tags: data.tags ? data.tags.join(", ") : "",
        });
      } catch (err) {
        setError("Failed to fetch question details.");
        toast.error("Failed to load question");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");
      
      await updateQuestion(id, { ...formData, tags: tagsArray });
      toast.success("Question updated successfully!");
      navigate(`/interview-questions/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update question.");
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"
        />
        <p className="text-slate-500 font-black uppercase tracking-widest text-xs animate-pulse">
          Retrieving Experience...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-indigo-500/20 overflow-x-hidden pb-20">
      {/* Immersive Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Back Link */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-all font-black text-xs uppercase tracking-widest mb-12 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center group-hover:bg-slate-50 transition-all">
            <ArrowLeft size={16} />
          </div>
          Back
        </motion.button>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 space-y-4 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest">
            <Sparkles size={14} />
            Editor Mode
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Refine Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600">
              Contribution.
            </span>
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl leading-relaxed mx-auto md:mx-0">
            Keep your shared experiences up to date to provide the most accurate guidance for your peers.
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
          className="bg-white border border-slate-200 rounded-[3rem] p-8 md:p-14 shadow-sm relative overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {/* Company Details Group */}
            <div className="space-y-8 md:col-span-2">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-4">
                <div className="w-8 h-0.5 bg-slate-200" />
                Contextual Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Organization
                  </label>
                  <div className="relative group">
                    <Building
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                      size={18}
                    />
                    <input
                      type="text"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Google, Atlassian..."
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Job Role
                  </label>
                  <div className="relative group">
                    <Briefcase
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors"
                      size={18}
                    />
                    <input
                      type="text"
                      name="jobRole"
                      required
                      value={formData.jobRole}
                      onChange={handleChange}
                      placeholder="SDE Intern, Analyst..."
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Year
                  </label>
                  <div className="relative group">
                    <Calendar
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                      size={18}
                    />
                    <input
                      type="number"
                      name="driveYear"
                      required
                      value={formData.driveYear}
                      onChange={handleChange}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Round Details Group */}
            <div className="space-y-8">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-4">
                <div className="w-8 h-0.5 bg-slate-200" />
                Assessment Scope
              </h3>
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Round Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ROUNDS.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, roundType: r })
                        }
                        className={`px-4 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.roundType === r ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20" : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Complexity Level
                  </label>
                  <div className="flex gap-2">
                    {DIFFICULTIES.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, difficulty: d })
                        }
                        className={`flex-1 py-3.5 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.difficulty === d ? (d === "Easy" ? "bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/20" : d === "Medium" ? "bg-amber-600 text-white border-amber-500 shadow-amber-600/20" : "bg-red-600 text-white border-red-500 shadow-red-600/20") : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"}`}
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
                <div className="w-8 h-0.5 bg-slate-200" />
                Identification
              </h3>
              <div
                onClick={() =>
                  setFormData({
                    ...formData,
                    isAnonymous: !formData.isAnonymous,
                  })
                }
                className="group cursor-pointer p-8 bg-slate-50 border border-slate-200 rounded-4xl hover:border-indigo-500/30 transition-all flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${formData.isAnonymous ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 shadow-sm text-slate-400"}`}
                  >
                    {formData.isAnonymous ? (
                      <EyeOff size={28} />
                    ) : (
                      <Eye size={28} />
                    )}
                  </div>
                  <div>
                    <p className="text-slate-900 font-black text-sm uppercase tracking-tight">
                      Post Anonymously
                    </p>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none mt-1">
                      Hide your profile from visitors
                    </p>
                  </div>
                </div>
                <div
                  className={`w-12 h-7 rounded-full transition-all relative ${formData.isAnonymous ? "bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]" : "bg-slate-300"}`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${formData.isAnonymous ? "right-1" : "left-1"}`}
                  />
                </div>
              </div>
            </div>

            {/* Content Area Group */}
            <div className="md:col-span-2 space-y-8 pt-10 border-t border-slate-100">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-4">
                <div className="w-8 h-0.5 bg-slate-200" />
                Core Narrative
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Engaging Headline
                  </label>
                  <input
                    type="text"
                    name="questionTitle"
                    required
                    value={formData.questionTitle}
                    onChange={handleChange}
                    placeholder="Summarize the core challenge..."
                    className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-black text-2xl tracking-tight"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Experience Deep-Dive
                  </label>
                  <textarea
                    name="questionContent"
                    required
                    rows="6"
                    value={formData.questionContent}
                    onChange={handleChange}
                    placeholder="Describe the problem, your thought process, and the interviewer's focus..."
                    className="w-full px-8 py-7 bg-slate-50 border border-slate-200 rounded-[2.5rem] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium resize-none leading-relaxed"
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
                    className="w-full px-8 py-7 bg-slate-50 border border-slate-200 rounded-[2.5rem] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-medium resize-none leading-relaxed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                    Classification Tags (CSV)
                  </label>
                  <div className="relative group">
                    <Tag
                      className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="react, system-design, algorithms..."
                      className="w-full pl-16 pr-8 py-6 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="md:col-span-2 pt-14 border-t border-slate-100 text-center">
              <button
                type="submit"
                disabled={submitting}
                className="w-full max-w-lg mx-auto group relative py-6 bg-slate-900 text-white rounded-[2.5rem] font-bold text-xl uppercase tracking-[0.2em] transition-all shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-1 active:scale-[0.98] disabled:opacity-75"
              >
                <div className="relative z-10 flex items-center justify-center gap-4">
                  {submitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                    >
                      <Sparkles size={24} />
                    </motion.div>
                  ) : (
                    <>
                      <Send
                        size={24}
                        className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                      />
                      Save Changes
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default EditInterviewQuestion;
