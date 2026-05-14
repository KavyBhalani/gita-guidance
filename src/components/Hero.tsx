"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[80px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="z-10 text-center max-w-4xl mx-auto flex flex-col items-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-primary"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Spiritual Companion</span>
        </motion.div>

        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Find Clarity Through <br />
          <span className="text-gradient">Ancient Wisdom</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Ask your life&apos;s deepest questions and receive personalized guidance based on the teachings of the Bhagavad Gita, elevated by modern AI.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link href="/ask">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-primary text-background font-semibold rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-2 transition-all hover:bg-primary-hover hover:shadow-[0_0_30px_rgba(245,158,11,0.6)]"
            >
              Seek Guidance
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <Link href="/about">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 glass text-foreground font-semibold rounded-full hover:bg-white/5 transition-colors"
            >
              Learn More
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Decorative floating elements */}
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-[40px] pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-[50px] pointer-events-none"
      />
    </section>
  );
}
