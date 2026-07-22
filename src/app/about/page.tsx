"use client";

import { motion, Variants } from "framer-motion";
import { BookOpen, Sparkles, Feather, ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <main className="flex-1 overflow-hidden relative">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-4 py-20 relative z-10"
      >
        <motion.div variants={itemVariants} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span>{t.about.badge}</span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-foreground">
            {t.about.title}
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            {t.about.subtitle}
          </p>
        </motion.div>

        <div className="space-y-24">
          {/* Mission Section */}
          <motion.section variants={itemVariants} className="glass p-8 md:p-12 rounded-3xl relative overflow-hidden border border-border">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
            <h2 className="font-serif text-3xl font-bold mb-6 text-foreground flex items-center gap-3">
              <Heart className="w-8 h-8 text-primary" />
              {t.about.missionTitle}
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed mb-6">
              {t.about.missionP1}
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed">
              {t.about.missionP2}
            </p>
          </motion.section>

          {/* Wisdom Section */}
          <motion.section variants={itemVariants} className="glass p-8 md:p-12 rounded-3xl relative overflow-hidden border border-border">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none"></div>
            <h2 className="font-serif text-3xl font-bold mb-6 text-foreground flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              {t.about.wisdomTitle}
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed mb-6">
              {t.about.wisdomP1}
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed">
              {t.about.wisdomP2}
            </p>
          </motion.section>

          {/* Creator Section */}
          <motion.section variants={itemVariants} className="glass p-8 md:p-12 rounded-3xl relative overflow-hidden border border-border">
            <div className="absolute top-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] pointer-events-none"></div>
            <h2 className="font-serif text-3xl font-bold mb-6 text-foreground flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              {t.about.creatorTitle || "Who Built This Tool?"}
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed mb-6">
              {t.about.creatorP1 || "Gita Guidance was carefully crafted by The Gita Guidance Team, a dedicated group of developers, designers, and spiritual seekers. Our vision was to create a sanctuary on the internet where the timeless wisdom of the Bhagavad Gita could be accessed by anyone, regardless of their background or current life situation."}
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed mb-6">
              {t.about.creatorP2 || "By combining modern AI technology with ancient scriptures, we hope to bridge the gap between historical philosophy and contemporary challenges. For inquiries, collaborations, or support, feel free to reach out to us at "} 
              <a href="mailto:gitaguidanceweb@gmail.com" className="text-primary hover:underline font-medium">gitaguidanceweb@gmail.com</a>.
            </p>
          </motion.section>

          {/* Technology Section */}
          <motion.section variants={itemVariants} className="glass p-8 md:p-12 rounded-3xl relative overflow-hidden border border-border">
            <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] pointer-events-none"></div>
            <h2 className="font-serif text-3xl font-bold mb-6 text-foreground flex items-center gap-3">
              <Feather className="w-8 h-8 text-primary" />
              {t.about.techTitle}
            </h2>
            <p className="text-lg text-foreground/80 leading-relaxed mb-6">
              {t.about.techP1}
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed mb-8">
              {t.about.techP2}
            </p>
            
            <div className="relative z-10 flex justify-center border-t border-border pt-8">
              <Link href="/ask">
                <button className="flex items-center gap-2 px-8 py-4 bg-primary text-background font-semibold rounded-full hover:bg-primary-hover transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  {t.about.beginJourney}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </main>
  );
}
