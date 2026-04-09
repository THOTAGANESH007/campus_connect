import React, { useState } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, Briefcase, GraduationCap, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const PlacementTable = ({ data, batchName }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredData = data.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter === "All" || item.branch === branchFilter;
    const matchesStatus = statusFilter === "All" || item.placementStatus === statusFilter;
    return matchesSearch && matchesBranch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const branches = ["All", "CSE", "ECE", "EEE", "MECH", "CIVIL", "IT", "OTHER"];

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white p-8 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{batchName} Records</h2>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Detailed Placement History</p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:flex-initial">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl w-full text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            />
          </div>

          {/* Branch Filter */}
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none cursor-pointer"
          >
            {branches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Placed">Placed</option>
            <option value="Not Placed">Not Placed</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-4">
          <thead>
            <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <th className="px-6 pb-2">Student</th>
              <th className="px-6 pb-2">Branch</th>
              <th className="px-6 pb-2">Company</th>
              <th className="px-6 pb-2">Package (LPA)</th>
              <th className="px-6 pb-2">CGPA</th>
              <th className="px-6 pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {paginatedData.map((student, idx) => (
                <motion.tr
                  key={student.studentId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-slate-50/50 hover:bg-white transition-colors group cursor-default"
                >
                  <td className="px-6 py-4 rounded-l-3xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-indigo-500 shadow-sm group-hover:scale-110 transition-transform">
                        <GraduationCap size={20} />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-sm">{student.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">{student.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-600 text-sm">
                    {student.branch}
                  </td>
                  <td className="px-6 py-4">
                    {student.company ? (
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">{student.company}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{student.role}</span>
                      </div>
                    ) : (
                      <span className="text-slate-300 italic text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-black">
                    {student.package > 0 ? (
                      <div className="flex items-center gap-2 text-emerald-600">
                        <TrendingUp size={14} />
                        <span>{student.package} LPA</span>
                      </div>
                    ) : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 bg-slate-200 rounded-full max-w-[80px] overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${student.cgpa >= 8 ? 'bg-indigo-500' : student.cgpa >= 7 ? 'bg-blue-500' : 'bg-slate-400'}`}
                          style={{ width: `${(student.cgpa / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-black text-slate-800">{student.cgpa}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 rounded-r-3xl">
                    <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                      student.placementStatus === "Placed" 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-rose-50 text-rose-600'
                    }`}>
                      {student.placementStatus}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-10 flex items-center justify-between">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} records
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-3 bg-white border border-slate-100 rounded-2xl disabled:opacity-30 hover:bg-slate-50 text-slate-600 transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-3 bg-white border border-slate-100 rounded-2xl disabled:opacity-30 hover:bg-slate-50 text-slate-600 transition-all shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
