import React from "react";
import { Sparkles, CheckCircle2, TrendingUp, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export const InsightsPanel = ({ insights }) => {
  if (!insights || insights.length === 0) return null;

  const getIcon = (index) => {
    const icons = [<Sparkles />, <TrendingUp />, <CheckCircle2 />, <Cpu />];
    return icons[index % icons.length];
  };

  const getColors = (index) => {
    const colors = [
      "bg-emerald-50 text-emerald-600 border-emerald-100",
      "bg-blue-50 text-blue-600 border-blue-100",
      "bg-purple-50 text-purple-600 border-purple-100",
      "bg-indigo-50 text-indigo-600 border-indigo-100",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white p-8 shadow-sm">
      <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3 mb-8">
        <Sparkles size={24} className="text-indigo-500 animate-pulse" /> Placement Insights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-6 rounded-3xl border ${getColors(idx)} flex flex-col gap-4 group hover:scale-[1.02] transition-transform`}
          >
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform">
              {React.cloneElement(getIcon(idx), { size: 20 })}
            </div>
            <p className="font-bold text-sm leading-relaxed">{insight}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
