"use client";

import { motion } from "framer-motion";
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  const inputId = label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined;
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-lunch-dark mb-2">
          {label}
        </label>
      )}
      <motion.input
        id={inputId}
        className={`w-full px-4 py-3 rounded-xl border-2 border-lunch-yellow focus:border-lunch-orange focus:outline-none transition-all duration-300 bg-white text-lunch-dark ${className}`}
        whileFocus={{ scale: 1.02 }}
        {...(props as any)}
      />
    </div>
  );
}

