import { useState, useEffect } from "react";
import {
  getPosts,
  toggleUpvote,
  deletePost,
} from "../../services/forumService";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getBookmarks, toggleBookmark } from "../../services/profileService";
import { toast } from "react-hot-toast";
import {
  MessageSquare,
  ThumbsUp,
  PenSquare,
  Trash2,
  Search,
  Filter,
  Bookmark,
} from "lucide-react";

const CATEGORIES = [
  "ALL",
  "GENERAL",
  "PLACEMENT",
  "INTERVIEW",
  "INTERNSHIP",
  "ACADEMICS",
];

const catColors = {
  GENERAL: "bg-slate-100   text-slate-700",
  PLACEMENT: "bg-indigo-100  text-indigo-700",
  INTERVIEW: "bg-purple-100  text-purple-700",
  INTERNSHIP: "bg-teal-100    text-teal-700",
  ACADEMICS: "bg-amber-100   text-amber-700",
};

export default function ForumPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("ALL");
  const [search, setSearch] = useState("");
  const [savedIds, setSavedIds] = useState([]);

  const fetchSaved = async () => {
    if (!user) return;
    try {
      const data = await getBookmarks();
      setSavedIds(data.savedPosts?.map((p) => p._id) || []);
    } catch (_) {}
  };

  useEffect(() => {
    fetchSaved();
  }, [user]);

  const handleToggleSave = async (e, id) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to save posts");
    try {
      const res = await toggleBookmark("posts", id);
      setSavedIds(res.savedPosts.map((x) => x.toString()));
      toast.success(res.saved ? "Post bookmarked" : "Post removed");
    } catch (_) {
      toast.error("Failed to update bookmark");
    }
  };

  const fetch = async () => {
    setLoading(true);
    try {
      const params = { limit: 30 };
      if (category !== "ALL") params.category = category;
      const data = await getPosts(params);
      setPosts(data.posts);
      setTotal(data.total);
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [category]);

  const handleUpvote = async (e, id) => {
    e.preventDefault();
    try {
      const { upvotes } = await toggleUpvote(id);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, upvotes: Array(upvotes).fill(null) } : p,
        ),
      );
    } catch (_) {}
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (!window.confirm("Delete this post?")) return;
    await deletePost(id);
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  const filtered = posts.filter(
    (p) =>
      search.trim() === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Header */}
      <div className="bg-linear-to-br from-slate-900 via-indigo-950 to-black text-white py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-black">Discussion Forum</h1>
          <p className="text-slate-400 mt-2">
            Share experiences, ask questions, help your peers
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <div className="flex-1 relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search posts..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <Link
              to="/forum/create"
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all whitespace-nowrap"
            >
              <PenSquare size={16} /> New Post
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-8">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${
                category === cat
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-white border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-400 self-center">
            {total} posts
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
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
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <MessageSquare size={48} className="mx-auto text-slate-200 mb-3" />
            <p className="text-slate-500 font-medium mb-4">No posts found</p>
            <Link
              to="/forum/create"
              className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 text-sm"
            >
              Create First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((post) => {
              const isOwner = user?._id === post.userId?._id;
              const isAdmin = ["ADMIN", "PLACEMENT_OFFICER"].includes(
                user?.role,
              );
              return (
                <Link
                  key={post._id}
                  to={`/forum/${post._id}`}
                  className="block bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all p-6 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${catColors[post.category] || catColors.GENERAL}`}
                        >
                          {post.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-700 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                        {post.content}
                      </p>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 font-bold text-[10px] flex items-center justify-center">
                            {post.userId?.name?.charAt(0)}
                          </div>
                          <span className="text-xs text-slate-500 font-medium">
                            {post.userId?.name}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={(e) => handleUpvote(e, post._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-500 rounded-xl text-xs font-bold transition-all"
                      >
                        <ThumbsUp size={12} /> {post.upvotes?.length || 0}
                      </button>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <MessageSquare size={12} /> {post.comments?.length || 0}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleToggleSave(e, post._id)}
                          className={`p-1.5 rounded-lg transition-all ${
                            savedIds.includes(post._id)
                              ? "text-indigo-600 bg-indigo-50"
                              : "text-slate-300 hover:text-indigo-600 hover:bg-slate-50"
                          }`}
                          title={savedIds.includes(post._id) ? "Unsave Post" : "Save Post"}
                        >
                          <Bookmark
                            size={14}
                            fill={savedIds.includes(post._id) ? "currentColor" : "none"}
                          />
                        </button>
                        {(isOwner || isAdmin) && (
                          <button
                            onClick={(e) => handleDelete(e, post._id)}
                            className="p-1.5 text-red-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
