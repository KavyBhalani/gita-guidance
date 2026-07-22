"use client";

import { useEffect, useState, use, useRef } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, ArrowLeft, Share2, Star, Volume2, Save, Pause, Play, Square } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Chat } from "@/types/chat";

export default function SingleChatPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user, loading: authLoading } = useAuth();
  const { t, languageInfo } = useLanguage();
  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [speechState, setSpeechState] = useState<"idle" | "playing" | "paused">("idle");
  const [charIndex, setCharIndex] = useState<number>(-1);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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
          const found = parsed.find((c: Chat) => c.id === resolvedParams.id);
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
          const data = { id: docSnap.id, ...docSnap.data() } as Chat;
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
      setChat((prev: Chat | null) => prev ? { ...prev, isFavorite: newStatus } : null);
      await updateDoc(doc(db, "users", user.uid, "chats", chat.id), {
        isFavorite: newStatus
      });
      
      // Update cache
      const cacheKey = `chat_cache_${user.uid}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        const updatedCache = parsed.map((c: Chat) => c.id === chat.id ? { ...c, isFavorite: newStatus } : c);
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
      setChat((prev: Chat | null) => prev ? { ...prev, note } : null);
      
      // Update cache
      const cacheKey = `chat_cache_${user.uid}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        const updatedCache = parsed.map((c: Chat) => c.id === chat.id ? { ...c, note } : c);
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

    if (speechState === "playing") {
      window.speechSynthesis.pause();
      setSpeechState("paused");
      return;
    }

    if (speechState === "paused") {
      window.speechSynthesis.resume();
      setSpeechState("playing");
      return;
    }

    window.speechSynthesis.cancel();
    setCharIndex(0);
    const utterance = new SpeechSynthesisUtterance(chat.answer);
    utterance.lang = languageInfo.id === 'en' ? 'en-US' : languageInfo.id;
    
    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        setCharIndex(e.charIndex);
      }
    };
    
    utterance.onend = () => {
      setSpeechState("idle");
      setCharIndex(-1);
    };

    utterance.onerror = () => {
      setSpeechState("idle");
      setCharIndex(-1);
    };

    window.speechSynthesis.speak(utterance);
    setSpeechState("playing");
  };

  const handleStopListen = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeechState("idle");
    setCharIndex(-1);
  };

  const renderHighlightedText = (text: string, currentIndex: number) => {
    if (currentIndex < 0) return text;
    
    const match = text.slice(currentIndex).match(/[\s\n]/);
    const endIndex = match ? currentIndex + match.index! : text.length;
    
    const before = text.slice(0, currentIndex);
    const word = text.slice(currentIndex, endIndex);
    const after = text.slice(endIndex);
    
    return (
      <>
        {before}
        <span className="bg-primary/40 text-primary font-bold rounded px-1 -mx-1 transition-colors duration-150 shadow-[0_0_10px_rgba(245,158,11,0.3)]">{word}</span>
        {after}
      </>
    );
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
            {speechState !== "idle" && (
              <button
                onClick={handleStopListen}
                className="p-2 rounded-full bg-white/5 text-foreground/60 hover:bg-white/10 hover:text-red-400 transition-colors"
                title="Stop"
              >
                <Square className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleListen}
              className={`p-2 rounded-full transition-colors ${speechState === 'playing' ? 'bg-primary/20 text-primary animate-pulse' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
              title={speechState === "playing" ? "Pause" : t.ask.listen}
            >
              {speechState === "playing" ? <Pause className="w-5 h-5" /> : (speechState === "paused" ? <Play className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />)}
            </button>
          </div>
          <p className="text-foreground/90 leading-loose font-serif text-xl whitespace-pre-wrap pt-8 md:pt-4">
            {renderHighlightedText(chat.answer, charIndex)}
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



    </main>
  );
}
