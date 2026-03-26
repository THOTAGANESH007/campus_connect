import { useState, useEffect } from "react";
import { getBookmarks, toggleBookmark } from "../../services/profileService";
import { Link } from "react-router-dom";
import {
  Bookmark,
  Briefcase,
  FileText,
  HelpCircle,
  ArrowLeft,
  Trash2,
} from "lucide-react";

const tabs = [
  { key: "savedDrives", label: "Drives", icon: Briefcase, type: "drives" },
  {
    key: "savedQuestions",
    label: "Questions",
    icon: HelpCircle,
    type: "questions",
  },
  {
    key: "savedMaterials",
    label: "Materials",
    icon: FileText,
    type: "materials",
  },
];

export default function SavedItems() {
  const [bookmarks, setBookmarks] = useState({
    savedDrives: [],
    savedQuestions: [],
    savedMaterials: [],
  });
  const [activeTab, setActiveTab] = useState("savedDrives");
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await getBookmarks();
      setBookmarks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleRemove = async (type, id) => {
    try {
      await toggleBookmark(type, id);
      fetch();
    } catch (err) {
      console.error(err);
    }
  };

  const activeType = tabs.find((t) => t.key === activeTab)?.type;
  const items = bookmarks[activeTab] || [];

  const renderItem = (item) => {
    if (activeTab === "savedDrives") {
      return (
        <Link
          key={item._id}
          to={`/drives/${item._id}`}
          className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 font-black text-lg flex items-center justify-center">
            {item.companyName?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 truncate">
              {item.companyName}
            </h3>
            <p className="text-sm text-slate-500 truncate">
              {item.jobRole} — {item.driveTitle}
            </p>
            <p className="text-xs text-indigo-600 font-semibold mt-1">
              {item.ctc}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleRemove(activeType, item._id);
            }}
            className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 transition-all"
          >
            <Trash2 size={16} />
          </button>
        </Link>
      );
    }
    if (activeTab === "savedQuestions") {
      return (
        <Link
          key={item._id}
          to={`/interview-questions/${item._id}`}
          className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <HelpCircle size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 truncate">{item.title}</h3>
            <p className="text-sm text-slate-500">{item.company}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {item.tags?.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleRemove(activeType, item._id);
            }}
            className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 transition-all"
          >
            <Trash2 size={16} />
          </button>
        </Link>
      );
    }
    if (activeTab === "savedMaterials") {
      return (
        <div
          key={item._id}
          className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <FileText size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 truncate">{item.title}</h3>
            <p className="text-sm text-slate-500">
              {item.category} · {item.fileType?.toUpperCase()}
            </p>
          </div>
          <button
            onClick={() => handleRemove(activeType, item._id)}
            className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Header */}
      <div className="bg-linear-to-br from-slate-900 to-purple-900 text-white py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/profile"
            className="text-purple-300 hover:text-white text-sm mb-4 inline-flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Back to Profile
          </Link>
          <h1 className="text-4xl font-black flex items-center gap-3 mt-2">
            <Bookmark size={32} className="text-purple-300" /> Saved Items
          </h1>
          <p className="text-slate-400 mt-2">
            All your bookmarked drives, questions and materials
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === key
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon size={15} />
              {label}
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${activeTab === key ? "bg-white/20" : "bg-slate-100"}`}
              >
                {bookmarks[key]?.length || 0}
              </span>
            </button>
          ))}
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
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <Bookmark size={48} className="mx-auto text-slate-200 mb-3" />
            <p className="text-slate-500 font-medium">
              No saved {activeTab.replace("saved", "").toLowerCase()} yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">{items.map(renderItem)}</div>
        )}
      </div>
    </div>
  );
}
