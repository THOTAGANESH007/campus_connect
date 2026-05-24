import React from "react";
import { motion } from "framer-motion";

export const StatCard = ({ label, value, icon: Icon, color, trend }) => {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white p-6 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className={`p-4 rounded-2xl ${colorMap[color] || colorMap.indigo} border`}>
          <Icon size={24} />
        </div>
        {trend && (
           <span className={`text-xs font-bold px-3 py-1 rounded-full ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
             {trend > 0 ? `+${trend}%` : `${trend}%`}
           </span>
        )}
      </div>
      <div className="mt-6">
        <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
          {label}
        </p>
      </div>
    </motion.div>
  );
};
