import { useState, useEffect } from "react";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  getOverview,
  getByCompany,
  getByBranch,
  getStatusDistribution,
} from "../../services/profileService";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Briefcase,
  CheckCircle,
  TrendingUp,
  BarChart2,
  PieChart,
  ArrowLeft,
} from "lucide-react";

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
  "#14b8a6",
  "#f97316",
  "#a855f7",
];

export default function PlacementDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [byCompany, setByCompany] = useState([]);
  const [byBranch, setByBranch] = useState([]);
  const [statusDist, setStatusDist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getOverview(),
      getByCompany(),
      getByBranch(),
      getStatusDistribution(),
    ])
      .then(([ov, comp, br, st]) => {
        setOverview(ov);
        setByCompany(comp);
        setByBranch(br);
        setStatusDist(st);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = overview
    ? [
        {
          label: "Total Students",
          value: overview.totalStudents,
          icon: Users,
          color: "indigo",
        },
        {
          label: "Active Drives",
          value: overview.totalDrives,
          icon: Briefcase,
          color: "purple",
        },
        {
          label: "Applications",
          value: overview.totalApplications,
          icon: TrendingUp,
          color: "amber",
        },
        {
          label: "Selections",
          value: overview.selectedCount,
          icon: CheckCircle,
          color: "emerald",
        },
      ]
    : [];

  const companyChartData = {
    labels: byCompany.map((d) => d._id),
    datasets: [
      {
        label: "Selected",
        data: byCompany.map((d) => d.count),
        backgroundColor: COLORS,
        borderRadius: 6,
      },
    ],
  };

  const branchChartData = {
    labels: byBranch.map((d) => d._id || "Unknown"),
    datasets: [
      {
        data: byBranch.map((d) => d.count),
        backgroundColor: COLORS,
        borderWidth: 2,
      },
    ],
  };

  const statusChartData = {
    labels: statusDist.map((d) => d._id),
    datasets: [
      {
        data: statusDist.map((d) => d.count),
        backgroundColor: ["#6366f1", "#f59e0b", "#22c55e", "#ef4444"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: { font: { size: 11 }, padding: 16 },
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-8 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-600 hover:text-indigo-800 text-sm mb-4 inline-flex items-center gap-1 font-medium transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            <ArrowLeft size={14} /> Back to Drives
          </button>
          <h1 className="text-2xl font-bold mt-2 flex items-center gap-2 text-slate-800">
            <BarChart2 size={28} className="text-indigo-500" /> Placement
            Analytics
          </h1>
          <p className="text-slate-500 mt-1">
            Real-time placement statistics and insights
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10">
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
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {statCards.map(({ label, value, icon: Icon, color }) => (
                <div
                  key={label}
                  className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-6`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl bg-${color}-50 text-${color}-600 flex items-center justify-center mb-4`}
                  >
                    <Icon size={22} />
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{value}</p>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Placements by Company */}
              {byCompany.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                  <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <BarChart2 size={18} className="text-indigo-500" />{" "}
                    Placements by Company
                  </h2>
                  <Bar data={companyChartData} options={chartOptions} />
                </div>
              )}

              {/* Placements by Branch */}
              {byBranch.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                  <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <PieChart size={18} className="text-purple-500" />{" "}
                    Placements by Branch
                  </h2>
                  <div className="max-w-xs mx-auto">
                    <Doughnut data={branchChartData} options={pieOptions} />
                  </div>
                </div>
              )}
            </div>

            {/* Application Status Distribution */}
            {statusDist.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-6">
                  Application Status Distribution
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="max-w-xs mx-auto w-full">
                    <Pie data={statusChartData} options={pieOptions} />
                  </div>
                  <div className="space-y-3">
                    {statusDist.map((d, i) => {
                      const total = statusDist.reduce((s, x) => s + x.count, 0);
                      const pct = total
                        ? ((d.count / total) * 100).toFixed(1)
                        : 0;
                      return (
                        <div key={d._id} className="flex items-center gap-3">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{
                              background: [
                                "#6366f1",
                                "#f59e0b",
                                "#22c55e",
                                "#ef4444",
                              ][i],
                            }}
                          />
                          <span className="text-sm font-semibold text-slate-700 w-24">
                            {d._id}
                          </span>
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${pct}%`,
                                background: [
                                  "#6366f1",
                                  "#f59e0b",
                                  "#22c55e",
                                  "#ef4444",
                                ][i],
                              }}
                            />
                          </div>
                          <span className="text-sm text-slate-500 font-medium w-10 text-right">
                            {pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Empty state */}
            {byCompany.length === 0 && byBranch.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                <BarChart2 size={56} className="mx-auto text-slate-200 mb-4" />
                <h3 className="text-xl font-bold text-slate-700">
                  No placement data yet
                </h3>
                <p className="text-slate-400 mt-2">
                  Data will appear as students apply and get selected.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
