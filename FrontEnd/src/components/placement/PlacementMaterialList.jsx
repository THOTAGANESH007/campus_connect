import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
    } catch (err) {
      setError("Failed to load placement materials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchMaterials, 400);
    return () => clearTimeout(timeout);
  }, [search, category, materialType, page]);

  const handleUpvote = async (id) => {
    try {
      await toggleUpvoteMaterial(id);
      fetchMaterials();
    } catch (err) {
      console.error("Upvote failed", err);
    }
  };

  const handleDownload = async (material) => {
    try {
      await incrementDownload(material._id);
      window.open(material.resourceUrl, "_blank");
      fetchMaterials();
    } catch (err) {
      console.error("Link open failed", err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 20 }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 overflow-x-hidden">

      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">

        {/* Immersive Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-20"
        >
          <div className="space-y-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/5">
              <Sparkles size={14} strokeWidth={3} />
              Premium Career Resources
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none">
              Placement <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Launchpad.
              </span>
            </h1>
            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-2xl">
              Curated elite resources from Top-tier organizations to accelerate your engineering journey.
            </p>
          </div>

          <Link
            to="/placement-materials/share"
            className="group flex items-center gap-4 px-10 py-5 bg-white text-slate-950 rounded-[2rem] font-black text-xl transition-all shadow-2xl shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:-translate-y-1 active:scale-95"
          >
            <Plus size={24} strokeWidth={4} className="group-hover:rotate-90 transition-transform" />
            Share Resource
          </Link>
        </motion.div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: "Elite Assets", val: total, icon: <FileText size={24} />, color: "text-indigo-400", bg: "bg-indigo-400/10" },
            { label: "Community Access", val: "15k+", icon: <Download size={24} />, color: "text-emerald-400", bg: "bg-emerald-400/10" },
            { label: "Legacy Score", val: "4.9/5", icon: <TrendingUp size={24} />, color: "text-purple-400", bg: "bg-purple-400/10" },
            { label: "Resource Shield", val: "Verified", icon: <Shield size={24} />, color: "text-blue-400", bg: "bg-blue-400/10" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-3xl group hover:bg-white/[0.07] transition-all duration-500"
            >
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner`}>
                {stat.icon}
              </div>
              <p className="text-4xl font-black text-white mb-1 tracking-tight">{stat.val}</p>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Search & Filter Ecosystem */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="sticky top-6 z-40 p-3 mb-16 bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] flex flex-col md:flex-row gap-4 shadow-2xl"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Scan by company, technology, or topic..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-16 pr-8 py-5 bg-transparent text-white placeholder-slate-600 focus:outline-none font-bold text-lg"
            />
          </div>
          <div className="flex flex-wrap gap-2 p-1">
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="bg-white/5 text-white border-0 rounded-3xl px-8 py-4 text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-indigo-500/50 outline-none cursor-pointer transition-all hover:bg-white/10"
            >
              <option value="" className="bg-slate-900">All Categories</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-slate-900">{cat}</option>)}
            </select>
            <select
              value={materialType}
              onChange={(e) => { setMaterialType(e.target.value); setPage(1); }}
              className="bg-white/5 text-white border-0 rounded-3xl px-8 py-4 text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-purple-500/50 outline-none cursor-pointer transition-all hover:bg-white/10"
            >
              <option value="" className="bg-slate-900">All Types</option>
              {TYPES.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
            </select>
          </div>
        </motion.div>

        {/* Dynamic Resource Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-8 md:grid-cols-3"
            >
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 bg-white/5 rounded-[3rem] border border-white/5 animate-pulse" />
              ))}
            </motion.div>
          ) : materials.length > 0 ? (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {materials.map((m) => {
                const cat = CATEGORY_COLORS[m.category] || CATEGORY_COLORS["Other"];
                return (
                  <motion.div key={m._id} variants={itemVariants}>
                    <div className="group relative h-full bg-slate-900/50 border border-white/5 rounded-[3.5rem] p-10 hover:bg-white/[0.08] hover:border-indigo-500/30 hover:shadow-2xl transition-all duration-700 backdrop-blur-sm flex flex-col overflow-hidden">

                      {/* Card Top */}
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-[1.8rem] bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-black/20 group-hover:scale-110 transition-transform duration-500`}>
                            {m.materialType === "Video" ? <Video size={30} /> : m.materialType === "Link" ? <Link2 size={30} /> : <FileText size={30} />}
                          </div>
                          <div>
                            <div className={`px-3 py-1 rounded-full ${cat.bg} border ${cat.border} text-[10px] font-black uppercase tracking-widest ${cat.text} mb-2 w-fit`}>
                              {m.category}
                            </div>
                            <h3 className="text-white font-black text-xl leading-tight uppercase tracking-tight line-clamp-1">{m.company || "General"}</h3>
                          </div>
                        </div>
                      </div>

                      <h4 className="text-white font-bold text-lg mb-4 line-clamp-2 leading-snug flex-grow group-hover:text-indigo-300 transition-colors">
                        {m.title}
                      </h4>

                      <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-8 leading-relaxed">
                        {m.description}
                      </p>

                      {/* Stats bar */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                          <p className="text-white font-black text-lg">{m.upvotes?.length || 0}</p>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-sans">Endorsed</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                          <p className="text-white font-black text-lg">{m.downloadCount || 0}</p>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-sans">Accessed</p>
                        </div>
                      </div>

                      {/* Footer Action */}
                      <div className="flex items-center gap-4 mt-auto">
                        <button
                          onClick={() => handleDownload(m)}
                          className="flex-1 px-8 py-4 bg-white text-slate-950 rounded-[1.8rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-400 hover:text-white transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                          <ExternalLink size={18} strokeWidth={3} />
                          Unlock Asset
                        </button>
                        <button
                          onClick={() => handleUpvote(m._id)}
                          className="w-14 h-14 bg-white/5 border border-white/10 rounded-[1.8rem] flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-400/30 transition-all hover:bg-white/10"
                        >
                          <ThumbsUp size={22} strokeWidth={3} />
                        </button>
                      </div>

                      {/* Contributor */}
                      <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-black text-white">
                          {m.sharedBy?.name?.charAt(0) || "C"}
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] truncate">
                          Verified Contributor • {m.sharedBy?.name || "Anonymous"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-40 text-center"
            >
              <div className="w-32 h-32 bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center mb-10 animate-pulse">
                <FileText size={48} className="text-indigo-400" />
              </div>
              <h2 className="text-4xl font-black text-white mb-6 tracking-tight">The Library is evolving</h2>
              <p className="text-slate-400 max-w-lg mx-auto text-xl font-medium leading-relaxed">
                No materials detected matching your scan. Broaden your filters or contribute to the library.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-24 gap-6"
          >
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-4 px-10 py-4 bg-white/5 border border-white/10 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              Prev Wave
            </button>
            <div className="flex items-center px-10 bg-white text-slate-950 rounded-[1.5rem] font-black text-sm tracking-widest shadow-2xl">
              {page} / {totalPages}
            </div>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-4 px-10 py-4 bg-white/5 border border-white/10 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              Next Wave
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PlacementMaterialList;
