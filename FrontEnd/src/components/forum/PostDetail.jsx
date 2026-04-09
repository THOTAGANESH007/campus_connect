import { useState, useEffect } from "react";
import {
  getPostById,
  addComment,
  toggleUpvote,
  deletePost,
} from "../../services/forumService";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, ThumbsUp, Trash2, Send, MessageSquare, Bookmark } from "lucide-react";
import { getBookmarks, toggleBookmark } from "../../services/profileService";
import { toast } from "react-hot-toast";

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    getPostById(id)
      .then(setPost)
      .catch(console.error)
      .finally(() => setLoading(false));

    if (user) {
      getBookmarks()
        .then((data) => {
          setIsSaved(data.savedPosts?.some((p) => p._id === id) || false);
        })
        .catch(console.error);
    }
  }, [id, user]);

  const handleToggleSave = async () => {
    if (!user) return toast.error("Please login to save posts");
    try {
      const res = await toggleBookmark("posts", id);
      setIsSaved(res.saved);
      toast.success(res.saved ? "Post bookmarked" : "Post removed");
    } catch (_) {
      toast.error("Failed to update bookmark");
    }
  };

  const handleUpvote = async () => {
    try {
      const { upvotes } = await toggleUpvote(id);
      setPost((p) => ({ ...p, upvotes: Array(upvotes).fill(null) }));
    } catch (_) { }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    setPosting(true);
    try {
      const newComment = await addComment(id, comment);
      setPost((p) => ({ ...p, comments: [...p.comments, newComment] }));
      setComment("");
    } catch (_) {
      alert("Failed to add comment");
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    await deletePost(id);
    navigate("/forum");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  if (!post)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Post not found
      </div>
    );

  const isOwner = user?._id === post.userId?._id;
  const isAdmin = ["ADMIN", "PLACEMENT_OFFICER"].includes(user?.role);
  const upvoteCount = post.upvotes?.length || 0;
  const hasUpvoted = post.upvotes?.some((u) => (u?._id || u) === user?._id);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 mb-6 font-medium cursor-pointer bg-transparent border-none p-0"
        >
          <ArrowLeft size={14} /> back  Forum
        </button>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase">
                {post.category}
              </span>
              <h1 className="text-2xl font-black text-slate-900 mt-3">
                {post.title}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-7 h-7 rounded-full bg-indigo-200 text-indigo-700 font-bold text-xs flex items-center justify-center">
                  {post.userId?.name?.charAt(0)}
                </div>
                <span className="text-slate-600 text-sm font-medium">
                  {post.userId?.name}
                </span>
                <span className="text-slate-400 text-xs">
                  · {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleSave}
                className={`p-2 rounded-xl transition-all ${isSaved
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : "bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white border border-slate-100"
                  }`}
                title={isSaved ? "Unsave Post" : "Save Post"}
              >
                <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
              </button>
              {(isOwner || isAdmin) && (
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base">
            {post.content}
          </div>

          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-100">
            <button
              onClick={handleUpvote}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${hasUpvoted
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
            >
              <ThumbsUp size={16} /> {upvoteCount}{" "}
              {upvoteCount === 1 ? "Upvote" : "Upvotes"}
            </button>
            <span className="flex items-center gap-1 text-sm text-slate-400">
              <MessageSquare size={14} /> {post.comments?.length || 0} comments
            </span>
          </div>
        </div>

        {/* Comments */}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Comments</h2>
          <div className="space-y-3 mb-6">
            {post.comments?.length === 0 && (
              <p className="text-slate-400 text-sm py-4 text-center">
                Be the first to comment!
              </p>
            )}
            {post.comments?.map((c) => (
              <div
                key={c._id}
                className="bg-white rounded-2xl border border-slate-100 p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                    {c.userId?.name?.charAt(0)}
                  </div>
                  <span className="font-semibold text-slate-800 text-sm">
                    {c.userId?.name}
                  </span>
                  <span className="text-slate-400 text-xs">
                    · {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {c.content}
                </p>
              </div>
            ))}
          </div>

          {/* Add comment */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Write your comment..."
              className="w-full resize-none text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleComment}
                disabled={posting || !comment.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50"
              >
                <Send size={14} /> {posting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
