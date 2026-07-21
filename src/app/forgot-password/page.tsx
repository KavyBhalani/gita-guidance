"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError("");
    
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(t.auth.resetPasswordError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-64px)] relative overflow-hidden px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass w-full max-w-md p-8 rounded-3xl border border-white/5 shadow-2xl relative z-10"
      >
        <Link href="/login" className="inline-flex items-center gap-2 text-primary hover:text-primary-hover mb-6 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          {t.auth.signIn}
        </Link>

        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">{t.auth.resetPassword}</h1>
          <p className="text-foreground/60 text-sm">{t.auth.resetPasswordSubtitle}</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2 text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-foreground/80 mb-6">{t.auth.resetPasswordSent}</p>
            <a
              href="mailto:"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center items-center py-3 px-6 border border-transparent rounded-xl text-sm font-semibold text-background bg-primary hover:bg-primary-hover transition-colors"
            >
              {t.auth.openEmailApp}
            </a>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-foreground/50" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-black/5 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
                placeholder={t.auth.emailPlaceholder}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-background bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.auth.resetPassword}
            </button>
          </form>
        )}
      </motion.div>
    </main>
  );
}
