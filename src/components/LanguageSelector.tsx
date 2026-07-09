"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Languages, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSelector() {
  const { language, setLanguage, LANGUAGES } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass hover:bg-white/10 transition-colors border border-white/5 group"
        title="Select Language"
      >
        <Languages className="w-4 h-4 text-foreground/80 group-hover:text-primary transition-colors" />
        <span className="text-xs font-bold uppercase tracking-wider text-foreground/80 group-hover:text-primary transition-colors">
          {language}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto py-2 glass bg-background/95 rounded-2xl shadow-2xl z-50 border border-white/10 custom-scrollbar"
            >
              {LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    setLanguage(l.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-foreground/5 ${
                    language === l.id ? "text-primary font-medium bg-foreground/5" : "text-foreground/80"
                  }`}
                >
                  <span className="truncate">{l.nativeName}</span>
                  {language === l.id && <Check className="w-4 h-4 shrink-0 text-primary" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
