"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-7 h-7" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-1.5 rounded-md bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333] transition-colors border border-gray-200 dark:border-[#333]"
      aria-label="Toggle Dark Mode"
    >
      {theme === "dark" ? <FaSun size={14} /> : <FaMoon size={14} />}
    </button>
  );
}
