import React, { useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, ArrowLeft, Download, Info, Rocket } from "lucide-react";
import { uploadBatchData } from "../../services/batchPlacementService";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { motion, AnimatePresence } from "framer-motion";

const UploadPlacementData = () => {
  const [batchName, setBatchName] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && 
       (selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
        selectedFile.type === "application/vnd.ms-excel")) {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please upload a valid Excel file (.xlsx or .xls)");
      setFile(null);
    }
  };

  const downloadTemplate = () => {
    const headers = ["studentId", "name", "branch", "company", "role", "package", "placementStatus", "cgpa"];
    const sampleData = [
      ["S101", "John Doe", "CSE", "Google", "SDE", 15.5, "Placed", 8.5],
      ["S102", "Jane Smith", "ECE", "", "", 0, "Not Placed", 7.8],
    ];
    
    const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PlacementTemplate");
    XLSX.writeFile(wb, "Placement_Data_Template.xlsx");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!batchName || !file) {
      setError("Provide both batch name and an excel file.");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append("batchName", batchName);
      formData.append("file", file);

      await uploadBatchData(formData);
      setSuccess(true);
      setTimeout(() => navigate("/placement_stats"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload data. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 selection:bg-indigo-100 font-sans">
      <div className="max-w-3xl w-full">
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-xs uppercase tracking-[0.2em] mb-8 transition-all group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </motion.button>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white overflow-hidden"
        >
          <div className="bg-slate-900 p-12 text-white relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="flex justify-between items-start relative z-10">
              <div>
                <h1 className="text-4xl font-black tracking-tight mb-3">Initialize Batch</h1>
                <p className="text-slate-400 font-medium text-lg">Ingest student records into the deep analytics engine.</p>
              </div>
              <button 
                onClick={downloadTemplate}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-white/5"
              >
                <Download size={16} /> Template
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-12 space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                Batch Identification
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  placeholder="e.g. CSE 2024 Final Year"
                  className="w-full px-8 py-5 bg-slate-50 border-none rounded-[1.5rem] text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all font-black text-lg"
                />
              </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Data Payload (.xlsx)
                    </label>
                    <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                        <Info size={12} /> Schema: 8 Columns Expected
                    </div>
                </div>
              <div 
                className={`relative group cursor-pointer border-[3px] border-dashed rounded-[3rem] transition-all p-16 text-center ${
                  file ? "border-emerald-400/50 bg-emerald-50/30" : "border-slate-100 hover:border-indigo-400/50 hover:bg-slate-50/50"
                }`}
              >
                <input 
                  type="file" 
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                <div className="flex flex-col items-center gap-6">
                  <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center transition-all duration-500 ${
                    file ? "bg-emerald-500 text-white rotate-6 shadow-xl shadow-emerald-500/20" : "bg-white text-slate-300 group-hover:bg-indigo-500 group-hover:text-white group-hover:rotate-12 group-hover:shadow-xl shadow-indigo-500/20"
                  }`}>
                    {file ? <FileSpreadsheet size={40} /> : <Upload size={40} />}
                  </div>
                  
                  <div>
                    <p className={`text-2xl font-black ${file ? "text-emerald-700" : "text-slate-800"}`}>
                      {file ? file.name : "Select Excel Manifest"}
                    </p>
                    <p className="text-sm text-slate-400 font-bold mt-2 uppercase tracking-widest">
                      {file ? "Payload Verified & Ready" : "Drag data file here or tap to select"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50">
                  <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <Rocket size={12} /> Required Data Schema
                  </h4>
                  <div className="flex flex-wrap gap-2">
                      {["studentId", "name", "branch", "company", "role", "package", "placementStatus", "cgpa"].map(h => (
                          <span key={h} className="bg-white px-3 py-1.5 rounded-xl text-[9px] font-black text-slate-500 border border-slate-100 shadow-sm">{h}</span>
                      ))}
                  </div>
              </div>
            </div>

            <AnimatePresence>
                {error && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-6 bg-rose-50 border border-rose-100 rounded-3xl flex items-center gap-4 text-rose-600 font-black text-sm"
                >
                    <AlertCircle size={24} /> {error}
                </motion.div>
                )}

                {success && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center gap-4 text-emerald-600 font-black text-sm"
                >
                    <CheckCircle2 size={24} /> Ingestion Successful! Realizing Analytics...
                </motion.div>
                )}
            </AnimatePresence>

            <motion.button 
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || success}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white py-6 rounded-[2rem] font-black text-xl tracking-tight transition-all shadow-2xl shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-4 group"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> Processing Payload...
                </>
              ) : (
                <>
                  Start Deep Processing <Rocket size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadPlacementData;
