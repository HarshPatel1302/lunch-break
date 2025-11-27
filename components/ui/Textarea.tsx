"use client";

import { motion } from "framer-motion";
import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className = "", ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-lunch-dark mb-2">
          {label}
        </label>
      )}
      <motion.textarea
        className={`w-full px-4 py-3 rounded-xl border-2 border-lunch-yellow focus:border-lunch-orange focus:outline-none transition-all duration-300 bg-white text-lunch-dark resize-none ${className}`}
        whileFocus={{ scale: 1.02 }}
        {...(props as any)}
      />
    </div>
  );
}

