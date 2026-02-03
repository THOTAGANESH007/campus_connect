import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Save, ArrowLeft, Plus, Trash2, Building, Calendar, FileText, CheckSquare, Layers, Sparkles, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const DriveForm = ({ initialData, onSubmit, title, loading }) => {
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isValid },
        setValue,
    } = useForm({
        mode: "onChange",
        defaultValues: initialData || {
            companyName: "",
            companyDescription: "",
            jobRole: "",
            jobDescription: "",
            ctc: "",
            jobType: "Full-time",
            driveTitle: "",
            startDate: "",
            endDate: "",
            registrationDeadline: "",
            numberOfRounds: 1,
            rounds: [{ name: "", description: "" }],
            eligibleBranches: [],
            minCgpa: 0,
            passingYear: new Date().getFullYear().toString(),
            backlogsAllowed: false,
            registrationLink: "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "rounds",
    });

    const startDate = watch("startDate");
    const BRANCH_OPTIONS = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT", "AI&DS"];

    const handleBranchToggle = (branch, currentBranches) => {
        if (currentBranches.includes(branch)) {
            setValue(
                "eligibleBranches",
                currentBranches.filter((b) => b !== branch)
            );
        } else {
            setValue("eligibleBranches", [...currentBranches, branch]);
        }
    };

    // Input styles
    const labelStyle = "block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1";
    const inputStyle = "w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-900 placeholder:text-slate-400";
    const errorStyle = "text-red-500 text-xs mt-2 ml-1 font-bold flex items-center before:content-['•'] before:mr-1 before:text-lg";

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Background Decoration */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
                >
                    <div>
                        <Link
                            to="/drives"
                            className="inline-flex items-center text-slate-500 hover:text-indigo-600 transition-colors mb-3 text-sm font-bold bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm"
                        >
                            <ArrowLeft size={14} className="mr-2" />
                            Back to Dashboard
                        </Link>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            {title} <Sparkles size={28} className="text-yellow-400 fill-yellow-400" />
                        </h1>
                    </div>
                    <button
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        disabled={loading}
                        className={`group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl transition-all font-bold text-lg shadow-xl shadow-slate-900/20 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 hover:bg-indigo-600'}`}
                    >
                        <Save size={20} className="group-hover:animate-pulse" />
                        {loading ? "Publishing..." : "Publish Drive"}
                    </button>
                </motion.div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

                    {/* Section 1: Company & Role */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-slate-100"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                <Building size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Company & Role</h3>
                                <p className="text-slate-500 text-sm font-medium">Define the organization and job details.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className={labelStyle}>Company Name</label>
                                <input
                                    {...register("companyName", { required: "Required" })}
                                    className={inputStyle}
                                    placeholder="e.g. Acme Corp"
                                />
                                {errors.companyName && <p className={errorStyle}>{errors.companyName.message}</p>}
                            </div>

                            <div>
                                <label className={labelStyle}>Job Role</label>
                                <input
                                    {...register("jobRole", { required: "Required" })}
                                    className={inputStyle}
                                    placeholder="e.g. Senior Frontend Engineer"
                                />
                                {errors.jobRole && <p className={errorStyle}>{errors.jobRole.message}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelStyle}>About Company</label>
                                <textarea
                                    {...register("companyDescription", { required: "Required" })}
                                    rows="3"
                                    className={inputStyle}
                                    placeholder="Brief description of the organization..."
                                />
                                {errors.companyDescription && <p className={errorStyle}>{errors.companyDescription.message}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelStyle}>Job Description</label>
                                <textarea
                                    {...register("jobDescription", { required: "Required" })}
                                    rows="5"
                                    className={inputStyle}
                                    placeholder="Key responsibilities, skills, and day-to-day tasks..."
                                />
                                {errors.jobDescription && <p className={errorStyle}>{errors.jobDescription.message}</p>}
                            </div>

                            <div>
                                <label className={labelStyle}>Annual Package (CTC)</label>
                                <input
                                    {...register("ctc", { required: "Required" })}
                                    className={inputStyle}
                                    placeholder="e.g. 18 LPA"
                                />
                                {errors.ctc && <p className={errorStyle}>{errors.ctc.message}</p>}
                            </div>

                            <div>
                                <label className={labelStyle}>Job Type</label>
                                <div className="relative">
                                    <select
                                        {...register("jobType", { required: true })}
                                        className={`${inputStyle} appearance-none cursor-pointer`}
                                    >
                                        <option value="Full-time">Full-time Employment</option>
                                        <option value="Internship">Internship Program</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Section 2: Timeline */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-slate-100"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                                <Calendar size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Timeline & Schedule</h3>
                                <p className="text-slate-500 text-sm font-medium">Set important dates for the recruitment process.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2">
                                <label className={labelStyle}>Drive Title (Internal/Display)</label>
                                <input
                                    {...register("driveTitle", { required: "Required" })}
                                    className={inputStyle}
                                    placeholder="e.g. Google Campus Hiring 2026 - Phase 1"
                                />
                                {errors.driveTitle && <p className={errorStyle}>{errors.driveTitle.message}</p>}
                            </div>

                            <div>
                                <label className={labelStyle}>Drive Start Date</label>
                                <input
                                    type="date"
                                    {...register("startDate", { required: "Required" })}
                                    className={inputStyle}
                                />
                                {errors.startDate && <p className={errorStyle}>{errors.startDate.message}</p>}
                            </div>

                            <div>
                                <label className={labelStyle}>Drive End Date</label>
                                <input
                                    type="date"
                                    {...register("endDate", {
                                        required: "Required",
                                        validate: (val) => !startDate || val >= startDate || "Must be after Start Date",
                                    })}
                                    className={inputStyle}
                                />
                                {errors.endDate && <p className={errorStyle}>{errors.endDate.message}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelStyle}>Application Deadline</label>
                                <input
                                    type="date"
                                    {...register("registrationDeadline", {
                                        required: "Required",
                                        validate: (val) => !startDate || val <= startDate || "Must be before Start Date",
                                    })}
                                    className={inputStyle}
                                />
                                {errors.registrationDeadline && <p className={errorStyle}>{errors.registrationDeadline.message}</p>}
                            </div>
                        </div>
                    </motion.section>

                    {/* Section 3: Eligibility */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-slate-100"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                                <CheckSquare size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Eligibility Criteria</h3>
                                <p className="text-slate-500 text-sm font-medium">Define who can apply for this role.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className={labelStyle}>Min CGPA Cut-off</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    max="10"
                                    min="0"
                                    {...register("minCgpa", {
                                        required: "Required",
                                        min: { value: 0, message: "Min 0" },
                                        max: { value: 10, message: "Max 10" },
                                    })}
                                    className={inputStyle}
                                    placeholder="0.0 - 10.0"
                                />
                                {errors.minCgpa && <p className={errorStyle}>{errors.minCgpa.message}</p>}
                            </div>

                            <div>
                                <label className={labelStyle}>Passing Batch Year</label>
                                <input
                                    type="number"
                                    {...register("passingYear", { required: "Required" })}
                                    className={inputStyle}
                                    placeholder="Year (e.g. 2026)"
                                />
                                {errors.passingYear && <p className={errorStyle}>{errors.passingYear.message}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelStyle}>Allowed Branches</label>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <Controller
                                        name="eligibleBranches"
                                        control={control}
                                        rules={{ required: "Select at least one branch" }}
                                        render={({ field: { value } }) => (
                                            <div className="flex flex-wrap gap-3">
                                                {BRANCH_OPTIONS.map((branch) => (
                                                    <button
                                                        type="button"
                                                        key={branch}
                                                        onClick={() => handleBranchToggle(branch, value)}
                                                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${value.includes(branch)
                                                            ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20 transform scale-105"
                                                            : "bg-white border-transparent text-slate-500 hover:border-slate-200 hover:text-slate-900"
                                                            }`}
                                                    >
                                                        {branch}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    />
                                </div>
                                {errors.eligibleBranches && <p className={errorStyle}>{errors.eligibleBranches.message}</p>}
                            </div>

                            <div className="flex items-center gap-4 mt-2 p-4 bg-emerald-50 rounded-xl border border-emerald-100 w-fit">
                                <input
                                    type="checkbox"
                                    id="backlogsAllowed"
                                    {...register("backlogsAllowed")}
                                    className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-600 cursor-pointer"
                                />
                                <label htmlFor="backlogsAllowed" className="text-sm font-bold text-emerald-800 cursor-pointer select-none">
                                    Allow Students with Active Backlogs
                                </label>
                            </div>
                        </div>
                    </motion.section>

                    {/* Section 4: Rounds */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-slate-100"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
                                    <Layers size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Selection Process</h3>
                                    <p className="text-slate-500 text-sm font-medium">Add rounds for the interview.</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => append({ name: "", description: "" })}
                                className="flex items-center gap-2 text-sm bg-teal-600 text-white px-5 py-2.5 rounded-xl hover:bg-teal-700 transition font-bold shadow-lg shadow-teal-200"
                            >
                                <Plus size={18} /> Add Round
                            </button>
                        </div>

                        <div className="space-y-6">
                            {fields.map((field, index) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={field.id}
                                    className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative group hover:border-indigo-200 transition-colors"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                                        <div className="hidden md:flex md:col-span-1 items-center justify-center pt-3">
                                            <span className="w-8 h-8 rounded-full bg-slate-200/50 text-slate-400 font-bold flex items-center justify-center text-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <div className="md:col-span-4">
                                            <label className={labelStyle}>Round Name</label>
                                            <input
                                                {...register(`rounds.${index}.name`, { required: "Required" })}
                                                placeholder="e.g. Technical Interview"
                                                className={inputStyle}
                                            />
                                            {errors.rounds?.[index]?.name && (
                                                <p className={errorStyle}>{errors.rounds[index].name.message}</p>
                                            )}
                                        </div>
                                        <div className="md:col-span-6">
                                            <label className={labelStyle}>Description</label>
                                            <input
                                                {...register(`rounds.${index}.description`, { required: "Required" })}
                                                placeholder="Format, duration, etc."
                                                className={inputStyle}
                                            />
                                            {errors.rounds?.[index]?.description && (
                                                <p className={errorStyle}>{errors.rounds[index].description.message}</p>
                                            )}
                                        </div>
                                        <div className="md:col-span-1 flex items-center justify-end pt-8">
                                            {fields.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500 rounded-xl transition-all"
                                                    title="Remove Round"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            <input type="hidden" {...register("numberOfRounds")} value={fields.length} />
                        </div>
                    </motion.section>

                    {/* Section 5: External Link */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-slate-100"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center">
                                <FileText size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Application Portal</h3>
                                <p className="text-slate-500 text-sm font-medium">Where should students apply?</p>
                            </div>
                        </div>
                        <div>
                            <label className={labelStyle}>Registration Link</label>
                            <div className="relative">
                                <input
                                    {...register("registrationLink", { required: "Link is required" })}
                                    className={`${inputStyle} pl-12 text-blue-600 underline`}
                                    placeholder="https://career.company.com/job/123"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <ExternalLink size={18} />
                                </div>
                            </div>
                            {errors.registrationLink && <p className={errorStyle}>{errors.registrationLink.message}</p>}
                        </div>
                    </motion.section>

                </form>
            </div>
        </div>
    );
};

export default DriveForm;
