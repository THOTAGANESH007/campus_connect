import { useState } from "react";
import { createPost } from "../../services/forumService";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";

const CATEGORIES = ["GENERAL", "PLACEMENT", "INTERVIEW", "INTERNSHIP", "ACADEMICS"];

export default function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "", category: "GENERAL" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return alert("Title and content are required");
    setLoading(true);
    try {
      const post = await createPost(form);
      navigate(`/forum/${post._id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <Link to="/forum" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 mb-8 font-medium">
          <ArrowLeft size={14} /> Back to Forum
        </Link>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <h1 className="text-2xl font-black text-slate-900 mb-6">Create New Post</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="What's on your mind?"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Content *</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={8}
                placeholder="Share your question, experience, or insights..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60"
            >
              <Send size={16} /> {loading ? "Publishing..." : "Publish Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
