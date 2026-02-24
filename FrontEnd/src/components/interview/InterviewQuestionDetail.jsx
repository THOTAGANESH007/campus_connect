import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ThumbsUp,
  MessageSquare,
  Trash2,
  Send,
  User,
  Calendar,
  Building,
  Briefcase,
  Tag,
  Lightbulb,
  Edit2,
  Eye,
  EyeOff,
  BookOpen,
  ChevronDown
} from "lucide-react";
import {
  getQuestionById,
  toggleUpvoteQuestion,
  addComment,
  deleteComment,
  deleteQuestion,
} from "../../services/interviewQuestionService";

const DIFFICULTY_STYLES = {
  Easy: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Hard: "bg-red-500/20 text-red-400 border-red-500/30",
};
const ROUND_COLORS = {
  Aptitude: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Technical: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Coding: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  HR: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "Group Discussion": "bg-teal-500/20 text-teal-400 border-teal-500/30",
  "Case Study": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Other: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

const InterviewQuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const fetchQuestion = async () => {
    try {
      const data = await getQuestionById(id);
      setQuestion(data);
    } catch {
      navigate("/interview-questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const handleUpvote = async () => {
    await toggleUpvoteQuestion(id);
    fetchQuestion();
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommenting(true);
    try {
      await addComment(id, commentText);
      setCommentText("");
      fetchQuestion();
    } finally {
      setCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    await deleteComment(id, commentId);
    fetchQuestion();
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this question?")) return;
    await deleteQuestion(id);
    navigate("/interview-questions");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"
        />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">Decrypting Experience...</p>
      </div>
    );
  }
  if (!question) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 overflow-x-hidden">

      {/* Immersive Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">

        {/* Navigation & Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <button
            onClick={() => navigate("/interview-questions")}
            className="group flex items-center gap-3 text-slate-400 hover:text-white transition-all font-black text-xs uppercase tracking-widest"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
              <ArrowLeft size={16} />
            </div>
            Back to Library
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500/20 transition-all"
            >
              <Trash2 size={16} />
              Remove Post
            </button>
          </div>
        </motion.div>

        {/* Hero Experience Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-12 p-10 bg-linear-to-br from-indigo-600/20 via-slate-900/50 to-slate-900/50 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl"
        >
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
            <Building size={120} />
          </div>

          <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="w-20 h-20 bg-white text-slate-950 rounded-[2rem] flex items-center justify-center text-4xl font-black shadow-2xl shadow-white/10">
              {question.company.charAt(0)}
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className={`px-4 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${ROUND_COLORS[question.roundType] || "bg-slate-500/20 text-slate-400"}`}>
                  {question.roundType}
                </span>
                <span className={`px-4 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${DIFFICULTY_STYLES[question.difficulty]}`}>
                  {question.difficulty}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {question.questionTitle}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-slate-400 font-bold text-sm tracking-wide">
                <div className="flex items-center gap-2">
                  <Building size={18} className="text-indigo-400" />
                  {question.company}
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={18} className="text-purple-400" />
                  {question.jobRole}
                </div>
                <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                  <Calendar size={18} className="text-blue-400" />
                  Experience Shared on {new Date(question.createdAt).toLocaleDateString("en-IN", { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left Column: Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Question Content */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 text-slate-500/20 group-hover:text-slate-500/30 transition-colors">
                <BookOpen size={40} />
              </div>
              <h2 className="text-xl font-black text-white mb-6 uppercase tracking-widest flex items-center gap-3">
                <div className="w-2 h-8 bg-indigo-500 rounded-full" />
                The Challenge
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                {question.questionContent}
              </p>
            </div>

            {/* Hint / Approach */}
            {question.answerHint && (
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-[2.5rem] p-1 overflow-hidden transition-all duration-500">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="w-full text-left p-9 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${showHint ? "bg-amber-500 text-white rotate-12" : "bg-amber-500/10 text-amber-500"}`}>
                      <Lightbulb size={24} className={showHint ? "fill-white" : "fill-amber-500/30"} />
                    </div>
                    <div>
                      <h3 className="text-white font-black uppercase tracking-widest">Recommended Approach</h3>
                      <p className="text-slate-500 text-xs font-bold mt-1">Reveal tips for cracking this challenge</p>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-slate-400 group-hover:bg-white/5 transition-all ${showHint ? "rotate-180" : ""}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>

                <AnimatePresence>
                  {showHint && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-10 pb-10">
                        <div className="p-8 bg-black/40 rounded-[2rem] border border-amber-500/20">
                          <p className="text-amber-200/90 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                            {question.answerHint}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Tags */}
            {question.tags?.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {question.tags.map((tag, i) => (
                  <span key={i} className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-black text-indigo-400 uppercase tracking-widest hover:border-indigo-500/40 transition-all cursor-default">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right Column: Meta & Discussion */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Contributor Card */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-sm">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Shared By</h3>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-indigo-500/20 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-lg">
                  {question.isAnonymous ? "?" : question.postedBy?.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-black uppercase tracking-tight leading-none mb-1 text-lg">
                    {question.isAnonymous ? "Anonymous User" : question.postedBy?.name}
                  </p>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Community Member</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5">
                <button
                  onClick={handleUpvote}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 hover:-translate-y-1 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                >
                  <ThumbsUp size={18} strokeWidth={3} />
                  Helpful ({question.upvotes?.length || 0})
                </button>
              </div>
            </div>

            {/* Discussion Mini-Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
                <p className="text-2xl font-black text-white">{question.comments?.length || 0}</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Responses</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
                <p className="text-2xl font-black text-white">{question.upvotes?.length || 0}</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Upvotes</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Discussion Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-slate-900/50 border border-white/5 rounded-[3rem] p-10 backdrop-blur-md"
        >
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400">
                <MessageSquare size={24} />
              </div>
              Community Discussion
            </h2>
          </div>

          {/* Input Area */}
          <form onSubmit={handleComment} className="relative mb-12">
            <input
              type="text"
              placeholder="Share your approach or ask for clarification..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium pr-32"
            />
            <button
              type="submit"
              disabled={commenting || !commentText.trim()}
              className="absolute right-2 top-2 bottom-2 px-6 bg-white text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-400 hover:text-white transition-all disabled:opacity-30 flex items-center gap-2"
            >
              {commenting ? "Wait..." : <><Send size={14} /> Post</>}
            </button>
          </form>

          {/* Comments Feed */}
          <div className="space-y-6">
            {question.comments?.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                <MessageSquare size={48} className="mx-auto text-slate-800 mb-4" />
                <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Be the first to join the conversation</p>
              </div>
            ) : (
              question.comments.map((c) => (
                <motion.div key={c._id} layout className="flex gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center shrink-0">
                    <User size={20} className="text-indigo-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white font-black text-sm uppercase tracking-tight">{c.user?.name || "Unknown Collaborator"}</span>
                        <span className="mx-2 text-slate-700">•</span>
                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(c._id)}
                        className="text-slate-700 hover:text-red-400 transition-colors bg-white/0 hover:bg-white/5 p-2 rounded-lg"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl rounded-tl-none">
                      <p className="text-slate-300 text-sm font-medium leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InterviewQuestionDetail;
