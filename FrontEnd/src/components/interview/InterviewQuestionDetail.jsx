import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!question) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950/20 to-slate-950 font-sans">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-15%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
        {/* Back */}
        <button
          onClick={() => navigate("/interview-questions")}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Questions
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Main Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-6">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-full border ${ROUND_COLORS[question.roundType] || "bg-slate-500/20 text-slate-400"}`}
              >
                {question.roundType}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-full border ${DIFFICULTY_STYLES[question.difficulty]}`}
              >
                {question.difficulty}
              </span>
              <span className="ml-auto text-slate-500 text-xs flex items-center gap-1">
                <Calendar size={13} />
                {new Date(question.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Company + Role */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-indigo-500/30">
                {question.company.charAt(0)}
              </div>
              <div>
                <p className="text-white font-bold">{question.company}</p>
                <p className="text-slate-400 text-sm">
                  {question.jobRole} • {question.driveYear}
                </p>
              </div>
              {/* Actions */}
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={handleDelete}
                  className="p-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-black text-white leading-tight mb-5">
              {question.questionTitle}
            </h1>

            {/* Content */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-5">
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                {question.questionContent}
              </p>
            </div>

            {/* Answer Hint */}
            {question.answerHint && (
              <div className="mb-5">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-2 text-amber-400 text-sm font-bold hover:text-amber-300 transition-colors mb-3"
                >
                  <Lightbulb size={16} className="fill-amber-400/30" />
                  {showHint ? "Hide Hint" : "Show Answer Hint"}
                  {showHint ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5"
                  >
                    <p className="text-amber-200/80 text-sm leading-relaxed whitespace-pre-wrap">
                      {question.answerHint}
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {/* Tags */}
            {question.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {question.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer: Author + Upvote */}
            <div className="flex items-center justify-between pt-5 border-t border-white/8">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <User size={15} />
                <span>
                  Posted by{" "}
                  <span className="text-white font-semibold">
                    {question.isAnonymous
                      ? "Anonymous"
                      : question.postedBy?.name || "Unknown"}
                  </span>
                </span>
              </div>
              <button
                onClick={handleUpvote}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-xl hover:bg-indigo-500/20 transition-all font-bold text-sm"
              >
                <ThumbsUp size={16} />
                Upvote ({question.upvotes?.length || 0})
              </button>
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <MessageSquare size={18} className="text-indigo-400" />
              Discussions ({question.comments?.length || 0})
            </h2>

            {/* Comment Input */}
            <form onSubmit={handleComment} className="flex gap-3 mb-8">
              <input
                type="text"
                placeholder="Share your thoughts or approach..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
              />
              <button
                type="submit"
                disabled={commenting || !commentText.trim()}
                className="px-5 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold flex items-center gap-2 text-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50"
              >
                {commenting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send size={15} />
                )}
                Post
              </button>
            </form>

            {/* Comments List */}
            {question.comments?.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">
                No discussions yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-4">
                {question.comments.map((c) => (
                  <div key={c._id} className="flex gap-3">
                    <div className="w-8 h-8 bg-linear-to-br from-indigo-500/30 to-purple-500/30 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold">
                      {c.user?.name?.charAt(0) || "?"}
                    </div>
                    <div className="flex-1 bg-white/3 border border-white/8 rounded-xl px-4 py-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-xs font-bold">
                          {c.user?.name || "Unknown"}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-600 text-xs">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => handleDeleteComment(c._id)}
                            className="text-slate-600 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InterviewQuestionDetail;
