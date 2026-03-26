import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateProfile, uploadResume } from "../../services/profileService";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Upload,
  Save,
  CheckCircle,
  BookOpen,
  Star,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

const BRANCHES = [
  "CSE",
  "ECE",
  "EEE",
  "ME",
  "CE",
  "IT",
  "AIDS",
  "AIML",
  "Other",
];

export default function StudentProfile() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    cgpa: user?.cgpa || "",
    branch: user?.branch || "",
    skills: (user?.skills || []).join(", "),
  });
  const [skillInput, setSkillInput] = useState((user?.skills || []).join(", "));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState(user?.resume || "");

  // Profile completeness
  const fields = ["name", "phone", "cgpa", "branch", "skills", "resume"];
  const filledProfile = {
    name: !!form.name,
    phone: !!form.phone,
    cgpa: !!form.cgpa,
    branch: !!form.branch,
    skills: skillInput.trim().length > 0,
    resume: !!resumeUrl,
  };
  const completeness = Math.round(
    (Object.values(filledProfile).filter(Boolean).length / fields.length) * 100,
  );

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateProfile({ ...form, skills: skillInput });
      updateUser(result.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("resume", resumeFile);
      const result = await uploadResume(fd);
      setResumeUrl(result.resume);
      updateUser({ resume: result.resume });
      alert("✅ Resume uploaded successfully!");
    } catch (err) {
      alert(
        "Resume upload failed: " + (err.response?.data?.message || err.message),
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Hero */}
      <div className="bg-linear-to-br from-indigo-900 via-slate-900 to-black text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/drives"
            className="text-indigo-300 hover:text-white text-sm mb-6 inline-block"
          >
            ← Back to Drives
          </Link>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-3xl font-black">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-3xl font-black">{user?.name}</h1>
              <p className="text-indigo-300">{user?.email}</p>
              <span className="mt-2 inline-block px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 rounded-full text-xs font-bold uppercase">
                {user?.role}
              </span>
            </div>
          </div>

          {/* Completeness Bar */}
          <div className="mt-8 bg-white/5 rounded-2xl p-5 border border-white/10">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-slate-300">
                Profile Completeness
              </span>
              <span className="text-sm font-bold text-white">
                {completeness}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${completeness}%`,
                  background:
                    completeness >= 80
                      ? "#22c55e"
                      : completeness >= 50
                        ? "#f59e0b"
                        : "#ef4444",
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {fields.map((f) => (
                <span
                  key={f}
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    filledProfile[f]
                      ? "bg-green-500/20 text-green-300"
                      : "bg-white/5 text-slate-400"
                  }`}
                >
                  {filledProfile[f] ? "✓" : "○"} {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <User size={20} className="text-indigo-500" /> Personal Information
          </h2>

          {[
            {
              label: "Full Name",
              name: "name",
              icon: User,
              type: "text",
              placeholder: "Your full name",
            },
            {
              label: "Phone",
              name: "phone",
              icon: Phone,
              type: "tel",
              placeholder: "10-digit phone",
            },
          ].map(({ label, name, icon: Icon, type, placeholder }) => (
            <div key={name} className="mb-5">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                {label}
              </label>
              <div className="relative">
                <Icon
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>
          ))}

          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Branch
            </label>
            <div className="relative">
              <BookOpen
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                name="branch"
                value={form.branch}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
              >
                <option value="">Select branch</option>
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              CGPA
            </label>
            <div className="relative">
              <Star
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                name="cgpa"
                value={form.cgpa}
                onChange={handleChange}
                placeholder="e.g. 8.5"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Skills{" "}
              <span className="text-slate-400 font-normal">
                (comma separated)
              </span>
            </label>
            <div className="relative">
              <Briefcase
                size={16}
                className="absolute left-3 top-3.5 text-slate-400"
              />
              <textarea
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                rows={3}
                placeholder="React, Node.js, Python, SQL..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60"
          >
            {saved ? (
              <>
                <CheckCircle size={18} /> Saved!
              </>
            ) : saving ? (
              "Saving..."
            ) : (
              <>
                <Save size={18} /> Save Profile
              </>
            )}
          </button>
        </div>

        {/* Resume */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileText size={20} className="text-indigo-500" /> Resume
            </h2>

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-semibold mb-4 underline"
              >
                <FileText size={16} /> View current resume
              </a>
            )}

            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all">
              <Upload size={28} className="text-slate-400 mb-2" />
              <span className="text-sm font-medium text-slate-500">
                {resumeFile ? resumeFile.name : "Click to upload PDF"}
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => setResumeFile(e.target.files[0])}
              />
            </label>

            <button
              onClick={handleResumeUpload}
              disabled={!resumeFile || uploading}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-40"
            >
              <Upload size={16} />{" "}
              {uploading ? "Uploading..." : "Upload Resume"}
            </button>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Quick Links
            </h2>
            {[
              {
                to: "/my-applications",
                label: "My Applications",
                icon: Briefcase,
              },
              { to: "/saved", label: "Saved Items", icon: Star },
              { to: "/forum", label: "Discussion Forum", icon: BookOpen },
            ].map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0 text-slate-700 hover:text-indigo-600 font-medium transition-colors"
              >
                <Icon size={18} className="text-indigo-400" /> {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
