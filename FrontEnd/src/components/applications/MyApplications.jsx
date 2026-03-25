import { useState, useEffect } from "react";
import { getMyApplications } from "../../services/applicationService";
import { Link } from "react-router-dom";
import { Briefcase, Calendar, Building2, ArrowLeft, RefreshCw } from "lucide-react";

const STATUS_STYLES = {
  APPLIED:     { bg: "bg-blue-100   text-blue-700",    dot: "bg-blue-500"   },
  SHORTLISTED: { bg: "bg-amber-100  text-amber-700",   dot: "bg-amber-500"  },
  SELECTED:    { bg: "bg-green-100  text-green-700",   dot: "bg-green-500"  },
  REJECTED:    { bg: "bg-red-100    text-red-700",     dot: "bg-red-500"    },
};

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await getMyApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const counts = applications.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <Link to="/drives" className="text-indigo-300 hover:text-white text-sm mb-4 inline-flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Drives
          </Link>
          <h1 className="text-4xl font-black mt-2">My Applications</h1>
          <p className="text-slate-400 mt-2">Track your placement application status</p>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {["APPLIED", "SHORTLISTED", "SELECTED", "REJECTED"].map((s) => {
              const style = STATUS_STYLES[s];
              return (
                <div key={s} className="bg-white/10 rounded-2xl p-4 backdrop-blur border border-white/10">
                  <p className="text-2xl font-black">{counts[s] || 0}</p>
                  <p className={`text-xs font-bold uppercase mt-1 ${style.bg.split(" ")[1]}`}>{s}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 mt-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={fetch}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 font-medium"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="flex gap-2">
              {[0,1,2].map(i => (
                <div key={i} className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
              ))}
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
            <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700">No applications yet</h3>
            <p className="text-slate-400 mt-2 mb-6">Browse drives and apply to get started!</p>
            <Link to="/drives" className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">
              Browse Drives
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const style = STATUS_STYLES[app.status] || STATUS_STYLES.APPLIED;
              const drive = app.driveId;
              return (
                <div
                  key={app._id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700 font-black text-lg shrink-0">
                    {drive?.companyName?.charAt(0) || "?"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 truncate">{drive?.companyName || "N/A"}</h3>
                    <p className="text-sm text-slate-500 truncate">{drive?.jobRole} — {drive?.driveTitle}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Calendar size={12} /> Applied {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                      {drive?.ctc && (
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Building2 size={12} /> {drive.ctc}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${style.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      {app.status}
                    </span>
                    {drive?._id && (
                      <Link
                        to={`/drives/${drive._id}`}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold underline"
                      >
                        View
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
