"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "danger";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
}: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300";
  
  const variants = {
    primary: "bg-lunch-orange hover:bg-orange-600 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-lunch-yellow hover:bg-yellow-400 text-lunch-dark shadow-lg hover:shadow-xl",
    success: "bg-lunch-green hover:bg-green-600 text-white shadow-lg hover:shadow-xl",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {children}
    </motion.button>
  );
}

