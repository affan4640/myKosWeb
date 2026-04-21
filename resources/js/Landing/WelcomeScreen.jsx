import { useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Home, Globe, User, GitBranch } from "lucide-react";

import logo from "../../assets/logo.png";

export default function WelcomeScreen({ onFinish }) {
  // 🎯 PARALLAX
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const move = (e) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX - innerWidth / 2) / 20);
      mouseY.set((e.clientY - innerHeight / 2) / 20);
    };

    window.addEventListener("mousemove", move);

    // ⏱️ TIMER → pindah ke Home
    const timer = setTimeout(() => {
      onFinish(); // 🔥 trigger ke Landing.jsx
    }, 3000);

    return () => {
      window.removeEventListener("mousemove", move);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{
          opacity: 0,
          scale: 1.2,
          filter: "blur(14px)",
        }}
        transition={{ duration: 0.8 }}
      >
        {/* 🌌 PARALLAX BACKGROUND */}
        <motion.div
          style={{ x: smoothX, y: smoothY }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 blur-3xl" />
        </motion.div>

        {/* ✨ CURSOR GLOW */}
        <motion.div
          className="pointer-events-none absolute w-72 h-72 rounded-full bg-primary/20 blur-3xl"
          style={{ x: mouseX, y: mouseY }}
        />

        <div className="relative text-center px-6 max-w-3xl">
          {/* 🚀 ICON */}
          <div className="flex justify-center gap-8 mb-12">
            {[Home, User, GitBranch].map((Icon, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
                className="p-4 rounded-full bg-background/40 border border-secondary/20 backdrop-blur"
              >
                <Icon className="text-secondary w-7 h-7" />
              </motion.div>
            ))}
          </div>

          {/* 🧩 LOGO */}
          <motion.img
            src={logo}
            alt="Logo"
            className="mx-auto w-40 md:w-56 drop-shadow-xl"
            style={{ x: smoothX, y: smoothY }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          />

          {/* 🌐 FOOTER */}
          <motion.div
            className="mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background/40 border border-secondary/20 backdrop-blur">
              <Globe className="text-primary w-5 h-5" />
              <span className="text-sm text-gray-600">
                Copyright © 2026 MyKosTeam All Right Reserved.
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}