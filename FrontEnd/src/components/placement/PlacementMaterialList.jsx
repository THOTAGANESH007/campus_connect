import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Download,
  ThumbsUp,
  FileText,
  Link2,
  Video,
  BookOpen,
  Sparkles,
  Filter,
  TrendingUp,
  ExternalLink,
  Shield,
  Tag,
  User,
} from "lucide-react";
import {
  getMaterials,
  toggleUpvoteMaterial,
  incrementDownload,
} from "../../services/placementMaterialService";

const CATEGORY_COLORS = {
  Aptitude: {
    bg: "bg-blue-500/15",
    text: "text-blue-400",
    border: "border-blue-500/30",
    icon: "🧮",
  },
  "DSA & Coding": {
    bg: "bg-purple-500/15",
    text: "text-purple-400",
    border: "border-purple-500/30",
    icon: "💻",
  },
  "Core CS (OS/DBMS/CN)": {
    bg: "bg-indigo-500/15",
    text: "text-indigo-400",
    border: "border-indigo-500/30",
    icon: "🖥️",
  },
  "System Design": {
    bg: "bg-teal-500/15",
    text: "text-teal-400",
    border: "border-teal-500/30",
    icon: "🏗️",
  },
  "HR Preparation": {
    bg: "bg-pink-500/15",
    text: "text-pink-400",
    border: "border-pink-500/30",
    icon: "🤝",
  },
  "Resume Tips": {
    bg: "bg-orange-500/15",
    text: "text-orange-400",
    border: "border-orange-500/30",
    icon: "📄",
  },
  "Company Specific": {
    bg: "bg-yellow-500/15",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
    icon: "🏢",
  },
  "Mock Tests": {
    bg: "bg-red-500/15",
    text: "text-red-400",
    border: "border-red-500/30",
    icon: "📝",
  },
  Other: {
    bg: "bg-slate-500/15",
    text: "text-slate-400",
    border: "border-slate-500/30",
    icon: "📌",
  },
};

const TYPE_ICONS = {
  Link: <Link2 size={14} />,
  PDF: <FileText size={14} />,
  Notes: <BookOpen size={14} />,
  Video: <Video size={14} />,
};

const CATEGORIES = Object.keys(CATEGORY_COLORS);
const TYPES = ["Link", "PDF", "Notes", "Video"];

const PlacementMaterialList = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [materialType, setMaterialType] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const data = await getMaterials({
        search,
        category,
        materialType,
        page,
        limit: 9,
      });
      setMaterials(data.materials);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setError(null);
    } catch {
      setError("Failed to load materials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchMaterials, 400);
    return () => clearTimeout(t);
  }, [search, category, materialType, page]);

  const handleUpvote = async (id) => {
    await toggleUpvoteMaterial(id);
    fetchMaterials();
  };

  const handleDownload = async (material) => {
    await incrementDownload(material._id);
    window.open(material.resourceUrl, "_blank");
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 280, damping: 22 },
    },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-purple-950/20 to-slate-950 font-sans">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-purple-600/12 rounded-full blur-[120px]" />
        <div className="absolute bottom-[5%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <FileText size={20} className="text-white" />
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">
                Study Materials
              </h1>
              <Sparkles size={22} className="text-yellow-400 fill-yellow-400" />
            </div>
            <p className="text-slate-400 font-medium">
              Community-curated placement resources •{" "}
              <span className="text-purple-400 font-bold">
                {total} materials
              </span>
            </p>
          </div>
          <Link
            to="/placement-materials/share"
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all hover:-translate-y-0.5"
          >
            <Plus size={18} strokeWidth={3} />
            Share Material
          </Link>
        </motion.div>

        {/* Category Quick Filters */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 flex-wrap mb-6"
        >
          <button
            onClick={() => {
              setCategory("");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${!category ? "bg-purple-500/20 text-purple-300 border-purple-500/40" : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20"}`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => {
            const c = CATEGORY_COLORS[cat];
            return (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat === category ? "" : cat);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${category === cat ? `${c.bg} ${c.text} ${c.border}` : "bg-white/5 text-slate-400 border-white/10 hover:border-white/20"}`}
              >
                {CATEGORY_COLORS[cat].icon} {cat}
              </button>
            );
          })}
        </motion.div>

        {/* Search + Type Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-3 mb-8 flex flex-col md:flex-row gap-3"
        >
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search materials, topics, companies..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm font-medium"
            />
          </div>
          <select
            value={materialType}
            onChange={(e) => {
              setMaterialType(e.target.value);
              setPage(1);
            }}
            className="bg-white/10 border border-white/10 text-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="">All Types</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Cards Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-52 bg-white/5 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">{error}</div>
        ) : materials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-5">
              <FileText size={32} className="text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No materials yet
            </h3>
            <p className="text-slate-500 max-w-sm">
              Be the first to share a placement resource with the community!
            </p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {materials.map((m) => {
              const cat =
                CATEGORY_COLORS[m.category] || CATEGORY_COLORS["Other"];
              return (
                <motion.div
                  key={m._id}
                  variants={cardVariants}
                  whileHover={{ y: -6 }}
                >
                  <div className="group h-full bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col">
                    {/* Top */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cat.bg} ${cat.text} ${cat.border}`}
                        >
                          {cat.icon} {m.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        {TYPE_ICONS[m.materialType]}
                        <span className="text-xs">{m.materialType}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-white font-bold text-base leading-snug mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors flex-1">
                      {m.title}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed mb-3 line-clamp-2">
                      {m.description}
                    </p>

                    {/* Company badge */}
                    {m.company && (
                      <span className="inline-flex items-center gap-1 text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-full mb-3 w-fit">
                        🏢 {m.company}
                      </span>
                    )}

                    {/* Tags */}
                    {m.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {m.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs bg-white/5 text-slate-400 border border-white/10 px-2 py-0.5 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Stats + Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/8 mt-auto">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleUpvote(m._id)}
                          className="flex items-center gap-1.5 text-slate-400 hover:text-purple-400 transition-colors text-xs font-medium"
                        >
                          <ThumbsUp size={13} />
                          {m.upvotes?.length || 0}
                        </button>
                        <span className="flex items-center gap-1 text-slate-500 text-xs">
                          <Download size={13} />
                          {m.downloads || 0}
                        </span>
                        {m.isVerified && (
                          <span
                            title="Verified Resource"
                            className="text-emerald-400"
                          >
                            <Shield size={13} />
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDownload(m)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-purple-500/15 text-purple-400 border border-purple-500/30 rounded-xl text-xs font-bold hover:bg-purple-500/25 transition-all"
                      >
                        {m.materialType === "Link" ? (
                          <ExternalLink size={13} />
                        ) : (
                          <Download size={13} />
                        )}
                        {m.materialType === "Link" ? "Open" : "Download"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-5 py-2.5 bg-white/10 border border-white/10 text-slate-300 rounded-full font-bold text-sm hover:bg-white/15 disabled:opacity-40 transition-all"
            >
              Prev
            </button>
            <span className="px-5 py-2.5 bg-white/5 border border-white/5 text-white rounded-full font-bold text-sm">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-5 py-2.5 bg-white/10 border border-white/10 text-slate-300 rounded-full font-bold text-sm hover:bg-white/15 disabled:opacity-40 transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacementMaterialList;
