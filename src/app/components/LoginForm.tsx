"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") {
      router.push("/admin");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const adminEmail = process.env.NEXT_PUBLIC_EMAIL_ADDRESS;
    const adminPassword = process.env.NEXT_PUBLIC_USER_PASSWORD;

    if (email === adminEmail && password === adminPassword) {
      setMessage("Login successful");
      localStorage.setItem("isLoggedIn", "true");
      router.push("/admin/dashboard");
    } else {
      if (email !== adminEmail) {
        setMessage("Invalid email address");
      } else if (password !== adminPassword) {
        setMessage("Invalid password");
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-200 flex justify-center items-center p-4">
      {/* Glassmorphism Form Container */}
      <motion.form
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleLogin}
        className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-lg relative overflow-hidden border border-white/20"
      >
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Admin Login
        </h2>

        {/* Animated Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              key="message"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-3 text-center rounded-lg ${
                message.includes("Invalid")
                  ? "bg-red-400/20 text-red-800"
                  : "bg-green-400/20 text-green-800"
              }`}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-4 pl-12 bg-white/50 rounded-lg border border-white/30 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </motion.div>
        </div>

        {/* Password Field */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <motion.div
            className="relative"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-4 pl-12 bg-white/50 rounded-lg border border-white/30 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </motion.div>
        </div>

        {/* Login Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all relative overflow-hidden"
        >
          {isLoading ? (
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-700"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />
          ) : null}
          <span className="relative z-10">
            {isLoading ? "Logging in..." : "Login"}
          </span>
        </motion.button>
      </motion.form>
    </div>
  );
};

export default LoginPage;
