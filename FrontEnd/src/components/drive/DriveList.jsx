import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDrives, deleteDrive } from "../../services/driveService";
import { Plus, Search, Filter, Edit2, Trash2, Calendar, Briefcase, MapPin, GraduationCap, ChevronRight, Sparkles } from "lucide-react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for merging tailwind classes
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const DriveList = () => {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [jobType, setJobType] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [driveToDelete, setDriveToDelete] = useState(null);

    const fetchDrives = async () => {
        setLoading(true);
        try {
            const data = await getDrives({ search, jobType, page });
            setDrives(data.drives);
            setTotalPages(data.totalPages);
            setPage(data.currentPage);
            setError(null);
        } catch (err) {
            console.error("Error fetching drives:", err);
            setError("Failed to load drives. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchDrives();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, jobType, page]);

    const handleDeleteClick = (drive) => {
        setDriveToDelete(drive);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!driveToDelete) return;

        try {
            setDrives(drives.filter((d) => d._id !== driveToDelete._id));
            await deleteDrive(driveToDelete._id);
            setDeleteModalOpen(false);
            setDriveToDelete(null);
        } catch (err) {
            console.error("Error deleting drive:", err);
            setError("Failed to delete drive.");
            fetchDrives();
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-500/20">
            {/* Abstract Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-200/20 blur-[100px]" />
                <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-200/20 blur-[120px]" />
                <div className="absolute -bottom-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-200/20 blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-[1400px] mx-auto p-6 lg:p-10">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
                >
                    <div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            Campus Drives
                            <Sparkles className="text-yellow-400 w-8 h-8 fill-yellow-400" />
                        </h1>
                        <p className="text-slate-500 font-medium text-lg mt-2 max-w-xl">
                            Discover premium opportunities tailored for your career growth.
                        </p>
                    </div>
                    <Link
                        to="/drives/create"
                        className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 overflow-hidden"
                    >
                        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                        <span className="relative flex items-center gap-2">
                            <Plus size={20} strokeWidth={3} />
                            Publish New Drive
                        </span>
                    </Link>
                </motion.div>

                {/* Filters Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-2 mb-10 flex flex-col md:flex-row gap-2 sticky top-4 z-50"
                >
                    <div className="flex-1 relative group">
                        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors duration-300" />
                        <input
                            type="text"
                            placeholder="Search by company, role, or technology..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-transparent border-none rounded-2xl focus:ring-0 text-slate-800 placeholder-slate-400 font-medium"
                        />
                    </div>
                    <div className="h-auto w-px bg-slate-200 my-2 hidden md:block"></div>
                    <div className="w-full md:w-72 relative">
                        <Filter className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <select
                            value={jobType}
                            onChange={(e) => setJobType(e.target.value)}
                            className="w-full pl-14 pr-10 py-4 bg-transparent border-none rounded-2xl focus:ring-0 text-slate-800 font-medium appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
                            style={{ backgroundImage: "none" }}
                        >
                            <option value="">All Job Types</option>
                            <option value="Full-time">Full-time Roles</option>
                            <option value="Internship">Internship Opportunities</option>
                        </select>
                        <ChevronRight className="absolute right-5 top-1/2 transform -translate-y-1/2 rotate-90 text-slate-400 w-4 h-4 pointer-events-none" />
                    </div>
                </motion.div>

                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-64 bg-white/50 rounded-3xl animate-pulse"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-500 font-medium">{error}</p>
                    </div>
                ) : drives.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                            <Search className="w-10 h-10 text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">No drives found</h3>
                        <p className="text-slate-500 mt-2 max-w-md">We couldn't find any opportunities matching your criteria. Try adjusting your filters.</p>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {drives.map((drive) => (
                            <motion.div
                                key={drive._id}
                                variants={itemVariants}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                className="group relative bg-white rounded-[2rem] p-1 shadow-[0_2px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.1)] transition-all duration-300 border border-slate-100"
                            >
                                <div className="absolute inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 top-0"></div>

                                <div className="bg-white rounded-[1.8rem] p-7 h-full flex flex-col relative overflow-hidden z-0">
                                    {/* Background Pattern */}
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
                                        <Briefcase size={120} />
                                    </div>

                                    <div className="flex justify-between items-start mb-6 z-10">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm ${drive.jobType === "Full-time" ? "bg-indigo-600 text-white" : "bg-teal-500 text-white"
                                            }`}>
                                            {drive.companyName.charAt(0)}
                                        </div>
                                        <span className={cn(
                                            "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider",
                                            drive.jobType === "Full-time" ? "bg-indigo-50 text-indigo-700" : "bg-teal-50 text-teal-700"
                                        )}>
                                            {drive.jobType}
                                        </span>
                                    </div>

                                    <div className="mb-6 z-10">
                                        <h3 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors mb-1">
                                            {drive.companyName}
                                        </h3>
                                        <p className="text-slate-500 font-medium text-lg">{drive.jobRole}</p>
                                    </div>

                                    <div className="space-y-3 mb-8 z-10">
                                        <div className="flex items-center gap-3 text-slate-600 font-medium">
                                            <MapPin size={18} className="text-slate-400" />
                                            <span>On-Campus Drive</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600 font-medium">
                                            <Briefcase size={18} className="text-slate-400" />
                                            <span className="text-slate-900 font-bold">{drive.ctc}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600 font-medium">
                                            <Calendar size={18} className="text-slate-400" />
                                            <span>Last Date: {new Date(drive.registrationDeadline).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto grid grid-cols-5 gap-3 pt-6 border-t border-slate-50 z-10">
                                        <Link
                                            to={`/drives/${drive._id}`}
                                            className="col-span-3 flex items-center justify-center gap-2 bg-slate-900 text-white rounded-xl py-3 font-bold text-sm hover:bg-slate-800 transition-colors"
                                        >
                                            View Details
                                            <ChevronRight size={16} />
                                        </Link>
                                        <Link
                                            to={`/drives/${drive._id}/edit`}
                                            className="col-span-1 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteClick(drive)}
                                            className="col-span-1 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center mt-12 gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-6 py-3 bg-white rounded-full font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 shadow-sm border border-slate-200 transition-all"
                        >
                            Prev
                        </button>
                        <div className="px-6 py-3 bg-white rounded-full font-bold text-slate-900 shadow-sm border border-slate-200">
                            Page {page} of {totalPages}
                        </div>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-6 py-3 bg-white rounded-full font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 shadow-sm border border-slate-200 transition-all"
                        >
                            Next
                        </button>
                    </div>
                )}

                <DeleteConfirmationModal
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    driveTitle={driveToDelete?.companyName}
                />
            </div>
        </div>
    );
};

export default DriveList;
