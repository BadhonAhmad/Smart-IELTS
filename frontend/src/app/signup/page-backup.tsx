"use client";

import { motion } from "framer-motion";
import {
    AlertCircle,
    ArrowRight,
    Award,
    BookOpen,
    Brain,
    Calculator,
    Eye,
    EyeOff,
    Globe,
    Globe2,
    Lock,
    Mail,
    Shield,
    Sparkles,
    User,
    Users,
    Zap
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_ENDPOINTS } from "@/utils/api";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  // Password validation functions
  const validatePassword = (password: string) => {
    const errors: string[] = [];
    if (password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push("Password must contain at least one special character (!@#$%^&*)");
    }
    return errors;
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long";
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      errors.password = passwordErrors[0]; // Show first error
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }

    return errors;
  };

  const tests = [
    { name: "IELTS", icon: Globe, color: "from-blue-500 to-cyan-500", status: "live" },
    { name: "GRE", icon: Brain, color: "from-purple-500 to-pink-500", status: "coming-soon" },
    { name: "GMAT", icon: Calculator, color: "from-green-500 to-emerald-500", status: "coming-soon" },
    { name: "SAT", icon: BookOpen, color: "from-orange-500 to-red-500", status: "coming-soon" },
    { name: "TOEFL", icon: Globe2, color: "from-indigo-500 to-blue-500", status: "coming-soon" },
  ];

  const features = [
    { icon: Brain, text: "AI-Powered Learning" },
    { icon: Users, text: "50K+ Students" },
    { icon: Award, text: "95% Success Rate" },
    { icon: Zap, text: "24/7 AI Support" }
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setValidationErrors({});

    // Comprehensive form validation
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError("Please fix the errors below");
      setIsLoading(false);
      return;
    }

    try {
    const response = await fetch(API_ENDPOINTS.AUTH.SIGNUP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      }),
    });      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        // Redirect based on role
        if (data.data.user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        // Handle validation errors from backend
        if (data.errors && Array.isArray(data.errors)) {
          const backendErrors: {[key: string]: string} = {};
          data.errors.forEach((err: any) => {
            if (err.path) {
              backendErrors[err.path] = err.msg;
            }
          });
          setValidationErrors(backendErrors);
        }
        setError(data.message || "Signup failed. Please check your information.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between max-w-7xl mx-auto"
        >
          <Link href="/landing" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center"
            >
              <Brain className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Smart IELTS
            </span>
          </Link>
          
          <Link
            href="/landing"
            className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </nav>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-green-400 mr-2" />
              <span className="text-sm font-medium">Join Smart IELTS</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-green-100 to-blue-100 bg-clip-text text-transparent">
              Create Account
            </h1>
            
            <p className="text-lg text-gray-300">
              Start your AI-powered test preparation journey today
            </p>
          </motion.div>

          {/* Signup Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center space-x-2"
              >
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSignUp} className="space-y-6">
              {/* Full Name Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 bg-gray-800/50 border rounded-xl focus:outline-none focus:ring-2 text-white placeholder-gray-400 transition-all duration-300 ${
                      validationErrors.name 
                        ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                        : 'border-gray-600/50 focus:ring-blue-500/50 focus:border-blue-500/50'
                    }`}
                    placeholder="Enter your full name"
                    required
                    disabled={isLoading}
                  />
                </div>
                {validationErrors.name && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 text-sm text-red-400 flex items-center space-x-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{validationErrors.name}</span>
                  </motion.p>
                )}
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 bg-gray-800/50 border rounded-xl focus:outline-none focus:ring-2 text-white placeholder-gray-400 transition-all duration-300 ${
                      validationErrors.email 
                        ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                        : 'border-gray-600/50 focus:ring-blue-500/50 focus:border-blue-500/50'
                    }`}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
                {validationErrors.email && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 text-sm text-red-400 flex items-center space-x-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{validationErrors.email}</span>
                  </motion.p>
                )}
              </motion.div>

              {/* Account Type Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Account Type
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Shield className="w-5 h-5 text-gray-400" />
                  </div>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white transition-all duration-300 appearance-none cursor-pointer"
                    required
                    disabled={isLoading}
                  >
                    <option value="student">IELTS Student</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <ArrowRight className="w-4 h-4 text-gray-400 rotate-90" />
                  </div>
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-4 bg-gray-800/50 border rounded-xl focus:outline-none focus:ring-2 text-white placeholder-gray-400 transition-all duration-300 ${
                      validationErrors.password 
                        ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                        : 'border-gray-600/50 focus:ring-blue-500/50 focus:border-blue-500/50'
                    }`}
                    placeholder="Create a strong password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Requirements */}
                <div className="mt-2 text-xs text-gray-400 space-y-1">
                  <p className="font-semibold">Password must contain:</p>
                  <div className="grid grid-cols-1 gap-1">
                    <span className={`flex items-center space-x-1 ${
                      formData.password.length >= 6 ? 'text-green-400' : 'text-gray-400'
                    }`}>
                      <span className="w-1 h-1 rounded-full bg-current"></span>
                      <span>At least 6 characters</span>
                    </span>
                    <span className={`flex items-center space-x-1 ${
                      /[A-Z]/.test(formData.password) ? 'text-green-400' : 'text-gray-400'
                    }`}>
                      <span className="w-1 h-1 rounded-full bg-current"></span>
                      <span>One uppercase letter</span>
                    </span>
                    <span className={`flex items-center space-x-1 ${
                      /[a-z]/.test(formData.password) ? 'text-green-400' : 'text-gray-400'
                    }`}>
                      <span className="w-1 h-1 rounded-full bg-current"></span>
                      <span>One lowercase letter</span>
                    </span>
                    <span className={`flex items-center space-x-1 ${
                      /\d/.test(formData.password) ? 'text-green-400' : 'text-gray-400'
                    }`}>
                      <span className="w-1 h-1 rounded-full bg-current"></span>
                      <span>One number</span>
                    </span>
                    <span className={`flex items-center space-x-1 ${
                      /[!@#$%^&*]/.test(formData.password) ? 'text-green-400' : 'text-gray-400'
                    }`}>
                      <span className="w-1 h-1 rounded-full bg-current"></span>
                      <span>One special character (!@#$%^&*)</span>
                    </span>
                  </div>
                </div>
                
                {validationErrors.password && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 text-sm text-red-400 flex items-center space-x-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{validationErrors.password}</span>
                  </motion.p>
                )}
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-4 bg-gray-800/50 border rounded-xl focus:outline-none focus:ring-2 text-white placeholder-gray-400 transition-all duration-300 ${
                      validationErrors.confirmPassword 
                        ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' 
                        : 'border-gray-600/50 focus:ring-blue-500/50 focus:border-blue-500/50'
                    }`}
                    placeholder="Confirm your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 text-sm text-red-400 flex items-center space-x-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{validationErrors.confirmPassword}</span>
                  </motion.p>
                )}
              </motion.div>

              {/* Sign Up Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="my-8 flex items-center"
            >
              <div className="flex-1 border-t border-gray-600/50" />
              <span className="px-4 text-gray-400 text-sm">or</span>
              <div className="flex-1 border-t border-gray-600/50" />
            </motion.div>

            {/* Sign In Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="text-center"
            >
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-green-400 hover:text-green-300 font-semibold transition-colors duration-300 hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </motion.div>
          </motion.div>

          {/* Features Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-12"
          >
            <p className="text-gray-400 text-sm mb-6 text-center">What you'll get:</p>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.3 + index * 0.1 }}
                    className="flex items-center space-x-3 bg-gray-800/30 rounded-xl p-4 border border-gray-700/50"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-300">{feature.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Test Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-400 text-sm mb-6">Prepare for these tests:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {tests.map((test, index) => {
                const Icon = test.icon;
                return (
                  <motion.div
                    key={test.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.5 + index * 0.1 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${
                      test.status === 'live' 
                        ? 'border-green-500/50 bg-green-500/10' 
                        : 'border-gray-600/50 bg-gray-800/30'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{test.name}</span>
                    {test.status === 'live' && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
