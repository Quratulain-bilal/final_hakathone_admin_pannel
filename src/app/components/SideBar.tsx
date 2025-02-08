"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FaBox,
  FaChartBar,
  FaUser,
  FaTimes,
  FaBars,
  FaSignOutAlt,
  FaShoppingCart,
  FaTachometerAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const SideBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  const navItems = [
    { href: "/admin", icon: <FaTachometerAlt />, text: "Dashboard" },
    { href: "/admin/product", icon: <FaBox />, text: "Products" },
    { href: "/admin/orders", icon: <FaShoppingCart />, text: "Orders" },
    { href: "/admin/reviews", icon: <FaChartBar />, text: "Reviews" },
  ];

  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: {
      x: "-100%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 },
  };

  if (!isMounted) return null;

  return (
    <div className="z-50">
      {/* Mobile Header */}
      {isMobile && !sidebarOpen && (
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white w-full fixed top-0 left-0 z-10 md:hidden shadow-lg dark:bg-gray-800 dark:from-gray-800 dark:to-gray-900"
        >
          <h1 className="text-xl font-bold tracking-tight">Anna Dashboard</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white text-2xl hover:scale-110 transition-transform"
            aria-label="Open Sidebar"
          >
            <FaBars />
          </button>
        </motion.div>
      )}

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isMobile ? (sidebarOpen ? "open" : "closed") : "open"}
        className="fixed top-0 left-0 w-64 bg-gradient-to-b from-yellow-500 to-yellow-600 text-white h-full z-20 shadow-2xl backdrop-blur-lg bg-opacity-90 dark:from-gray-800 dark:to-gray-900 dark:bg-opacity-90"
      >
        <div className="flex justify-between items-center p-4 border-b border-yellow-400 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {/* Logo Placeholder */}
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-yellow-500 font-bold text-lg dark:text-gray-900">
                A
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tighter">
              Anna Dashboard
            </h1>
          </div>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white text-2xl md:hidden hover:rotate-90 transition-transform"
              aria-label="Close Sidebar"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <nav className="flex flex-col p-4 gap-2">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              variants={itemVariants}
              transition={{ delay: index * 0.1 }}
              className="hover-effect"
            >
              <Link
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 group
                  ${
                    pathname === item.href
                      ? "bg-black bg-opacity-20 shadow-lg dark:bg-gray-700"
                      : "hover:bg-black hover:bg-opacity-10 hover:translate-x-2 dark:hover:bg-gray-700"
                  }`}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                <span
                  className={`text-xl ${
                    pathname === item.href ? "text-white" : "text-gray-200"
                  } group-hover:text-white group-hover:scale-110 transition-transform`}
                >
                  {item.icon}
                </span>
                <span className="font-medium">{item.text}</span>
              </Link>
            </motion.div>
          ))}

          {/* Dark Mode Toggle */}
          <motion.div
            variants={itemVariants}
            transition={{ delay: navItems.length * 0.1 }}
            className="mt-4"
          >
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-200 hover:bg-black hover:bg-opacity-10 hover:text-white transition-all duration-300 group dark:hover:bg-gray-700"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <FaSun className="group-hover:rotate-180 transition-transform duration-500" />
              ) : (
                <FaMoon className="group-hover:rotate-180 transition-transform duration-500" />
              )}
              <span className="font-medium">
                {darkMode ? "Light Mode" : "Dark Mode"}
              </span>
            </button>
          </motion.div>

          {/* Logout Button */}
          <motion.div
            variants={itemVariants}
            transition={{ delay: (navItems.length + 1) * 0.1 }}
            className="mt-4"
          >
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-white hover:bg-red-800 hover:text-white transition-all duration-300 group"
              aria-label="Logout"
            >
              <FaSignOutAlt className="group-hover:rotate-180 transition-transform duration-500" />
              <span className="font-medium">Logout</span>
            </button>
          </motion.div>
        </nav>
      </motion.aside>

      {/* Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black md:hidden z-10"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SideBar;
