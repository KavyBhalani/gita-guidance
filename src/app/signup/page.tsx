"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile, sendEmailVerification } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SignupPage() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's profile with their name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
        await sendEmailVerification(userCredential.user);
      }

      router.push("/verify-email");
    } catch (err: unknown) {
      console.error(err);
      const firebaseError = err as { code?: string };
      if (firebaseError.code === 'auth/email-already-in-use') {
        setError(t.auth.emailExistsError);
      } else if (firebaseError.code === 'auth/weak-password') {
        setError(t.auth.weakPasswordError);
      } else {
        setError(t.auth.signupError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();
    
    try {
      await signInWithPopup(auth, provider);
      router.push("/ask");
    } catch (err: unknown) {
      console.error(err);
      setError(t.auth.googleSignupError);
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-64px)] relative overflow-hidden px-4">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass w-full max-w-md p-8 rounded-3xl border border-white/5 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">{t.auth.beginJourney}</h1>
          <p className="text-foreground/60 text-sm">{t.auth.createAccountSubtitle}</p>
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

        <form onSubmit={handleEmailSignup} className="space-y-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-foreground/50" />
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-black/5 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
              placeholder={t.auth.namePlaceholder}
            />
          </div>

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

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-foreground/50" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-black/5 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
              placeholder={t.auth.passwordMinPlaceholder}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-background bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(245,158,11,0.3)]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t.auth.createAccount}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-transparent text-foreground/50">{t.auth.orSignUpWith}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-border rounded-xl text-sm font-medium text-foreground/80 bg-foreground/5 hover:bg-foreground/10 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {t.auth.google}
        </button>

        <p className="mt-8 text-center text-sm text-foreground/60">
          {t.auth.hasAccount}{" "}
          <Link href="/login" className="text-primary hover:text-primary-hover font-medium transition-colors">
            {t.auth.signInLink}
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
