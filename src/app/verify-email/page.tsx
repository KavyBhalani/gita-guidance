"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { sendEmailVerification, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, RefreshCcw, LogOut, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function VerifyEmailPage() {
  const { t } = useLanguage();
  const [resendCooldown, setResendCooldown] = useState(0);
  const [message, setMessage] = useState("");
  const router = useRouter();
  
  useEffect(() => {
    // If user is not logged in, redirect to login
    const checkUser = () => {
      const user = auth.currentUser;
      if (!user) {
        router.push("/login");
      } else if (user.emailVerified) {
        router.push("/ask");
      }
    };
    
    // Give auth a moment to initialize
    const timeout = setTimeout(checkUser, 1000);
    return () => clearTimeout(timeout);
  }, [router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      try {
        await sendEmailVerification(user);
        setMessage(t.auth.checkEmailToVerify);
        setResendCooldown(60);
      } catch (error) {
        console.error("Error sending verification email", error);
        setMessage("Failed to send verification email. Please try again later.");
      }
    }
  };

  const handleCheckVerified = async () => {
    const user = auth.currentUser;
    if (user) {
      await user.reload();
      if (user.emailVerified) {
        router.push("/ask");
      } else {
        setMessage(t.auth.emailNotVerified);
      }
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-64px)] relative overflow-hidden px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass w-full max-w-md p-8 rounded-3xl border border-white/5 shadow-2xl relative z-10 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
            <Mail className="w-10 h-10 text-primary" />
          </div>
        </div>

        <h1 className="font-serif text-3xl font-bold text-foreground mb-4">{t.auth.verifyEmail}</h1>
        <p className="text-foreground/70 mb-8 leading-relaxed">
          {t.auth.verifyEmailSubtitle}
        </p>

        {message && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6 p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm"
          >
            {message}
          </motion.div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleCheckVerified}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-background bg-primary hover:bg-primary-hover focus:outline-none transition-colors shadow-lg"
          >
            <CheckCircle2 className="w-5 h-5" />
            {t.auth.iHaveVerified}
          </button>

          <button
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-border rounded-xl text-sm font-medium text-foreground bg-foreground/5 hover:bg-foreground/10 focus:outline-none transition-colors disabled:opacity-50"
          >
            <RefreshCcw className="w-4 h-4" />
            {resendCooldown > 0 ? `${t.auth.pleaseWait} (${resendCooldown}s)` : t.auth.resendLink}
          </button>

          <a
            href="mailto:"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-border rounded-xl text-sm font-medium text-foreground bg-foreground/5 hover:bg-foreground/10 focus:outline-none transition-colors"
          >
            <Mail className="w-4 h-4" />
            {t.auth.openEmailApp}
          </a>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium text-foreground/60 hover:text-red-400 transition-colors mt-4"
          >
            <LogOut className="w-4 h-4" />
            {t.auth.useAnotherEmail}
          </button>
        </div>
      </motion.div>
    </main>
  );
}
