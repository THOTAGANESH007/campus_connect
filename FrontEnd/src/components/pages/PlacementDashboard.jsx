import { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, Legend, AreaChart, Area, LabelList
} from "recharts";
import {
  Users, CheckCircle, TrendingUp, BarChart2, PieChart as PieChartIcon, ArrowLeft, Download, Calendar, CloudUpload, Info, Search, Filter,
  MapPin, Rocket, Zap, Award, Target, TrendingDown, MoreHorizontal, GraduationCap, Briefcase
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "../../context/AuthContext";
import {
  getBatches,
  getBatchDetail,
  getSummaryStats,
  getBranchStats,
  getCompanyStats,
  getPackageDistribution,
  getCGPAStats,
  getInsights,
  getRoleDistribution,
  getBranchEfficiency
} from "../../services/batchPlacementService";

import { StatCard } from "../placement/StatCard";
import { InsightsPanel } from "../placement/InsightsPanel";
import { PlacementTable } from "../placement/PlacementTable";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];

export default function PlacementDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOfficer = user?.role === "PLACEMENT_OFFICER" || user?.role === "ADMIN";

  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [loading, setLoading] = useState(true);

  // Data States
  const [summary, setSummary] = useState(null);
  const [branchData, setBranchData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [packageDist, setPackageDist] = useState([]);
  const [cgpaData, setCgpaData] = useState(null);
  const [insights, setInsights] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [efficiencyData, setEfficiencyData] = useState([]);
  const [rawRecords, setRawRecords] = useState([]);

  // Fetch initial batches
  useEffect(() => {
    getBatches()
      .then((data) => {
        setBatches(data);
        if (data.length > 0 && !selectedBatchId) {
          setSelectedBatchId(data[0]._id);
        }
      })
      .catch(console.error);
  }, []);

  // Fetch all analytics when selection changes
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const bid = selectedBatchId;

        const [sum, branch, comp, pkg, cgpa, insts, roles, eff] = await Promise.all([
          getSummaryStats(bid),
          getBranchStats(bid),
          getCompanyStats(bid),
          getPackageDistribution(bid),
          getCGPAStats(bid),
          getInsights(bid),
          getRoleDistribution(bid),
          getBranchEfficiency(bid)
        ]);

        setSummary(sum);
        setBranchData(branch);
        setCompanyData(comp);
        setPackageDist(pkg);
        setCgpaData(cgpa);
        setInsights(insts);
        setRoleData(roles);
        setEfficiencyData(eff);

        // For the table, fetch batch detail if specific, otherwise we might need a generic "get all records"
        // But for now, let's fetch batch detail if specific to get records
        // For the table, fetch batch detail if specific to get records
        if (selectedBatchId) {
          const detail = await getBatchDetail(selectedBatchId);
          setRawRecords(detail.records || []);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedBatchId, batches]);

  const handleDownload = (url) => {
    if (!url) return;
    const downloadUrl = url.includes('/upload/')
      ? url.replace('/upload/', '/upload/fl_attachment/')
      : url;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `Placement_Report.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const dashboardStats = useMemo(() => [
    { label: "Total Students", value: summary?.totalStudents || 0, icon: Users, color: "blue" },
    { label: "Placed Records", value: summary?.placedCount || 0, icon: CheckCircle, color: "emerald", trend: 12 },
    { label: "Average Package", value: `${summary?.avgPackage?.toFixed(1) || 0} LPA`, icon: Rocket, color: "indigo" },
    { label: "Highest Package", value: `${summary?.maxPackage || 0} LPA`, icon: Award, color: "purple" },
  ], [summary]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md p-4 border border-slate-100 rounded-2xl shadow-xl">
          <p className="font-black text-slate-800 text-xs uppercase tracking-widest mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <p className="text-sm font-bold text-slate-600">
                {entry.name}: <span className="text-slate-900 font-black">{entry.value.toFixed(1)}{entry.name.includes('%') ? '%' : ''}</span>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-sans selection:bg-indigo-100">
      {/* Header Section */}
      <header className="bg-white border-b border-slate-200 pt-12 pb-16 px-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-40 -left-20 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-40" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button
              onClick={() => navigate(-1)}
              className="text-slate-400 hover:text-indigo-600 text-xs mb-6 inline-flex items-center gap-2 font-black uppercase tracking-[0.2em] transition-all group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Return Dashboard
            </button>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <span className="bg-indigo-600 text-white p-3 rounded-[1.5rem] shadow-xl shadow-indigo-600/20">
                <BarChart2 size={32} />
              </span>
              Placement Analytics
            </h1>
            <p className="text-slate-500 font-medium text-lg mt-4 max-w-xl leading-relaxed">
              Comprehensive data intelligence for the current placement cycle. Track metrics, visualize trends, and export detailed reports.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-4">
            {isOfficer && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/placements/upload")}
                className="flex items-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-600/10"
              >
                <CloudUpload size={20} /> Upload New Batch
              </motion.button>
            )}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const targetBatch = selectedBatchId === "all" ? batches[0] : batches.find(b => b._id === selectedBatchId);
                if (targetBatch?.fileUrl) handleDownload(targetBatch.fileUrl);
              }}
              className="flex items-center gap-3 bg-white border-2 border-slate-100 text-slate-800 px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm"
            >
              <Download size={20} /> Full Batch Report (.xlsx)
            </motion.button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 mt-[-3rem] relative z-20">
        {/* Batch Selection Box */}
        <div className="bg-white/60 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white shadow-xl flex flex-wrap items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Calendar size={22} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Timeframe Horizon</label>
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="bg-transparent text-slate-900 font-black text-xl focus:outline-none cursor-pointer pr-8"
              >
                {batches.map(b => (
                  <option key={b._id} value={b._id}>{b.batchName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 px-8 border-l border-slate-100">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Batch</span>
              <span className="text-sm font-black text-slate-700">{batches.length > 0 ? batches[0].batchName : 'None'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Success Rate</span>
              <span className="text-sm font-black text-emerald-600">
                {summary?.totalStudents ? ((summary.placedCount / summary.totalStudents) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center flex-col items-center py-40 gap-6">
            <div className="w-16 h-16 border-[6px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin shadow-lg"></div>
            <div className="text-center">
              <p className="text-slate-900 font-black uppercase tracking-widest text-sm">Synchronizing Deep Analytics</p>
              <p className="text-slate-400 font-bold text-xs mt-2 animate-pulse">Computing aggregation pipelines...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {dashboardStats.map((stat) => <StatCard key={stat.label} {...stat} />)}
            </div>

            {/* Insights Panel */}
            <InsightsPanel insights={insights} />

            {/* Visual Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Branch-wise Performance */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-sm p-10"
              >
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                      <Zap size={20} className="text-orange-500" /> Branch-wise Performance
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Placement Success Percentage</p>
                  </div>
                  <MoreHorizontal className="text-slate-300" />
                </div>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={branchData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="branch" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} domain={[0, 100]} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
                      <Bar
                        dataKey="placementPercentage"
                        radius={[10, 10, 0, 0]}
                        name="Placement %"
                        barSize={45}
                      >
                        {branchData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Placement Status Distribution */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-sm p-10 flex flex-col"
              >
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3 mb-12">
                  <PieChartIcon size={20} className="text-purple-500" /> Placement rate
                </h2>
                <div className="flex-1 flex items-center justify-center relative min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Placed', value: summary?.placedCount || 0 },
                          { name: 'Not Placed', value: summary?.unplacedCount || 0 }
                        ]}
                        cx="50%" cy="50%"
                        innerRadius={85}
                        outerRadius={115}
                        paddingAngle={10}
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#f1f5f9" />
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-4xl font-black text-slate-900 leading-none">
                      {summary?.totalStudents ? ((summary.placedCount / summary.totalStudents) * 100).toFixed(0) : 0}%
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Conversion</span>
                  </div>
                </div>
                <div className="mt-8 space-y-3">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Confirmed Offers</span>
                    <span className="text-emerald-600 font-black">{summary?.placedCount}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Active Pipeline</span>
                    <span className="text-slate-400 font-black">{summary?.unplacedCount}</span>
                  </div>
                </div>
              </motion.div>

              {/* Company Hiring Bar Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-sm p-10"
              >
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3 mb-10">
                  <Target size={20} className="text-rose-500" /> Top Recruiters
                </h2>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={companyData}>
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="_id"
                        type="category"
                        width={100}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 900, fill: '#475569' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={20} name="Hires" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Package Distribution Pie Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-sm p-10"
              >
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3 mb-10">
                  <Zap size={20} className="text-indigo-500" /> Package Spread
                </h2>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={packageDist}
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="range"
                      >
                        {packageDist.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: 900 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* CGPA vs Placement Success (Horizontal Range) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-sm p-10"
              >
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3 mb-10">
                  <GraduationCap size={20} className="text-emerald-500" /> Academic Impact
                </h2>
                <div className="space-y-6">
                  {cgpaData?.placementByCGPA?.map((range, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          CGPA Range: {range._id === "default" ? "8+" : `${range._id}-${range._id + 1}`}
                        </span>
                        <span className="text-xs font-black text-indigo-600">
                          {((range.placed / range.total) * 100).toFixed(0)}% Placed
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(range.placed / range.total) * 100}%` }}
                          className="h-full bg-indigo-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Role Distribution Pie Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-sm p-10"
              >
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3 mb-10">
                  <Briefcase size={20} className="text-blue-500" /> Key Job Roles
                </h2>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={roleData}
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="_id"
                      >
                        {roleData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: 900 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Branch Efficiency Leaderboard */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-sm p-10 col-span-1 lg:col-span-3"
              >
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                            <TrendingUp size={20} className="text-emerald-500" /> Department Efficiency
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Weighted: 60% Placements | 40% AVG Package</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {efficiencyData.map((item, idx) => (
                        <div key={item.branch} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50 flex flex-col gap-4 group hover:bg-white transition-all">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-xs`} style={{ backgroundColor: COLORS[idx % COLORS.length] }}>
                                        {item.branch.substring(0, 2)}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-800 text-sm uppercase tracking-tight">{item.branch}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">{item.placedCount} Placed / {item.totalStudents}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Score</p>
                                    <p className="text-lg font-black text-slate-900 leading-none mt-1">{item.efficiencyScore.toFixed(0)}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                                        <span>Placement Rate</span>
                                        <span className="text-indigo-600">{item.placementPercentage.toFixed(1)}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.placementPercentage}%` }}
                                            className="h-full bg-indigo-500 rounded-full"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Avg. Offer</span>
                                        <span className="text-xs font-black text-slate-800">{item.avgPackage.toFixed(1)} LPA</span>
                                    </div>
                                    <div className="bg-emerald-50 px-3 py-1.5 rounded-xl">
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
              </motion.div>

              {/* CGPA vs Package Scatter Plot (Full Width) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-3 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-sm p-10"
              >
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                      <TrendingUp size={20} className="text-blue-500" /> Academic Correlation
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">CGPA vs Package (LPA)</p>
                  </div>
                </div>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        type="number"
                        dataKey="cgpa"
                        name="CGPA"
                        domain={[5, 10]}
                        axisLine={{ stroke: '#475569', strokeWidth: 2 }}
                        tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                        label={{ value: 'CGPA', position: 'insideBottomRight', offset: -10, fontSize: 10, fontWeight: 900, fill: '#475569' }}
                      />
                      <YAxis
                        type="number"
                        dataKey="package"
                        name="Package (LPA)"
                        axisLine={{ stroke: '#475569', strokeWidth: 2 }}
                        tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                        label={{ value: 'LPA', angle: -90, position: 'insideLeft', fontSize: 10, fontWeight: 900, fill: '#475569' }}
                      />
                      <ZAxis range={[60, 60]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Scatter name="Students" data={cgpaData?.cgpaVsPackage} fill="#6366f1" opacity={0.6} />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Records Table */}
            <PlacementTable
              data={rawRecords}
              batchName={batches.find(b => b._id === selectedBatchId)?.batchName || 'Loading...'}
            />
          </div>
        )}
      </div>
    </div>
  );
}
