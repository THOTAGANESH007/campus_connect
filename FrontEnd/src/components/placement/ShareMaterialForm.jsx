import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText,
  Link2,
  BookOpen,
  Video,
  Upload,
  ArrowLeft,
  Tag,
  Building,
  AlertCircle,
  Send,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { createMaterial } from "../../services/placementMaterialService";

const CATEGORIES = [
  "Aptitude",
  "DSA & Coding",
  "Core CS (OS/DBMS/CN)",
  "System Design",
  "HR Preparation",
  "Resume Tips",
  "Company Specific",
  "Mock Tests",
  "Other",
];
const TYPES = ["Link", "PDF", "Notes", "Video"];

const TYPE_INFO = {
  Link: {
    icon: <Link2 size={20} />,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    desc: "Share a URL to a resource (YouTube, GitHub, article...)",
  },
  PDF: {
    icon: <FileText size={20} />,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    desc: "Upload a PDF document (max 10MB)",
  },
  Notes: {
    icon: <BookOpen size={20} />,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    desc: "Upload handwritten or digital notes",
  },
  Video: {
    icon: <Video size={20} />,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    desc: "Share a video link (YouTube, Loom, etc.)",
  },
};

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm";
const labelClass = "block text-slate-300 text-sm font-semibold mb-2";

const ShareMaterialForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "DSA & Coding",
    materialType: "Link",
    resourceUrl: "",
    company: "",
    tags: "",
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const tagsArray = formData.tags.split(",").map(t => t.trim()).filter(t => t !== "");
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === "tags") {
          payload.append(key, tagsArray.join(","));
        } else if (formData[key] !== null) {
          payload.append(key, formData[key]);
        }
      });

      await createMaterial(payload);
      navigate("/placement-materials");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to share material.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 overflow-x-hidden">

      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">

        {/* Navigation */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/placement-materials")}
          className="group flex items-center gap-3 text-slate-400 hover:text-white transition-all font-black text-xs uppercase tracking-widest mb-12"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
            <ArrowLeft size={16} />
          </div>
          Abort Transfer
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest">
            <Upload size={14} />
            Protocol Share
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Broadcast Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Knowledge Assets.
            </span>
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl leading-relaxed">
            Contribute high-quality placement resources to the network. Your assets empower the next generation of engineers.
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

        <motion.form
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-[3.5rem] p-8 md:p-14 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">

            {/* Resource Type Identification */}
            <div className="md:col-span-2 space-y-8">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-4">
                <div className="w-8 h-[2px] bg-slate-800" />
                Resource Classification
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {TYPES.map((t) => {
                  const info = TYPE_INFO[t];
                  const isSelected = formData.materialType === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({ ...formData, materialType: t })}
                      className={`group relative p-6 rounded-3xl border transition-all flex flex-col items-center text-center gap-4 ${isSelected ? "bg-indigo-600 border-indigo-500 shadow-2xl shadow-indigo-600/30" : "bg-white/5 border-white/5 hover:border-white/20"}`}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isSelected ? "bg-white text-indigo-600" : "bg-slate-800 text-slate-400"}`}>
                        {t === "Link" ? <Link2 size={28} /> : t === "PDF" ? <FileText size={28} /> : t === "Notes" ? <BookOpen size={28} /> : <Video size={28} />}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? "text-white" : "text-slate-500"}`}>{t}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Metadata Group */}
            <div className="space-y-10 md:col-span-2">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-4">
                <div className="w-8 h-[2px] bg-slate-800" />
                Descriptive Metadata
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Archive Headline</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. FullStack System Design Masterguide"
                    className="w-full px-8 py-5 bg-white/5 border border-white/5 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-black uppercase tracking-tight"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Target Organization (Optional)</label>
                  <div className="relative group">
                    <Building className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-purple-400 transition-colors" size={18} />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Amazon, NVIDIA, Microsoft..."
                      className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/5 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Executive Summary</label>
                  <textarea
                    name="description"
                    required
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Outline the core value proposition of this asset..."
                    className="w-full px-8 py-6 bg-white/5 border border-white/5 rounded-[2rem] text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* File/Link Logic Group */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-4">
                  <div className="w-8 h-[2px] bg-slate-800" />
                  Source Integration
                </h3>

                {["PDF", "Notes"].includes(formData.materialType) ? (
                  <div
                    onClick={() => document.getElementById("file-input").click()}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFileChange({ target: { files: e.dataTransfer.files } }); }}
                    className={`group relative p-10 rounded-[2.5rem] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-4 ${dragActive ? "bg-indigo-600/10 border-indigo-500" : "bg-white/5 border-white/5 hover:bg-white/[0.08] hover:border-white/20"}`}
                  >
                    <input id="file-input" type="file" className="hidden" onChange={handleFileChange} />
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {formData.file ? <FileText size={32} /> : <Upload size={32} />}
                    </div>
                    <div>
                      <p className="text-white font-black text-sm uppercase tracking-tight">{formData.file ? formData.file.name : "Inject File Assets"}</p>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Maximum transfer size: 25MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Resource Endpoint (URL)</label>
                    <div className="relative group">
                      <Link2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-400 transition-colors" size={18} />
                      <input
                        type="url"
                        name="resourceUrl"
                        required
                        value={formData.resourceUrl}
                        onChange={handleChange}
                        placeholder="https://cloud-storage.net/path-to-link"
                        className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/5 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-8">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-4">
                  <div className="w-8 h-[2px] bg-slate-800" />
                  Categorical Scope
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Knowledge Cluster</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-black text-xs uppercase tracking-widest cursor-pointer"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Indexing Tags (CSV)</label>
                    <div className="relative group">
                      <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-pink-400 transition-colors" size={18} />
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="dsa, algorithms, tcs, prep..."
                        className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/5 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-medium"
                      />
                    </div>
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
                      Sync to Network
                    </>
                  )}
                </div>
              </button>
              <p className="mt-6 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] overflow-hidden">Resources are verified by the collective oversight protocol</p>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default ShareMaterialForm;
