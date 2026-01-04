"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        background: theme === "dark" 
          ? "rgba(255, 255, 255, 0.1)" 
          : "rgba(0, 0, 0, 0.1)",
        border: theme === "dark"
          ? "1px solid rgba(255, 255, 255, 0.2)"
          : "1px solid rgba(0, 0, 0, 0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.3s ease",
        backdropFilter: "blur(10px)",
        zIndex: 1000,
      }}
      className="theme-toggle"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <FiSun size={20} color="white" />
      ) : (
        <FiMoon size={20} color="black" />
      )}
    </button>
  );
}
