import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Users,
  Briefcase,
  Award,
  TrendingUp,
  Sparkles,
  Star,
  BookOpen,
  FileText,
} from "lucide-react";

// Carousel Images (Served from public folder)
const CAROUSEL_IMAGES = [
  {
    src: "/assets/images/student_collaboration.png",
    alt: "Student Collaboration",
    caption: "Collaborate on Future-Ready Skills",
    sub: "Join a community of innovators.",
  },
  {
    src: "/assets/images/campus_life.png",
    alt: "Modern Campus Life",
    caption: "Your Career Starts Here",
    sub: "Premium opportunities at your doorstep.",
  },
  {
    src: "/assets/images/success_students.png",
    alt: "Success Celebration",
    caption: "Achieve Your Dream Role",
    sub: "Over 500+ offers secured this year.",
  },
];

const LandingPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Global Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[128px]" />
      </div>

      {/* Navbar Placeholder */}
      <nav className="relative z-50 px-6 py-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-linear-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          CampusConnect
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
          <a href="#" className="hover:text-white transition-colors">
            Students
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Recruiters
          </a>
          <Link
            to="/interview-questions"
            className="hover:text-white transition-colors"
          >
            Interview Q&A
          </Link>
          <Link
            to="/placement-materials"
            className="hover:text-white transition-colors"
          >
            Study Materials
          </Link>
          <a href="#" className="hover:text-white transition-colors">
            Success Stories
          </a>
        </div>
        <div className="flex gap-4">
          <Link
            to="/signin"
            className="px-5 py-2.5 text-sm font-bold text-white bg-white/10 border border-white/5 rounded-full hover:bg-white/20 backdrop-blur-md transition-all"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2.5 text-sm font-bold text-slate-900 bg-white rounded-full hover:bg-indigo-50 transition-all shadow-lg shadow-indigo-500/20"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                Placement Season 2026 is Live
              </div>
              <h1 className="text-6xl md:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6">
                Launch Your <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400">
                  Dream Career.
                </span>
              </h1>
              <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                Connect with top-tier companies, showcase your skills, and
                secure your future. The ultimate placement portal for the modern
                campus.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/drives"
                className="group flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-1"
              >
                Explore Drives
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="flex items-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-bold text-lg transition-all border border-slate-700">
                <Link to="/placement_stats">View Statistics</Link>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-8 pt-8 border-t border-slate-800/50"
            >
              <div>
                <p className="text-3xl font-black text-white">500+</p>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">
                  Offers Rolled
                </p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">50+</p>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">
                  Top Recruiters
                </p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">₹45L</p>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">
                  Highest Package
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-150 w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-900/40 border border-slate-700/50 group"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={CAROUSEL_IMAGES[currentImageIndex].src}
                alt={CAROUSEL_IMAGES[currentImageIndex].alt}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 p-10 z-20 w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex gap-2 mb-4">
                    {CAROUSEL_IMAGES.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1 rounded-full transition-all duration-300 ${idx === currentImageIndex ? "w-8 bg-indigo-500" : "w-2 bg-white/30"}`}
                      />
                    ))}
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                    {CAROUSEL_IMAGES[currentImageIndex].caption}
                  </h2>
                  <p className="text-slate-300">
                    {CAROUSEL_IMAGES[currentImageIndex].sub}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Interactive Trigger */}
            <button
              onClick={nextImage}
              className="absolute right-6 bottom-6 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-indigo-600 transition-all z-30 group-hover:scale-110"
            >
              <ChevronRight size={24} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white mb-4">
            Why Choose CampusConnect?
          </h2>
          <p className="text-slate-400 text-lg">
            Detailed insights and streamlined processes for modern recruitment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-150 md:h-auto">
          {/* Card 1: Large */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-2 bg-linear-to-br from-slate-800 to-slate-900 rounded-4xl p-10 border border-slate-700/50 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/30 transition-colors"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Real-Time Application Tracking
              </h3>
              <p className="text-slate-400 text-lg max-w-md">
                Monitor your application status, interview rounds, and selection
                progress in real-time. Never miss an update.
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-slate-900 rounded-4xl p-10 border border-slate-800 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/40"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-teal-500/20 text-teal-400 rounded-xl flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Top Recruiters
              </h3>
              <p className="text-sm text-slate-400">
                Direct access to Fortune 500 companies hiring from campus.
              </p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-slate-900 rounded-4xl p-10 border border-slate-800 relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center mb-6">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Skill Benchmarking
              </h3>
              <p className="text-sm text-slate-400">
                Compare your profile with batch averages and requirements.
              </p>
            </div>
          </motion.div>

          {/* Card 5: Interview Questions */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-linear-to-br from-indigo-900/60 to-slate-900 rounded-4xl p-10 border border-indigo-500/20 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/30"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-6">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Interview Questions
              </h3>
              <p className="text-sm text-slate-400 mb-5">
                Real questions shared by students who cracked the interviews.
                Search by company, round, and difficulty.
              </p>
              <Link
                to="/interview-questions"
                className="inline-flex items-center gap-2 text-indigo-400 font-bold text-sm hover:text-indigo-300 transition-colors"
              >
                Explore Q&A <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

          {/* Card 6: Study Materials */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-linear-to-br from-purple-900/60 to-slate-900 rounded-4xl p-10 border border-purple-500/20 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/30"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-6">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Study Materials
              </h3>
              <p className="text-sm text-slate-400 mb-5">
                Curated PDFs, notes, and links covering DSA, aptitude, core
                subjects, and company-specific prep.
              </p>
              <Link
                to="/placement-materials"
                className="inline-flex items-center gap-2 text-purple-400 font-bold text-sm hover:text-purple-300 transition-colors"
              >
                Browse Materials <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

          {/* Card 4: Large Horizontal */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-2 bg-linear-to-br from-indigo-900/50 to-slate-900 rounded-4xl p-10 border border-indigo-500/20 relative overflow-hidden flex items-center"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <Star className="text-yellow-400 fill-yellow-400" />
                <Star className="text-yellow-400 fill-yellow-400" />
                <Star className="text-yellow-400 fill-yellow-400" />
                <Star className="text-yellow-400 fill-yellow-400" />
                <Star className="text-yellow-400 fill-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                98% Placement Record
              </h3>
              <p className="text-slate-400">
                Consistent track record of placing students in their dream roles
                across diverse domains.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-20 text-center">
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
              Ready to Start Your Journey?
            </h2>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-10 py-5 bg-white text-indigo-600 rounded-full font-bold text-xl hover:bg-indigo-50 transition-colors shadow-2xl"
              >
                Create Student Profile
              </Link>
              <Link
                to="/drives"
                className="px-10 py-5 bg-indigo-800 text-white rounded-full font-bold text-xl hover:bg-indigo-900 transition-colors border border-indigo-700"
              >
                Browse Openings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
