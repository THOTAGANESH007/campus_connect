import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Quote, Building, Award, Target, Sparkles, TrendingUp } from "lucide-react";

// Dummy Success Stories Data
const SUCCESS_STORIES = [
  {
    id: 1,
    name: "Alex Johnson",
    company: "Google",
    role: "Software Engineer",
    ctc: "45 LPA",
    quote:
      "CampusConnect's interview Q&A section was the game-changer for my Google interviews. The real-world questions shared by peers prepared me perfectly.",
    tags: ["DSA", "System Design", "Cloud"],
    colors: "from-blue-500 to-cyan-500",
    avatarBg: "bg-blue-500/20 text-blue-400",
  },
  {
    id: 2,
    name: "Sarah Chen",
    company: "Microsoft",
    role: "Product Manager",
    ctc: "38 LPA",
    quote:
      "The seamless drive tracking and application management let me focus entirely on my preparation instead of worrying about endless deadlines.",
    tags: ["Product", "Leadership", "Agile"],
    colors: "from-emerald-500 to-teal-500",
    avatarBg: "bg-emerald-500/20 text-emerald-400",
  },
  {
    id: 3,
    name: "Vikram Singh",
    company: "Amazon",
    role: "SDE II",
    ctc: "52 LPA",
    quote:
      "Thanks to the shared placement materials and high-quality coding resources on this platform, I was able to clear the rigorous OA round with a top score.",
    tags: ["Algorithms", "AWS", "Backend"],
    colors: "from-orange-500 to-yellow-500",
    avatarBg: "bg-orange-500/20 text-orange-400",
  },
  {
    id: 4,
    name: "Emily Davis",
    company: "NVIDIA",
    role: "Hardware Engineer",
    ctc: "35 LPA",
    quote:
      "The skill benchmarking feature helped me identify my weak spots in core concepts and improve them right before my final technical rounds.",
    tags: ["Verilog", "Core CS", "Architecture"],
    colors: "from-green-500 to-lime-500",
    avatarBg: "bg-green-500/20 text-green-400",
  },
  {
    id: 5,
    name: "Mohammad Ali",
    company: "Atlassian",
    role: "Frontend Engineer",
    ctc: "65 LPA",
    quote:
      "Connecting with alumni through CampusConnect gave me the exact insights I needed to crack the heavily UI-focused machine coding round.",
    tags: ["React", "JavaScript", "UI/UX"],
    colors: "from-indigo-500 to-blue-600",
    avatarBg: "bg-indigo-500/20 text-indigo-400",
  },
  {
    id: 6,
    name: "Priya Patel",
    company: "Goldman Sachs",
    role: "Quantitative Analyst",
    ctc: "40 LPA",
    quote:
      "The success stories of my seniors inspired me when I was doubtful. Now, I hope my story motivates the upcoming batches to dream extremely big.",
    tags: ["Math", "Finance", "C++"],
    colors: "from-slate-600 to-slate-400",
    avatarBg: "bg-slate-500/20 text-slate-400",
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

const SuccessStories = () => {
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
            back  Home
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
              <Sparkles size={14} className="text-indigo-400" />
              Hall of Fame
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6">
              Voices of <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400">
                Triumph.
              </span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Discover how CampusConnect empowered students to secure their dream roles.
              Let their journeys inspire and guide you to your own success.
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
          {SUCCESS_STORIES.map((story) => (
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
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white leading-tight mb-1">
                      {story.name}
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
                    <span className="font-bold text-sm tracking-wide">{story.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-black text-xs tracking-wider">
                      {story.ctc}
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
            Ready to write your own Success Story?
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            Join the platform that is empowering thousands of students to learn, prepare, and thrive in their placement journey.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg hover:bg-slate-100 hover:scale-105 transition-all shadow-xl shadow-indigo-900/20"
          >
            Get Started Now <TrendingUp size={20} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessStories;
