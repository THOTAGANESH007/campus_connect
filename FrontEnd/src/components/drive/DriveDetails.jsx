import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getDriveById, deleteDrive } from "../../services/driveService";
import { ArrowLeft, Briefcase, Calendar, ExternalLink, Trash2, Edit2, Globe, Clock, Users, Award, MapPin, CheckCircle, GraduationCap, ChevronRight } from "lucide-react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { motion } from "framer-motion";

const DriveDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [drive, setDrive] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        const fetchDrive = async () => {
            try {
                const data = await getDriveById(id);
                setDrive(data);
            } catch (err) {
                console.error("Error fetching drive details:", err);
                setError("Failed to load drive details.");
            } finally {
                setLoading(false);
            }
        };

        fetchDrive();
    }, [id]);

    const handleDelete = async () => {
        try {
            await deleteDrive(id);
            navigate("/drives");
        } catch (err) {
            console.error("Error deleting drive:", err);
            // alert("Failed to delete drive");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-50">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-100"></div>
                    <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce delay-200"></div>
                </div>
            </div>
        );
    }

    if (error || !drive) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="p-10 text-center bg-white rounded-3xl shadow-xl shadow-red-500/5 max-w-md">
                    <Trash2 className="w-16 h-16 mx-auto mb-6 text-red-400 bg-red-50 p-4 rounded-2xl" />
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Drive Not Found</h3>
                    <p className="text-slate-500 font-medium mb-6">The drive you are looking for might have been deleted or removed.</p>
                    <Link to="/drives" className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">Go Back Home</Link>
                </div>
            </div>
        );
    }

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-500/20 pb-20">

            {/* Immersive Header */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative bg-slate-900 text-white min-h-[400px] overflow-hidden flex flex-col"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black opacity-90"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[128px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[128px] translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col justify-between py-10">
                    <div>
                        <Link
                            to="/drives"
                            className="inline-flex items-center text-white/60 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/5 font-medium text-sm"
                        >
                            <ArrowLeft size={16} className="mr-2" />
                            Back
                        </Link>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mt-10">
                        <motion.div variants={fadeInUp} initial="hidden" animate="show">
                            <div className="flex flex-wrap items-center gap-3 mb-5">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border ${drive.jobType === "Full-time" ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-200" : "bg-teal-500/20 border-teal-500/30 text-teal-200"
                                    }`}>
                                    {drive.jobType}
                                </span>
                                <div className="flex items-center text-slate-300 font-medium text-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                    <MapPin size={14} className="mr-2" />
                                    On-Campus
                                </div>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 text-white">
                                {drive.companyName}
                            </h1>
                            <div className="flex items-center text-xl md:text-2xl text-slate-300 font-medium">
                                <span className="text-white">{drive.jobRole}</span>
                                <span className="mx-3 text-slate-700">/</span>
                                <span className="text-slate-400">{drive.driveTitle}</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex gap-4"
                        >
                            <Link
                                to={`/drives/${id}/edit`}
                                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white rounded-2xl transition-all font-bold"
                            >
                                <Edit2 size={18} />
                                Edit
                            </Link>
                            <button
                                onClick={() => setDeleteModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 backdrop-blur-md border border-red-500/20 text-red-200 hover:text-red-100 rounded-2xl transition-all font-bold"
                            >
                                <Trash2 size={18} />
                                Delete
                            </button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar (CTA and Stats) */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="show"
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-4 order-2 lg:order-2 space-y-6"
                    >
                        {/* Primary CTA Card */}
                        <div className="bg-white rounded-[2rem] shadow-[0_20px_40px_rgb(0,0,0,0.08)] p-8 text-center border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-3">Annual Package</p>
                            <p className="text-5xl font-black text-slate-900 tracking-tight mb-8">{drive.ctc}</p>

                            <a
                                href={drive.registrationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex items-center justify-center w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-500/30"
                            >
                                <span className="absolute inset-0 w-full h-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                <span className="relative flex items-center">
                                    Apply Now <ExternalLink size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </a>
                            <p className="text-xs text-slate-400 mt-4 font-medium">Redirects to company portal</p>
                        </div>

                        {/* Timeline Card */}
                        <div className="bg-white rounded-[2rem] shadow-lg border border-slate-100 p-8">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center text-lg">
                                <Calendar className="mr-3 text-indigo-500" strokeWidth={2.5} />
                                Timeline
                            </h3>
                            <div className="relative pl-2 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                                <div className="relative pl-8">
                                    <div className="absolute left-[5px] top-1.5 w-3.5 h-3.5 rounded-full border-4 border-white bg-red-500 shadow-sm z-10"></div>
                                    <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Registration Closes</p>
                                    <p className="text-lg font-bold text-slate-900">{new Date(drive.registrationDeadline).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</p>
                                    <p className="text-sm text-slate-500">{new Date(drive.registrationDeadline).getFullYear()}</p>
                                </div>
                                <div className="relative pl-8">
                                    <div className="absolute left-[5px] top-1.5 w-3.5 h-3.5 rounded-full border-4 border-white bg-indigo-500 shadow-sm z-10"></div>
                                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">Drive Begins</p>
                                    <p className="text-lg font-bold text-slate-900">{new Date(drive.startDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</p>
                                    <p className="text-sm text-slate-500">{new Date(drive.startDate).getFullYear()}</p>
                                </div>
                                <div className="relative pl-8">
                                    <div className="absolute left-[5px] top-1.5 w-3.5 h-3.5 rounded-full border-4 border-white bg-slate-300 shadow-sm z-10"></div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Projected End</p>
                                    <p className="text-lg font-bold text-slate-900">{new Date(drive.endDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Card */}
                        <div className="bg-slate-900 rounded-[2rem] shadow-xl p-8 text-white relative overflow-hidden group">
                            {/* animated sheen */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/30 transition-colors"></div>

                            <h3 className="font-bold mb-6 flex items-center relative z-10 text-lg">
                                <Users className="mr-3 text-indigo-400" strokeWidth={2.5} /> Contact Point
                            </h3>
                            <div className="space-y-1 relative z-10">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Coordinator</p>
                                <p className="text-white font-bold text-xl">{drive.createdBy?.name || "Placement Cell"}</p>
                                <p className="text-indigo-300 font-medium text-sm pt-2 border-t border-white/10 mt-3 inline-block">
                                    {drive.createdBy?.email || "placement@college.edu"}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="show"
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-8 order-1 lg:order-1 space-y-8"
                    >
                        {/* Description Card */}
                        <section className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 md:p-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                    <Briefcase size={24} strokeWidth={2.5} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">Job Description</h2>
                            </div>
                            <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed">
                                {drive.jobDescription.split('\n').map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))}
                            </div>

                            <div className="mt-12 pt-10 border-t border-slate-100">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
                                        <Globe size={24} strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900">About {drive.companyName}</h3>
                                </div>
                                <p className="text-slate-600 text-lg leading-relaxed">{drive.companyDescription}</p>
                            </div>
                        </section>

                        {/* Requirements Grid */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex items-center gap-3 mb-6 text-purple-600">
                                        <GraduationCap size={28} />
                                        <h3 className="text-lg font-bold text-slate-900">Academic Criteria</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                                            <span>Cut-off CGPA</span>
                                            <span className="text-slate-900 font-bold text-lg">{drive.minCgpa}</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(drive.minCgpa / 10) * 100}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <p className="text-sm font-medium text-slate-500 mb-2">Eligible Passout Batch</p>
                                        <p className="text-2xl font-black text-slate-900">{drive.passingYear}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-6 text-orange-500">
                                    <Award size={28} />
                                    <h3 className="text-lg font-bold text-slate-900">Branch Eligibility</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {drive.eligibleBranches.map(branch => (
                                        <span key={branch} className="px-4 py-2 bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-100">
                                            {branch}
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                                    <p className="font-bold text-slate-700">Backlogs Allowed?</p>
                                    <div className={`px-4 py-1.5 rounded-full font-bold text-sm ${drive.backlogsAllowed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                        {drive.backlogsAllowed ? "YES" : "NO"}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Rounds Process */}
                        <section className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 md:p-10">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                        <CheckCircle size={24} strokeWidth={2.5} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900">Selection Process</h2>
                                </div>
                                <div className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-sm">
                                    {drive.rounds?.length || 0} Rounds
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-slate-100"></div>
                                <div className="space-y-12">
                                    {drive.rounds?.map((round, index) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            key={index}
                                            className="relative pl-16 group"
                                        >
                                            <div className="absolute left-0 top-0 w-12 h-12 rounded-full border-4 border-white bg-slate-200 text-slate-600 font-bold flex items-center justify-center z-10 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                                                {index + 1}
                                            </div>
                                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50/30 transition-colors">
                                                <h4 className="text-lg font-bold text-slate-900 mb-2">{round.name}</h4>
                                                <p className="text-slate-600 leading-relaxed">{round.description}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </motion.div>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                driveTitle={drive.companyName}
            />
        </div>
    );
};

export default DriveDetails;
