"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useRef } from "react";

export function AnimatedThemeToggler({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef(null);

  const handleThemeToggle = async (e) => {
    // Check if View Transitions API is supported
    if (!document.startViewTransition) {
      toggleTheme();
      return;
    }

    // Get button position for ripple origin
    const rect = buttonRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Calculate maximum radius for the circle to cover entire viewport
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    // Start view transition
    const transition = document.startViewTransition(() => {
      toggleTheme();
    });

    // Wait for transition to be ready
    await transition.ready;

    // Animate the circle from button center
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];

    document.documentElement.animate(
      {
        clipPath: theme === "dark" ? clipPath.reverse() : clipPath,
      },
      {
        duration: 500,
        easing: "ease-in-out",
        pseudoElement:
          theme === "dark"
            ? "::view-transition-old(root)"
            : "::view-transition-new(root)",
      },
    );
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleThemeToggle}
      className={`relative p-2.5 rounded-full transition-colors flex items-center justify-center w-10 h-10 bg-[#E4E6EB] dark:bg-[#3A3B3C] text-text-main hover:bg-[#D8DADF] dark:hover:bg-[#4E4F50] overflow-hidden ${className}`}
      aria-label={
        theme === "dark" ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"
      }
      title={
        theme === "dark" ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"
      }
    >
      <motion.div
        initial={false}
        animate={{
          scale: theme === "dark" ? 0 : 1,
          opacity: theme === "dark" ? 0 : 1,
          rotate: theme === "dark" ? 90 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="absolute"
      >
        <Sun size={20} />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          scale: theme === "dark" ? 1 : 0,
          opacity: theme === "dark" ? 1 : 0,
          rotate: theme === "dark" ? 0 : -90,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="absolute"
      >
        <Moon size={20} />
      </motion.div>
    </button>
  );
}
