"use client";

import { useEffect, useState, use, useRef } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, ArrowLeft, Share2, Star, Volume2, Image as ImageIcon, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";

export default function SingleChatPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user, loading: authLoading } = useAuth();
  const { t, languageInfo } = useLanguage();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chat, setChat] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const quoteCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    
    if (!user.emailVerified) {
      router.push("/verify-email");
      return;
    }

    const fetchChat = async () => {
      // Offline Cache check
      const cacheKey = `chat_cache_${user.uid}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const found = parsed.find((c: any) => c.id === resolvedParams.id);
          if (found) {
            setChat(found);
            setNote(found.note || "");
            setLoading(false);
          }
        } catch (e) {}
      }

      try {
        const docRef = doc(db, "users", user.uid, "chats", resolvedParams.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as any;
          setChat(data);
          setNote(data.note || "");
        } else if (!chat) {
          router.push("/journal");
        }
      } catch (error) {
        console.error("Error fetching single chat:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [user, authLoading, resolvedParams.id, router]);

  const handleToggleFavorite = async () => {
    if (!user || !chat) return;
    try {
      const newStatus = !chat.isFavorite;
      setChat((prev: any) => ({ ...prev, isFavorite: newStatus }));
      await updateDoc(doc(db, "users", user.uid, "chats", chat.id), {
        isFavorite: newStatus
      });
      
      // Update cache
      const cacheKey = `chat_cache_${user.uid}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        const updatedCache = parsed.map((c: any) => c.id === chat.id ? { ...c, isFavorite: newStatus } : c);
        localStorage.setItem(cacheKey, JSON.stringify(updatedCache));
      }
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
  };

  const handleSaveNote = async () => {
    if (!user || !chat) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid, "chats", chat.id), {
        note: note
      });
      setChat((prev: any) => ({ ...prev, note }));
      
      // Update cache
      const cacheKey = `chat_cache_${user.uid}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        const updatedCache = parsed.map((c: any) => c.id === chat.id ? { ...c, note } : c);
        localStorage.setItem(cacheKey, JSON.stringify(updatedCache));
      }
      
      alert(t.journal.noteSaved || "Reflection note saved.");
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleListen = () => {
    if (!window.speechSynthesis || !chat) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(chat.answer);
    utterance.lang = languageInfo.id === 'en' ? 'en-US' : languageInfo.id;
    window.speechSynthesis.speak(utterance);
  };

  const handleShareQuoteCard = async () => {
    if (!quoteCardRef.current) return;
    try {
      const canvas = await html2canvas(quoteCardRef.current, {
        scale: 2,
        backgroundColor: "#0A0A0A",
        logging: false,
        useCORS: true
      } as any);
      
      const image = canvas.toDataURL("image/png");
      
      const link = document.createElement("a");
      link.href = image;
      link.download = `Gita-Guidance-Quote-${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error("Error generating quote card", err);
    }
  };

  const handleShareText = async () => {
    if (!chat) return;
    const textToShare = `My question: ${chat.question}\n\nDivine Guidance:\n${chat.answer}\n\n- via Gita Guidance`;
    try {
      await navigator.clipboard.writeText(textToShare);
      alert(t.journal.copiedAlert);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      alert(t.journal.copyFailedAlert);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!chat) return null;

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 min-h-[calc(100vh-64px)] relative z-10 pb-20">
      <div className="mb-8 flex justify-between items-center">
        <Link href="/journal" className="inline-flex items-center gap-2 text-primary hover:text-primary-hover transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t.journal.backToJournal}
        </Link>
        <button onClick={handleToggleFavorite} className="p-2 rounded-full hover:bg-white/5 transition-colors">
          <Star className={`w-6 h-6 transition-colors ${chat.isFavorite ? 'fill-primary text-primary' : 'text-foreground/40'}`} />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 md:p-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden mb-8"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

        <div className="mb-8 text-center">
          <p className="text-sm text-foreground/60 uppercase tracking-widest font-semibold mb-4">
            {chat.cachedDate ? new Date(chat.cachedDate).toLocaleDateString() : (chat.timestamp?.toDate ? chat.timestamp.toDate().toLocaleDateString() : t.journal.reflection)}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-primary font-bold leading-tight">
            &quot;{chat.question}&quot;
          </h1>
        </div>

        <div className="bg-black/20 p-6 md:p-8 rounded-2xl border border-white/5 mb-8 relative">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              onClick={handleListen}
              className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              title={t.ask.listen}
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
          <p className="text-foreground/90 leading-loose font-serif text-xl whitespace-pre-wrap pt-8 md:pt-4">
            {chat.answer}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 border-t border-white/5 pt-6">
          <button
            onClick={handleShareText}
            className="flex items-center justify-center gap-2 px-6 py-3 text-foreground font-semibold bg-white/5 hover:bg-white/10 rounded-full transition-all"
          >
            <Share2 className="w-5 h-5" />
            {t.journal.share}
          </button>
          <button
            onClick={handleShareQuoteCard}
            className="flex items-center justify-center gap-2 px-6 py-3 text-background font-semibold bg-primary hover:bg-primary-hover hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] rounded-full transition-all"
          >
            <ImageIcon className="w-5 h-5" />
            {t.journal.shareQuoteCard}
          </button>
        </div>
      </motion.div>

      {/* Personal Reflection Note Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass p-6 md:p-8 rounded-3xl border border-white/5 shadow-lg relative"
      >
        <h2 className="font-serif text-xl font-bold text-foreground mb-4">{t.journal.reflectionNotePlaceholder}</h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t.journal.reflectionNotePlaceholder}
          className="w-full h-32 p-4 rounded-2xl bg-black/20 border border-white/10 text-foreground/90 placeholder-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none transition-all mb-4"
        />
        <div className="flex justify-end">
          <button
            onClick={handleSaveNote}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-primary/20 text-primary font-medium rounded-full hover:bg-primary/30 transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {t.journal.saveNote}
          </button>
        </div>
      </motion.div>

      {/* Hidden Quote Card for HTML2Canvas */}
      <div className="absolute top-[-9999px] left-[-9999px]">
        <div 
          ref={quoteCardRef}
          className="w-[1080px] h-[1080px] flex flex-col justify-center items-center p-20 text-center relative overflow-hidden"
          style={{ 
            background: 'radial-gradient(circle at center, #1a1525 0%, #0a0a0a 100%)',
          }}
        >
          {/* Cosmic Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
          
          <p className="font-serif text-amber-500/80 text-2xl uppercase tracking-[0.3em] font-semibold mb-12 relative z-10">
            &quot;{chat.question}&quot;
          </p>
          
          <h1 className="font-serif text-5xl leading-[1.6] text-white/90 font-medium relative z-10 max-w-4xl">
            {chat.answer}
          </h1>
          
          <div className="absolute bottom-16 left-0 w-full flex flex-col items-center z-10">
            <div className="w-12 h-[1px] bg-amber-500/50 mb-6"></div>
            <p className="font-sans text-white/50 text-xl font-medium tracking-wide">Bhagavad Gita Guide • Divine Wisdom</p>
          </div>
        </div>
      </div>

    </main>
  );
}
