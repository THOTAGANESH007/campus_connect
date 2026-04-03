import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  ThumbsUp,
  MessageSquare,
  ChevronRight,
  Briefcase,
  Calendar,
  Tag,
  User,
  Eye,
  BookOpen,
  Sparkles,
  TrendingUp,
  Award,
  Clock,
} from "lucide-react";
import {
  getQuestions,
  toggleUpvoteQuestion,
  deleteQuestion,
} from "../../services/interviewQuestionService";

const DIFFICULTY_STYLES = {
  Easy: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  Hard: "bg-red-100 text-red-700 border-red-200",
};

const ROUND_COLORS = {
  Aptitude: "bg-blue-500",
  Technical: "bg-purple-500",
  Coding: "bg-indigo-500",
  HR: "bg-pink-500",
  "Group Discussion": "bg-teal-500",
  "Case Study": "bg-orange-500",
  Other: "bg-slate-500",
};

const InterviewQuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [roundType, setRoundType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await getQuestions({
        search,
        roundType,
        difficulty,
        page,
        limit: 9,
      });
      setQuestions(data.questions);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setError(null);
    } catch (err) {
      setError("Failed to load interview questions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchQuestions, 400);
    return () => clearTimeout(t);
  }, [search, roundType, difficulty, page]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 20 },
    },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-indigo-500/20 overflow-x-hidden pb-20">
      {/* Immersive Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-purple-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[30%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16"
        >
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} />
              Knowledge Sharing Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Interview <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600">
                Experiences.
              </span>
            </h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              Unlock real-world insights from over{" "}
              <span className="text-slate-900 font-bold">
                {total} community members
              </span>{" "}
              who’ve cracked their dream roles.
            </p>
          </div>

          <Link
            to="/interview-questions/create"
            className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-lg transition-all shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-1 active:scale-95"
          >
            <Plus
              size={20}
              strokeWidth={3}
              className="group-hover:rotate-90 transition-transform"
            />
            Share Experience
          </Link>
        </motion.div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            {
              label: "Total Questions",
              val: total,
              icon: <BookOpen />,
              color: "text-indigo-400",
              bg: "bg-indigo-500/10",
            },
            {
              label: "Active Contributors",
              val: "200+",
              icon: <User />,
              color: "text-purple-400",
              bg: "bg-purple-500/10",
            },
            {
              label: "Successful Rounds",
              val: "1.2k+",
              icon: <Award />,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
            {
              label: "Daily New",
              val: "12",
              icon: <TrendingUp />,
              color: "text-orange-400",
              bg: "bg-orange-500/10",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm group hover:shadow-md transition-all"
            >
              <div
                className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                {stat.icon}
              </div>
              <p className="text-3xl font-black text-slate-900 mb-1 tracking-tight">
                {stat.val}
              </p>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="sticky top-6 z-30 p-2 mb-12 bg-white backdrop-blur-2xl border border-slate-200 rounded-2xl md:rounded-full flex flex-col md:flex-row gap-4 shadow-sm"
        >
          <div className="flex-1 relative">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by company, role, or keywords..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-14 pr-6 py-4 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
            />
          </div>
          <div className="flex gap-2 p-1">
            <select
              value={roundType}
              onChange={(e) => {
                setRoundType(e.target.value);
                setPage(1);
              }}
              className="bg-slate-50 text-slate-700 border border-slate-200 rounded-full px-6 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none hover:bg-slate-100 transition-colors"
            >
              <option value="">
                All Rounds
              </option>
              {Object.keys(ROUND_COLORS).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <select
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value);
                setPage(1);
              }}
              className="bg-slate-50 text-slate-700 border border-slate-200 rounded-full px-6 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none hover:bg-slate-100 transition-colors"
            >
              <option value="">
                All Difficulties
              </option>
              {Object.keys(DIFFICULTY_STYLES).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 md:grid-cols-3"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-slate-100 rounded-4xl border border-slate-200 animate-pulse"
                />
              ))}
            </motion.div>
          ) : questions.length > 0 ? (
            <motion.div
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {questions.map((q) => (
                <motion.div key={q._id} variants={itemVariants}>
                  <Link
                    to={`/interview-questions/${q._id}`}
                    className="group block h-full"
                  >
                    <div className="relative h-full bg-white border border-slate-200 rounded-4xl p-8 hover:shadow-xl hover:border-indigo-500/30 transition-all duration-500 flex flex-col">
                      {/* Card Top Branding */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl ${ROUND_COLORS[q.roundType] || "bg-slate-500"} flex items-center justify-center text-white font-black text-xs shadow-sm`}
                          >
                            {q.company.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-slate-900 font-black text-lg leading-none group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                              {q.company}
                            </h3>
                            <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">
                              {q.jobRole}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${DIFFICULTY_STYLES[q.difficulty]}`}
                        >
                          {q.difficulty}
                        </div>
                      </div>

                      {/* Card Content */}
                      <h4 className="text-slate-800 font-bold text-lg mb-4 line-clamp-2 leading-tight grow">
                        {q.questionTitle}
                      </h4>

                      {/* Meta Info */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest overflow-hidden">
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Calendar size={14} className="text-indigo-400" />
                            {q.driveYear}
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <Tag size={14} className="text-purple-400" />
                            {q.roundType}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                              {q.isAnonymous
                                ? "?"
                                : q.postedBy?.name?.charAt(0) || "U"}
                            </div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              {q.isAnonymous
                                ? "ANONYMOUS"
                                : q.postedBy?.name || "USER"}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-slate-500">
                            <span className="flex items-center gap-1.5 text-[10px] font-black group-hover:text-indigo-600 transition-colors">
                              <ThumbsUp size={12} strokeWidth={3} />
                              {q.upvotes?.length || 0}
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] font-black group-hover:text-purple-600 transition-colors">
                              <MessageSquare size={12} strokeWidth={3} />
                              {q.comments?.length || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-8 border border-slate-200 animate-pulse">
                <Search size={40} className="text-indigo-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">
                No matching stories
              </h2>
              <p className="text-slate-500 max-w-md mx-auto text-lg leading-relaxed">
                We couldn't find any interview experiences matching your
                criteria. Try adjusting your filters or be the first to share!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-20 gap-4"
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-3 px-8 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Previous
            </button>
            <div className="flex items-center px-6 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-md">
              {page} / {totalPages}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-3 px-8 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Next
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InterviewQuestionList;
