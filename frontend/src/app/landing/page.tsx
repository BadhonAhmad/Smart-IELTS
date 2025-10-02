"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
    ArrowRight,
    Award,
    BookOpen,
    Brain,
    Calculator,
    Clock,
    Globe,
    Globe2,
    Headphones,
    PenTool,
    Play,
    Rocket,
    Shield,
    Sparkles,
    Star,
    TrendingUp,
    Users,
    Zap
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [currentTest, setCurrentTest] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const tests = [
    { name: "IELTS", icon: Globe, color: "from-blue-500 to-cyan-500", status: "live" },
    { name: "GRE", icon: Brain, color: "from-purple-500 to-pink-500", status: "coming-soon" },
    { name: "GMAT", icon: Calculator, color: "from-green-500 to-emerald-500", status: "coming-soon" },
    { name: "SAT", icon: BookOpen, color: "from-orange-500 to-red-500", status: "coming-soon" },
    { name: "TOEFL", icon: Globe2, color: "from-indigo-500 to-blue-500", status: "coming-soon" },
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Advanced AI tutors that adapt to your learning style and provide personalized feedback",
      color: "text-purple-400"
    },
    {
      icon: Headphones,
      title: "Voice Interaction",
      description: "Practice speaking with realistic AI examiners using cutting-edge voice technology",
      color: "text-blue-400"
    },
    {
      icon: PenTool,
      title: "Handwriting Analysis",
      description: "Upload handwritten answers and get instant AI evaluation with detailed feedback",
      color: "text-green-400"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Comprehensive analytics and performance insights to track your improvement",
      color: "text-orange-400"
    },
    {
      icon: Clock,
      title: "Real Exam Simulation",
      description: "Practice with authentic test formats, timing, and scoring systems",
      color: "text-red-400"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime for uninterrupted learning",
      color: "text-cyan-400"
    }
  ];

  const stats = [
    { number: "50K+", label: "Students Helped", icon: Users },
    { number: "95%", label: "Success Rate", icon: Award },
    { number: "4.9/5", label: "User Rating", icon: Star },
    { number: "24/7", label: "AI Support", icon: Zap }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      test: "IELTS",
      score: "8.5",
      text: "The AI feedback was incredibly detailed and helped me identify exactly where I needed improvement. I improved my band score by 1.5 points!",
      avatar: "SC"
    },
    {
      name: "Ahmed Hassan",
      test: "IELTS",
      score: "7.5",
      text: "The speaking practice with the AI examiner felt so realistic. It gave me the confidence I needed for the actual test.",
      avatar: "AH"
    },
    {
      name: "Maria Rodriguez",
      test: "IELTS",
      score: "8.0",
      text: "The handwriting analysis feature is amazing! I could practice writing by hand and get instant feedback on my grammar and vocabulary.",
      avatar: "MR"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTest((prev) => (prev + 1) % tests.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Smart IELTS</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-6"
            >
              <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-sm font-medium">AI-Powered Test Preparation</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Master Every
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Standardized Test
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Prepare for IELTS, GRE, GMAT, SAT, and TOEFL with our revolutionary AI-powered platform. 
              Get personalized feedback, practice with real exam conditions, and achieve your target scores.
            </p>
          </motion.div>

           {/* Test Showcase */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="mb-16"
           >
             {/* Live Test - IELTS */}
             <div className="mb-12">
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.6, delay: 0.3 }}
                 className="flex justify-center mb-8"
               >
                 <div className="relative group">
                   <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                     <div className="flex items-center space-x-3">
                       <Globe className="w-6 h-6 text-white" />
                       <span className="text-xl font-bold text-white">IELTS</span>
                       <div className="flex items-center space-x-2">
                         <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                         <span className="text-sm text-green-100 font-medium">Live Now</span>
                       </div>
                     </div>
                   </div>
                 </div>
               </motion.div>
             </div>

             {/* Coming Soon Tests */}
             <div className="mb-8">
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6, delay: 0.4 }}
                 className="text-center mb-8"
               >
                 <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 backdrop-blur-sm">
                   <motion.div
                     animate={{ rotate: 360 }}
                     transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                   >
                     <Rocket className="w-5 h-5 text-yellow-400 mr-3" />
                   </motion.div>
                   <span className="text-lg font-semibold text-yellow-300">Coming Soon</span>
                   <motion.div
                     animate={{ scale: [1, 1.2, 1] }}
                     transition={{ duration: 1.5, repeat: Infinity }}
                     className="ml-3 w-2 h-2 bg-yellow-400 rounded-full"
                   />
                 </div>
               </motion.div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                 {tests.slice(1).map((test, index) => {
                   const Icon = test.icon;
                   return (
                     <motion.div
                       key={test.name}
                       initial={{ opacity: 0, y: 30 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                       className="group relative"
                     >
                       <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600 transition-all duration-300 text-center group-hover:scale-105">
                         <div className={`w-16 h-16 bg-gradient-to-r ${test.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                           <Icon className="w-8 h-8 text-white" />
                         </div>
                         <h3 className="text-lg font-bold text-white mb-2">{test.name}</h3>
                         <div className="flex items-center justify-center text-yellow-400 text-sm">
                           <Clock className="w-4 h-4 mr-2" />
                           <span>Q1 2026</span>
                         </div>
                       </div>
                     </motion.div>
                   );
                 })}
               </div>
             </div>
           </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/signup"
              className="group bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all flex items-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="group flex items-center space-x-2 px-8 py-4 rounded-full border-2 border-gray-600 hover:border-white transition-all">
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Smart IELTS</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our AI-powered platform revolutionizes test preparation with cutting-edge technology 
              and personalized learning experiences.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 hover:border-gray-600 transition-all group"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

       {/* Test Expansion Section */}
       <section className="py-24 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 relative overflow-hidden">
         {/* Animated Background Elements */}
         <div className="absolute inset-0 overflow-hidden">
           <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-2xl animate-pulse-slow" />
           <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-2xl animate-pulse-medium" />
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-blue-400/5 to-cyan-400/5 rounded-full blur-3xl animate-pulse-fast" />
         </div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             className="text-center mb-20"
           >
             <motion.div
               initial={{ scale: 0.8, opacity: 0 }}
               whileInView={{ scale: 1, opacity: 1 }}
               transition={{ duration: 0.6, delay: 0.2 }}
               className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 mb-8 backdrop-blur-sm"
             >
               <motion.div
                 animate={{ rotate: 360 }}
                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
               >
                 <Rocket className="w-5 h-5 text-yellow-400 mr-3" />
               </motion.div>
               <span className="text-sm font-semibold text-yellow-300 tracking-wide">Expanding Globally</span>
               <motion.div
                 animate={{ scale: [1, 1.2, 1] }}
                 transition={{ duration: 1.5, repeat: Infinity }}
                 className="ml-3 w-2 h-2 bg-yellow-400 rounded-full"
               />
             </motion.div>
             
             <motion.h2
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.3 }}
               className="text-5xl md:text-6xl font-bold mb-8"
             >
               <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                 Coming Soon
               </span>
               <br />
               <span className="text-white">More Tests</span>
             </motion.h2>
             
             <motion.p
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.4 }}
               className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
             >
               We're expanding our AI-powered platform to cover all major standardized tests. 
               Get early access and be the first to experience our revolutionary preparation methods.
             </motion.p>
           </motion.div>

           {/* Coming Soon Cards Grid */}
           <div className="grid md:grid-cols-2 gap-8 mb-16">
             {tests.slice(1).map((test, index) => {
               const Icon = test.icon;
               return (
                 <motion.div
                   key={test.name}
                   initial={{ opacity: 0, y: 50 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.8, delay: index * 0.2 }}
                   className="group relative"
                 >
                   {/* Main Card */}
                   <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 h-full">
                     {/* Animated Background Glow */}
                     <div className={`absolute inset-0 bg-gradient-to-br ${test.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`} />
                     
                     {/* Coming Soon Badge */}
                     <div className="absolute -top-4 -right-4">
                       <motion.div
                         animate={{ 
                           scale: [1, 1.1, 1],
                           rotate: [0, 5, -5, 0]
                         }}
                         transition={{ 
                           duration: 2, 
                           repeat: Infinity,
                           ease: "easeInOut"
                         }}
                         className="relative"
                       >
                         <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-xl">
                           <Rocket className="w-6 h-6 text-white" />
                         </div>
                         <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
                       </motion.div>
                     </div>

                     {/* Card Content */}
                     <div className="relative z-10">
                       {/* Test Icon and Name */}
                       <div className="flex items-center mb-6">
                         <motion.div
                           className={`w-16 h-16 bg-gradient-to-r ${test.color} rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                           whileHover={{ rotate: 5 }}
                         >
                           <Icon className="w-8 h-8 text-white" />
                         </motion.div>
                         <div>
                           <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-orange-400 group-hover:bg-clip-text transition-all duration-300">
                             {test.name}
                           </h3>
                           <div className="flex items-center text-yellow-400">
                             <motion.div
                               animate={{ rotate: 360 }}
                               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                             >
                               <Clock className="w-4 h-4 mr-2" />
                             </motion.div>
                             <span className="text-sm font-semibold">Coming Q1 2026</span>
                           </div>
                         </div>
                       </div>

                       {/* Description */}
                       <div className="mb-8">
                         <p className="text-gray-300 text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
                           {test.name === 'GRE' && 'Graduate Record Examination preparation with advanced analytics, personalized study plans, and comprehensive practice tests designed for graduate school admissions.'}
                           {test.name === 'GMAT' && 'Graduate Management Admission Test with business-focused content, case study analysis, and quantitative reasoning tailored for business school applications.'}
                           {test.name === 'SAT' && 'Scholastic Assessment Test for college admissions readiness with comprehensive practice tests, detailed score analysis, and college preparation guidance.'}
                           {test.name === 'TOEFL' && 'Test of English as a Foreign Language with global focus, cultural context, and specialized preparation for international students and professionals.'}
                         </p>
                       </div>

                       {/* Features List */}
                       <div className="space-y-3 mb-8">
                         <div className="flex items-center text-gray-400 group-hover:text-gray-300 transition-colors">
                           <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-3" />
                           <span className="text-sm">AI-powered personalized learning</span>
                         </div>
                         <div className="flex items-center text-gray-400 group-hover:text-gray-300 transition-colors">
                           <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full mr-3" />
                           <span className="text-sm">Real-time performance tracking</span>
                         </div>
                         <div className="flex items-center text-gray-400 group-hover:text-gray-300 transition-colors">
                           <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-400 rounded-full mr-3" />
                           <span className="text-sm">Authentic practice tests</span>
                         </div>
                       </div>

                       {/* Progress Bar */}
                       <div className="mb-6">
                         <div className="flex justify-between items-center mb-2">
                           <span className="text-sm text-gray-400">Development Progress</span>
                           <span className="text-sm text-yellow-400 font-semibold">90%</span>
                         </div>
                         <div className="w-full bg-gray-700 rounded-full h-2">
                           <motion.div
                             className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full"
                             initial={{ width: 0 }}
                             whileInView={{ width: "90%" }}
                             transition={{ duration: 1.5, delay: 0.5 }}
                           />
                         </div>
                       </div>

                       {/* Early Access Button */}
                       <motion.button
                         whileHover={{ scale: 1.02 }}
                         whileTap={{ scale: 0.98 }}
                         className="w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 group-hover:shadow-lg group-hover:shadow-yellow-400/20"
                       >
                         <div className="flex items-center justify-center">
                           <span>Notify Me When Available</span>
                           <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                         </div>
                       </motion.button>
                     </div>

                     {/* Hover Effect Overlay */}
                     <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-yellow-400/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   </div>
                 </motion.div>
               );
             })}
           </div>

           {/* Bottom CTA Section */}
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.6 }}
             className="text-center"
           >
             <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-3xl p-12 border border-yellow-500/20 backdrop-blur-sm">
               <h3 className="text-3xl font-bold text-white mb-4">
                 Want to be the first to know?
               </h3>
               <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                 Get early access to our new test preparation modules and exclusive updates on our expansion.
               </p>
               
               <motion.button
                 whileHover={{ scale: 1.05, y: -2 }}
                 whileTap={{ scale: 0.95 }}
                 className="group relative bg-gradient-to-r from-yellow-500 to-orange-500 px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-yellow-500/30 transition-all flex items-center space-x-3 mx-auto overflow-hidden"
               >
                 <span className="relative z-10">Get Early Access</span>
                 <motion.div
                   className="relative z-10"
                   animate={{ x: [0, 5, 0] }}
                   transition={{ duration: 1.5, repeat: Infinity }}
                 >
                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </motion.div>
                 
                 <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
               </motion.button>
             </div>
           </motion.div>
         </div>
       </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Success <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Stories</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of students who have achieved their target scores with Smart IELTS
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 hover:border-gray-600 transition-all"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <div className="flex items-center text-sm text-gray-400">
                      <span>{testimonial.test}</span>
                      <span className="mx-2">•</span>
                      <span className="text-green-400 font-semibold">Band {testimonial.score}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed mb-4">"{testimonial.text}"</p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Achieve</span> Your Goals?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of successful students and start your journey to test success today. 
              Free trial available with no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/signup"
                className="group bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all flex items-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-4 rounded-full border-2 border-gray-600 hover:border-white transition-all"
              >
                View Demo
              </Link>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              No credit card required • 7-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Smart IELTS</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered test preparation for IELTS, GRE, GMAT, SAT, and TOEFL.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Tests</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">IELTS</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">GRE (Coming Soon)</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">GMAT (Coming Soon)</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">SAT (Coming Soon)</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">TOEFL (Coming Soon)</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">AI Tutoring</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Voice Practice</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Progress Tracking</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Handwriting Analysis</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Smart IELTS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
