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

  const handleUpvote = async (id) => {
    try {
      await toggleUpvoteQuestion(id);
      fetchQuestions();
    } catch {}
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 280, damping: 22 },
    },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950/30 to-slate-950 font-sans">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-5%] w-[45%] h-[45%] bg-indigo-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/15 rounded-full blur-[100px]" />
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
              <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <BookOpen size={20} className="text-white" />
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">
                Interview Questions
              </h1>
              <Sparkles size={22} className="text-yellow-400 fill-yellow-400" />
            </div>
            <p className="text-slate-400 font-medium ml-13">
              Community-shared real interview experiences •{" "}
              <span className="text-indigo-400 font-bold">{total} posts</span>
            </p>
          </div>
          <Link
            to="/interview-questions/create"
            className="group flex items-center gap-2 px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
          >
            <Plus size={18} strokeWidth={3} />
            Share Experience
          </Link>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {[
            {
              icon: <TrendingUp size={16} />,
              label: "Total Posts",
              val: total,
              color: "text-indigo-400",
            },
            {
              icon: <Award size={16} />,
              label: "Companies",
              val: "50+",
              color: "text-purple-400",
            },
            {
              icon: <Clock size={16} />,
              label: "This Week",
              val: "New",
              color: "text-emerald-400",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-3 backdrop-blur-sm"
            >
              <span className={s.color}>{s.icon}</span>
              <div>
                <p className="text-white font-bold text-lg leading-none">
                  {s.val}
                </p>
                <p className="text-slate-500 text-xs">{s.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Filters */}
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
              placeholder="Search company, role, question..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm font-medium"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={roundType}
              onChange={(e) => {
                setRoundType(e.target.value);
                setPage(1);
              }}
              className="bg-white/10 border border-white/10 text-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Rounds</option>
              {[
                "Aptitude",
                "Technical",
                "Coding",
                "HR",
                "Group Discussion",
                "Case Study",
                "Other",
              ].map((r) => (
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
              className="bg-white/10 border border-white/10 text-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Levels</option>
              {["Easy", "Medium", "Hard"].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-56 bg-white/5 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">{error}</div>
        ) : questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-5">
              <BookOpen size={32} className="text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No questions found
            </h3>
            <p className="text-slate-500 max-w-md">
              Be the first to share an interview experience!
            </p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.07 } } }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {questions.map((q) => (
              <motion.div
                key={q._id}
                variants={cardVariants}
                whileHover={{ y: -6 }}
              >
                <Link
                  to={`/interview-questions/${q._id}`}
                  className="block h-full"
                >
                  <div className="group h-full bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
                    {/* Top Row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${ROUND_COLORS[q.roundType] || "bg-slate-500"}`}
                        />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                          {q.roundType}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border ${DIFFICULTY_STYLES[q.difficulty]}`}
                      >
                        {q.difficulty}
                      </span>
                    </div>

                    {/* Company & Role */}
                    <div className="mb-3">
                      <p className="text-indigo-400 font-bold text-sm">
                        {q.company}
                      </p>
                      <p className="text-slate-400 text-xs">
                        {q.jobRole} • {q.driveYear}
                      </p>
                    </div>

                    {/* Title */}
                    <h3 className="text-white font-bold text-base leading-snug mb-4 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                      {q.questionTitle}
                    </h3>

                    {/* Tags */}
                    {q.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {q.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                        <User size={13} />
                        <span>
                          {q.isAnonymous
                            ? "Anonymous"
                            : q.postedBy?.name || "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-500 text-xs">
                        <span className="flex items-center gap-1">
                          <ThumbsUp size={13} />
                          {q.upvotes?.length || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare size={13} />
                          {q.comments?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
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

export default InterviewQuestionList;
