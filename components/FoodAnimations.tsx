"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function FlyingBurger() {
  return (
    <motion.div
      className="absolute text-6xl"
      animate={{
        x: [0, 100, 0],
        y: [0, -50, 0],
        rotate: [0, 360, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      🍔
    </motion.div>
  );
}

export function FloatingPizza() {
  return (
    <motion.div
      className="absolute text-5xl"
      animate={{
        y: [0, -30, 0],
        rotate: [0, 10, -10, 0],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      🍕
    </motion.div>
  );
}

export function BouncingFood({ emoji, delay = 0 }: { emoji: string; delay?: number }) {
  return (
    <motion.div
      className="text-4xl cursor-pointer"
      animate={{
        y: [0, -20, 0],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      whileHover={{
        scale: 1.3,
        rotate: [0, -10, 10, -10, 0],
      }}
    >
      {emoji}
    </motion.div>
  );
}

export function RotatingTaco() {
  return (
    <motion.div
      className="text-5xl"
      animate={{
        rotate: 360,
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      🌮
    </motion.div>
  );
}

export function FoodBackground() {
  const foods = ["🍔", "🍕", "🌮", "🍜", "🍱", "🥗", "🌯", "🍝"];
  const [positions, setPositions] = useState<Array<{ x: number; y: number; emoji: string }>>([]);

  useEffect(() => {
    const newPositions = foods.map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      emoji: foods[Math.floor(Math.random() * foods.length)],
    }));
    setPositions(newPositions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        >
          {pos.emoji}
        </motion.div>
      ))}
    </div>
  );
}

