"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette } from "lucide-react";
import { useTheme, Theme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const THEMES: { id: Theme; name: string; color: string }[] = [
    { id: "theme-cosmic", name: t.themeSelector.cosmicNight, color: "#060913" },
    { id: "theme-pure-light", name: t.themeSelector.pureLight, color: "#FDFBF7" },
    { id: "theme-forest", name: t.themeSelector.monasticForest, color: "#022C22" },
    { id: "theme-sunset", name: t.themeSelector.sunsetSaffron, color: "#450A0A" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-2 rounded-full glass hover:bg-white/10 transition-colors border border-white/5 group"
        title={t.themeSelector.changeTheme}
      >
        <Palette className="w-5 h-5 text-foreground/80 group-hover:text-primary transition-colors" />
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
              className="absolute right-0 mt-2 w-48 py-2 glass bg-background/95 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {THEMES.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setTheme(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-foreground/5 ${
                    theme === item.id ? "text-primary font-medium bg-foreground/5" : "text-foreground/80"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-white/20 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
