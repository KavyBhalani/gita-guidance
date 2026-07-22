"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Menu, LogOut, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import ThemeSelector from "@/components/ThemeSelector";
import LanguageSelector from "@/components/LanguageSelector";

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                <Image 
                  src="/icon.png" 
                  alt="Gita Guidance Logo" 
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-serif font-bold text-xl text-primary">{t.navbar.title}</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link 
                href="/" 
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/') ? 'text-primary' : 'text-foreground/80'}`}
              >
                {t.navbar.home}
              </Link>
              <Link 
                href="/ask" 
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/ask') ? 'text-primary' : 'text-foreground/80'}`}
              >
                {t.navbar.guidance}
              </Link>
              <Link 
                href="/about" 
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/about') ? 'text-primary' : 'text-foreground/80'}`}
              >
                {t.navbar.about}
              </Link>
              <Link 
                href="/blog" 
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/blog') ? 'text-primary' : 'text-foreground/80'}`}
              >
                {t.navbar.blog}
              </Link>
            </div>

            {/* Theme, Language & Auth Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <LanguageSelector />
              <ThemeSelector />
              {!loading && (
                user ? (
                  <div className="hidden md:flex items-center gap-4 border border-white/10 bg-white/5 pl-2 pr-4 py-1.5 rounded-full">
                    <div className="flex items-center gap-2">
                      {user.photoURL ? (
                        <Image src={user.photoURL} alt="Profile" width={28} height={28} className="rounded-full" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                          {user.email?.substring(0, 2).toUpperCase() || 'U'}
                        </div>
                      )}
                      <span className="text-sm font-medium text-foreground/90 max-w-[100px] truncate">
                        {user.displayName || user.email?.split('@')[0] || t.navbar.seeker}
                      </span>
                    </div>
                    <div className="w-px h-4 bg-white/20"></div>
                    <button 
                      onClick={logout}
                      className="text-foreground/60 hover:text-red-400 transition-colors"
                      title={t.navbar.signOut}
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Link href="/login">
                    <button className="hidden md:flex items-center gap-2 text-sm font-medium bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-colors border border-white/10">
                      <User className="w-4 h-4" />
                      {t.navbar.signIn}
                    </button>
                  </Link>
                )
              )}
              <button 
                className="md:hidden text-foreground/80 hover:text-foreground p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-sm glass bg-background/95 z-50 md:hidden border-l border-white/10 shadow-2xl overflow-y-auto flex flex-col"
            >
              <div className="flex justify-end p-4 border-b border-white/5">
                <button
                  className="text-foreground/80 hover:text-foreground p-2 bg-white/5 rounded-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="px-6 py-8 flex flex-col gap-6 flex-1">
                <Link 
                  href="/" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-lg font-medium transition-colors ${isActive('/') ? 'text-primary bg-white/10 border border-white/5' : 'text-foreground/80 hover:text-foreground hover:bg-white/5'}`}
                >
                  {t.navbar.home}
                </Link>
                <Link 
                  href="/ask" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-lg font-medium transition-colors ${isActive('/ask') ? 'text-primary bg-white/10 border border-white/5' : 'text-foreground/80 hover:text-foreground hover:bg-white/5'}`}
                >
                  {t.navbar.guidance}
                </Link>
                <Link 
                  href="/about" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-lg font-medium transition-colors ${isActive('/about') ? 'text-primary bg-white/10 border border-white/5' : 'text-foreground/80 hover:text-foreground hover:bg-white/5'}`}
                >
                  {t.navbar.about}
                </Link>
                <Link 
                  href="/blog" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-lg font-medium transition-colors ${isActive('/blog') ? 'text-primary bg-white/10 border border-white/5' : 'text-foreground/80 hover:text-foreground hover:bg-white/5'}`}
                >
                  {t.navbar.blog}
                </Link>
                
                <div className="mt-auto pt-6 border-t border-white/10">
                  {!loading && (
                    user ? (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 px-4 py-3 bg-black/20 rounded-xl border border-white/5">
                          {user.photoURL ? (
                            <Image src={user.photoURL} alt="Profile" width={40} height={40} className="rounded-full shadow-lg" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold shadow-inner">
                              {user.email?.substring(0, 2).toUpperCase() || 'U'}
                            </div>
                          )}
                          <span className="text-base font-medium text-foreground/90">
                            {user.displayName || user.email?.split('@')[0] || t.navbar.seeker}
                          </span>
                        </div>
                        <button 
                          onClick={() => {
                            logout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex w-full items-center justify-center gap-3 px-4 py-4 rounded-xl text-base font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                        >
                          <LogOut className="w-5 h-5" />
                          {t.navbar.signOut}
                        </button>
                      </div>
                    ) : (
                      <Link 
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex w-full items-center justify-center gap-3 px-4 py-4 rounded-xl text-lg font-semibold text-background bg-primary hover:bg-primary-hover shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all"
                      >
                        <User className="w-5 h-5" />
                        {t.navbar.signIn}
                      </Link>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
