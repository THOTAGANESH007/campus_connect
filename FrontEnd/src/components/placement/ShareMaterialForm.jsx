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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "DSA & Coding",
    materialType: "Link",
    resourceUrl: "",
    company: "",
    tags: [],
    file: null,
    fileName: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const addTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const t = tagInput.trim().replace(/,/g, "");
      if (t && !form.tags.includes(t) && form.tags.length < 8) {
        setForm((prev) => ({ ...prev, tags: [...prev.tags, t] }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tag) =>
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));

  const handleFileChange = (file) => {
    if (!file) return;
    setForm((prev) => ({ ...prev, file, fileName: file.name }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required.");
      return;
    }
    if (form.materialType === "Link" && !form.resourceUrl.trim()) {
      setError("Resource URL is required for Link type.");
      return;
    }
    if (
      (form.materialType === "PDF" || form.materialType === "Notes") &&
      !form.file &&
      !form.resourceUrl
    ) {
      setError("Please upload a file or provide a URL.");
      return;
    }

    setLoading(true);
    try {
      let payload;

      if (form.file) {
        // Use FormData for file upload
        payload = new FormData();
        payload.append("title", form.title);
        payload.append("description", form.description);
        payload.append("category", form.category);
        payload.append("materialType", form.materialType);
        payload.append("company", form.company);
        payload.append("tags", form.tags.join(","));
        payload.append("file", form.file);
      } else {
        payload = {
          title: form.title,
          description: form.description,
          category: form.category,
          materialType: form.materialType,
          resourceUrl: form.resourceUrl,
          company: form.company,
          tags: form.tags,
        };
      }

      await createMaterial(payload);
      navigate("/placement-materials");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to share material.");
    } finally {
      setLoading(false);
    }
  };

  const typeInfo = TYPE_INFO[form.materialType];
  const isFileType = ["PDF", "Notes"].includes(form.materialType);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-purple-950/20 to-slate-950 font-sans">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-5%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <button
            onClick={() => navigate("/placement-materials")}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Materials
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-linear-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Upload size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">
                Share Study Material
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Help your peers ace their placements
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
          {/* Material Type Selector */}
          <div>
            <label className={labelClass}>Material Type *</label>
            <div className="grid grid-cols-4 gap-3">
              {TYPES.map((t) => {
                const info = TYPE_INFO[t];
                const selected = form.materialType === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleChange("materialType", t)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center transition-all ${selected ? `${info.bg} ${info.border} ${info.color}` : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"}`}
                  >
                    <span className={selected ? info.color : "text-slate-500"}>
                      {info.icon}
                    </span>
                    <span className="text-xs font-bold">{t}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-slate-500 text-xs mt-2 ml-1">{typeInfo.desc}</p>
          </div>

          {/* Title */}
          <div>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              placeholder="e.g. Complete DSA Sheet by Striver"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className={inputClass}
              maxLength={200}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description *</label>
            <textarea
              rows={4}
              placeholder="Describe what this material covers, who it's for, and why it's helpful..."
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={`${inputClass} resize-none`}
              maxLength={2000}
              required
            />
            <p className="text-slate-600 text-xs mt-1 text-right">
              {form.description.length}/2000
            </p>
          </div>

          {/* Category + Company */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Category *</label>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className={`${inputClass} appearance-none`}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-slate-900">
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>
                Company{" "}
                <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Building
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="text"
                  placeholder="e.g. Amazon, TCS"
                  value={form.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
          </div>

          {/* Resource URL or File Upload */}
          {isFileType ? (
            <div>
              <label className={labelClass}>
                Upload File{" "}
                <span className="text-slate-500 font-normal">
                  (or provide URL below)
                </span>
              </label>
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${dragOver ? "border-purple-500/70 bg-purple-500/10" : "border-white/15 bg-white/3 hover:border-white/25 hover:bg-white/5"}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFileChange(e.dataTransfer.files[0]);
                }}
                onClick={() => document.getElementById("file-upload").click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.png,.jpg"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                />
                {form.fileName ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText size={32} className="text-purple-400" />
                    <p className="text-white font-semibold text-sm">
                      {form.fileName}
                    </p>
                    <p className="text-slate-500 text-xs">
                      Click to change file
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={32} className="text-slate-500" />
                    <p className="text-slate-400 text-sm font-medium">
                      Drag & drop or click to upload
                    </p>
                    <p className="text-slate-600 text-xs">
                      PDF, DOC, PPT, TXT, PNG supported
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-3">
                <label className="text-slate-500 text-xs">Or paste URL:</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={form.resourceUrl}
                  onChange={(e) => handleChange("resourceUrl", e.target.value)}
                  className={`${inputClass} mt-1`}
                />
              </div>
            </div>
          ) : (
            <div>
              <label className={labelClass}>Resource URL *</label>
              <input
                type="url"
                placeholder="https://..."
                value={form.resourceUrl}
                onChange={(e) => handleChange("resourceUrl", e.target.value)}
                className={inputClass}
                required={!form.file}
              />
            </div>
          )}

          {/* Tags */}
          <div>
            <label className={labelClass}>
              <Tag size={14} className="inline mr-1.5 -mt-0.5" />
              Tags{" "}
              <span className="text-slate-500 font-normal">
                (Press Enter to add, max 8)
              </span>
            </label>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 focus-within:ring-2 focus-within:ring-purple-500/50">
              <div className="flex flex-wrap gap-2 mb-2">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 bg-purple-500/15 text-purple-300 border border-purple-500/25 text-xs px-3 py-1 rounded-full font-medium"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder={
                  form.tags.length < 8
                    ? "e.g. arrays, binary-search..."
                    : "Max 8 tags"
                }
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                disabled={form.tags.length >= 8}
                className="w-full bg-transparent text-white placeholder-slate-600 text-sm focus:outline-none"
              />
            </div>
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
              onClick={() => navigate("/placement-materials")}
              className="px-6 py-3 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-bold hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={16} />
                  Share Material
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default ShareMaterialForm;
