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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState({
    company: "",
    jobRole: "",
    driveYear: new Date().getFullYear().toString(),
    roundType: "Technical",
    difficulty: "Medium",
    questionTitle: "",
    questionContent: "",
    answerHint: "",
    tags: [],
    isAnonymous: false,
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const addTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const t = tagInput.trim().replace(/,/g, "");
      if (t && !form.tags.includes(t) && form.tags.length < 6) {
        setForm((prev) => ({ ...prev, tags: [...prev.tags, t] }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.questionContent.trim()) {
      setError("Question content is required.");
      return;
    }
    setLoading(true);
    try {
      const created = await createQuestion(form);
      navigate(`/interview-questions/${created._id}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to post question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950/30 to-slate-950 font-sans">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-5%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-[-5%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <button
            onClick={() => navigate("/interview-questions")}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Questions
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <BookOpen size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">
                Share Interview Experience
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Help your juniors prepare better
              </p>
            </div>
            <Sparkles
              size={20}
              className="text-yellow-400 fill-yellow-400 ml-auto"
            />
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Company + Role Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Company Name *</label>
              <div className="relative">
                <Building
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="text"
                  placeholder="e.g. Google, Infosys"
                  value={form.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className={`${inputClass} pl-10`}
                  required
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Job Role *</label>
              <div className="relative">
                <Briefcase
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="text"
                  placeholder="e.g. SDE Intern"
                  value={form.jobRole}
                  onChange={(e) => handleChange("jobRole", e.target.value)}
                  className={`${inputClass} pl-10`}
                  required
                />
              </div>
            </div>
          </div>

          {/* Year + Round + Difficulty */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Drive Year *</label>
              <div className="relative">
                <Calendar
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <select
                  value={form.driveYear}
                  onChange={(e) => handleChange("driveYear", e.target.value)}
                  className={`${inputClass} pl-10 appearance-none`}
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y} className="bg-slate-900">
                      {y}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Round Type *</label>
              <div className="relative">
                <select
                  value={form.roundType}
                  onChange={(e) => handleChange("roundType", e.target.value)}
                  className={`${inputClass} appearance-none`}
                >
                  {ROUNDS.map((r) => (
                    <option key={r} value={r} className="bg-slate-900">
                      {r}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Difficulty *</label>
              <div className="relative">
                <select
                  value={form.difficulty}
                  onChange={(e) => handleChange("difficulty", e.target.value)}
                  className={`${inputClass} ${DIFF_COLOR[form.difficulty]} appearance-none font-bold`}
                >
                  {DIFFICULTIES.map((d) => (
                    <option
                      key={d}
                      value={d}
                      className="bg-slate-900 text-white"
                    >
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Question Title */}
          <div>
            <label className={labelClass}>Question Title *</label>
            <input
              type="text"
              placeholder="Write a short descriptive title..."
              value={form.questionTitle}
              onChange={(e) => handleChange("questionTitle", e.target.value)}
              className={inputClass}
              maxLength={200}
              required
            />
            <p className="text-slate-600 text-xs mt-1 text-right">
              {form.questionTitle.length}/200
            </p>
          </div>

          {/* Question Content */}
          <div>
            <label className={labelClass}>Question Details *</label>
            <textarea
              rows={6}
              placeholder="Describe the question in detail. Include any context, constraints, or sub-questions..."
              value={form.questionContent}
              onChange={(e) => handleChange("questionContent", e.target.value)}
              className={`${inputClass} resize-none leading-relaxed`}
              maxLength={5000}
              required
            />
            <p className="text-slate-600 text-xs mt-1 text-right">
              {form.questionContent.length}/5000
            </p>
          </div>

          {/* Answer Hint */}
          <div>
            <label className={labelClass}>
              Answer Hint / Approach{" "}
              <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={4}
              placeholder="Share the approach or key points for solving this question..."
              value={form.answerHint}
              onChange={(e) => handleChange("answerHint", e.target.value)}
              className={`${inputClass} resize-none`}
              maxLength={3000}
            />
          </div>

          {/* Tags */}
          <div>
            <label className={labelClass}>
              <Tag size={14} className="inline mr-1.5 -mt-0.5" />
              Tags{" "}
              <span className="text-slate-500 font-normal">
                (Press Enter or comma to add, max 6)
              </span>
            </label>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 focus-within:ring-2 focus-within:ring-indigo-500/50">
              <div className="flex flex-wrap gap-2 mb-2">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs px-3 py-1 rounded-full font-medium"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder={form.tags.length < 6 ? "Add tag..." : "Max 6 tags"}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                disabled={form.tags.length >= 6}
                className="w-full bg-transparent text-white placeholder-slate-600 text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Anonymous Toggle */}
          <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-4">
            <div className="flex items-center gap-3">
              {form.isAnonymous ? (
                <EyeOff size={18} className="text-slate-400" />
              ) : (
                <Eye size={18} className="text-indigo-400" />
              )}
              <div>
                <p className="text-white text-sm font-semibold">
                  Post Anonymously
                </p>
                <p className="text-slate-500 text-xs">
                  Your name won't be shown on this post
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleChange("isAnonymous", !form.isAnonymous)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${form.isAnonymous ? "bg-indigo-500" : "bg-white/10"}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.isAnonymous ? "translate-x-7" : "translate-x-1"}`}
              />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/interview-questions")}
              className="px-6 py-3 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-bold hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={16} />
                  Post Question
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default CreateInterviewQuestion;
