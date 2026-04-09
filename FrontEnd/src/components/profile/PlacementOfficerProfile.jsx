import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../services/profileService";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Save,
  CheckCircle,
  PlusCircle,
  UploadCloud,
  TrendingUp,
  Briefcase,
  Users,
  BookOpen,
  PieChart,
} from "lucide-react";

export default function PlacementOfficerProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateProfile(form);
      updateUser(result.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };



  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200 py-8 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-600 hover:text-indigo-800 text-sm mb-6 inline-block font-medium transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            ← Back to Dashboard
          </button>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl font-bold text-indigo-600 shadow-sm border border-indigo-100">
              {user?.name?.charAt(0)?.toUpperCase() || "O"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 mb-1">{user?.name}</h1>
              <p className="text-slate-500 text-base mb-3">{user?.email}</p>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">
                  {user?.role?.replace("_", " ")}
                </span>
                <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Status
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Personal Info Form */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white rounded-3xl shadow-xs border border-slate-200/60 p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-500 to-purple-600" />
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
              <User size={22} className="text-indigo-500" /> Personal Information
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative group">
                  <User
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                  />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-700 font-medium transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative group">
                  <Phone
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Your contact number"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-700 font-medium transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full mt-8 flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-60 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              {saved ? (
                <>
                  <CheckCircle size={20} className="text-emerald-400" /> Saved!
                </>
              ) : saving ? (
                "Saving..."
              ) : (
                <>
                  <Save size={20} /> Update Profile
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Actions and Stats */}
        <div className="lg:col-span-7 space-y-8">

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4 px-1">Officer Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {/* Card 1: Create Drive */}
              <Link
                to="/drives/create"
                className="group relative bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/10 transition-colors" />
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shrink-0">
                  <PlusCircle size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                  Create New Drive
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Setup and announce a new campus placement or internship drive.
                </p>
              </Link>

              {/* Card 2: Upload Material */}
              <Link
                to="/placement-materials/share"
                className="group relative bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs hover:shadow-xl hover:border-violet-500/30 transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-violet-500/10 transition-colors" />
                <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300 shrink-0">
                  <UploadCloud size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-violet-600 transition-colors">
                  Upload Materials
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Share study materials, notes, and preparation guides.
                </p>
              </Link>

              {/* Card 3: Placement Stats */}
              <Link
                to="/placement_stats"
                className="group relative bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xs hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/10 transition-colors" />
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shrink-0">
                  <PieChart size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-emerald-600 transition-colors">
                  Placement Stats
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  View and analyze detailed analytics and student placement records.
                </p>
              </Link>
            </div>
          </div>



        </div>
      </div>
    </div>
  );
}
