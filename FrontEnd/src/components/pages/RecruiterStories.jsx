import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Quote, Building, Target, Sparkles, TrendingUp } from "lucide-react";

// Dummy Recruiter Stories Data
const RECRUITER_STORIES = [
  {
    id: 1,
    name: "Talent Acquisition",
    company: "Covasant",
    role: "HR Partner",
    years: "2+ Years",
    quote:
      "The talent from CampusConnect has been exceptional. The students we hired immediately made a massive impact on our core systems.",
    tags: ["Software Engineering", "Full Stack", "Campus Hiring"],
    colors: "from-blue-500 to-cyan-500",
    avatarBg: "bg-blue-500/20 text-blue-400",
  },
  {
    id: 2,
    name: "HR Manager",
    company: "Achala",
    role: "Recruitment Lead",
    years: "1.5+ Years",
    quote:
      "New hires brought modern UI/UX principles to our legacy apps. The students from this campus are completely industry-ready out of the box.",
    tags: ["Frontend", "UI/UX", "React"],
    colors: "from-emerald-500 to-teal-500",
    avatarBg: "bg-emerald-500/20 text-emerald-400",
  },
  {
    id: 3,
    name: "Technical Recruiter",
    company: "Vassar Lab",
    role: "University Relations",
    years: "4+ Years",
    quote:
      "Consistently top-tier candidates. The students' problem-solving skills have been invaluable to our product engineering lifecycle.",
    tags: ["Product Analyst", "Data Driven", "Strategy"],
    colors: "from-orange-500 to-yellow-500",
    avatarBg: "bg-orange-500/20 text-orange-400",
  },
  {
    id: 4,
    name: "Campus Recruiting",
    company: "Yupp TV",
    role: "Talent Pipeline Manager",
    years: "3+ Years",
    quote:
      "We've built a strong pipeline with this college. The platform streamlines our hiring process and students always exceed our technical benchmarks.",
    tags: ["Streaming", "Backend", "Scale"],
    colors: "from-red-500 to-rose-500",
    avatarBg: "bg-red-500/20 text-red-400",
  },
  {
    id: 5,
    name: "Director of Recruitment",
    company: "Xoriant",
    role: "VP Talent",
    years: "3+ Years",
    quote:
      "We love hiring from this campus. Recent recruits have been leading our ML initiatives brilliantly and show great leadership qualities.",
    tags: ["Data Science", "Machine Learning", "Innovation"],
    colors: "from-indigo-500 to-purple-500",
    avatarBg: "bg-indigo-500/20 text-indigo-400",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const RecruiterStories = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-indigo-500/30 overflow-x-hidden pb-20">
      {/* Immersive Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Navigation & Header */}
        <div className="mb-16">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 text-slate-400 hover:text-white transition-all font-black text-xs uppercase tracking-widest mb-12 cursor-pointer bg-transparent border-none p-0"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
              <ArrowLeft size={16} />
            </div>
            Back to Home
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
              <Sparkles size={14} className="text-indigo-400" />
              Recruiter Endorsements
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6">
              Industry <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400">
                Partnerships.
              </span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Discover what top companies have to say about the stellar candidates from CampusConnect. Our relationships with industry leaders are built on trust and talent.
            </p>
          </motion.div>
        </div>

        {/* Stories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {RECRUITER_STORIES.map((story) => (
            <motion.div
              key={story.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-white/5 border border-white/10 rounded-4xl p-8 backdrop-blur-sm relative overflow-hidden group flex flex-col h-full"
            >
              {/* Card Hover Sheen */}
              <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Header Info */}
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg ${story.avatarBg}`}
                  >
                    {story.company.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white leading-tight mb-1">
                      {story.company}
                    </h3>
                    <p className="text-indigo-400 font-bold text-sm flex items-center gap-1.5">
                      <Target size={14} /> {story.role}
                    </p>
                  </div>
                </div>
                {/* Visual Company initial or gradient blob */}
                <div className={`w-10 h-10 rounded-full bg-linear-to-br opacity-50 blur-xl absolute top-6 right-6 ${story.colors}`} />
              </div>

              {/* Quote Section */}
              <div className="flex-1 relative z-10 mb-8">
                <Quote className="text-slate-700 w-10 h-10 mb-4 opacity-50" />
                <p className="text-slate-300 font-medium leading-relaxed italic text-[15px]">
                  "{story.quote}"
                </p>
              </div>

              {/* Bottom Metrics & Tags */}
              <div className="mt-auto relative z-10 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Building size={16} className="text-slate-500" />
                    <span className="font-bold text-sm tracking-wide">{story.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-xs tracking-wider">
                       <TrendingUp size={12} />
                      {story.years}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-slate-900/50 border border-white/5 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action element */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.2 }}
           className="mt-24 p-12 bg-linear-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 rounded-[3rem] text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
            Looking for top tier candidates?
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            Partner with us to streamline your hiring process and gain access to thousands of highly prepared, industry-ready students.
          </p>
          <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg hover:bg-slate-100 hover:scale-105 transition-all shadow-xl shadow-indigo-900/20">
            Contact Placement Cell
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default RecruiterStories;
