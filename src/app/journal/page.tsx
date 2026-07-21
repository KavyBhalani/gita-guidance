"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, Trash2, Share2, BookOpen, ArrowLeft, Star, WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function JournalPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");
  const [isOffline, setIsOffline] = useState(false);
  const router = useRouter();

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

    const fetchAllChats = async () => {
      const cacheKey = `chat_cache_${user.uid}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setChats(parsed);
          setLoading(false);
        } catch (e) {
          console.error("Cache parsing error", e);
        }
      }

      try {
        const q = query(
          collection(db, "users", user.uid, "chats"),
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(q);
        const fetchedChats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChats(fetchedChats);
        setIsOffline(false);
        
        const cacheable = fetchedChats.map((c: any) => ({
          ...c,
          cachedDate: c.timestamp?.toDate ? c.timestamp.toDate().toISOString() : null,
          timestamp: null // strip non-serializable object
        }));
        localStorage.setItem(cacheKey, JSON.stringify(cacheable));
      } catch (error) {
        console.error("Error fetching journal:", error);
        setIsOffline(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAllChats();
  }, [user, authLoading, router]);

  const handleToggleFavorite = async (id: string, currentStatus: boolean, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    try {
      // Optimistic update
      setChats(prev => prev.map(chat => chat.id === id ? { ...chat, isFavorite: !currentStatus } : chat));
      await updateDoc(doc(db, "users", user.uid, "chats", id), {
        isFavorite: !currentStatus
      });
      
      // Update cache
      const cacheKey = `chat_cache_${user.uid}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        const updatedCache = parsed.map((c: any) => c.id === id ? { ...c, isFavorite: !currentStatus } : c);
        localStorage.setItem(cacheKey, JSON.stringify(updatedCache));
      }
    } catch (error) {
      console.error("Failed to update favorite:", error);
      // Revert optimistic update
      setChats(prev => prev.map(chat => chat.id === id ? { ...chat, isFavorite: currentStatus } : chat));
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "chats", id));
      setChats(prev => prev.filter(chat => chat.id !== id));
    } catch (error) {
      console.error("Failed to delete chat:", error);
      alert(t.journal.deleteFailedAlert);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleShare = async (chat: any) => {
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

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 min-h-[calc(100vh-64px)] relative z-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/ask" className="inline-flex items-center gap-2 text-primary hover:text-primary-hover mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t.journal.backToGuidance}
          </Link>
          <h1 className="font-serif text-4xl font-bold text-foreground flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            {t.journal.title}
          </h1>
          <p className="text-foreground/70 mt-2">{t.journal.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === 'all' ? 'bg-primary text-background shadow-lg' : 'bg-white/5 text-foreground/70 hover:bg-white/10'}`}
        >
          {t.journal.all}
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-colors ${activeTab === 'favorites' ? 'bg-primary text-background shadow-lg' : 'bg-white/5 text-foreground/70 hover:bg-white/10'}`}
        >
          <Star className="w-4 h-4" />
          {t.journal.favorites}
        </button>
      </div>

      {isOffline && (
        <div className="mb-6 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center gap-2 text-orange-400 text-sm">
          <WifiOff className="w-4 h-4 shrink-0" />
          <p>{t.journal.offlineMode}</p>
        </div>
      )}

      {chats.filter(c => activeTab === 'all' ? true : c.isFavorite).length === 0 ? (
        <div className="glass p-12 rounded-3xl text-center">
          <p className="text-foreground/80 text-lg mb-6">{t.journal.emptyText}</p>
          <Link href="/ask">
            <button className="px-8 py-3 bg-primary text-background font-semibold rounded-full hover:bg-primary-hover transition-colors shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              {t.journal.seekGuidance}
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {chats.filter(c => activeTab === 'all' ? true : c.isFavorite).map((chat) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className="glass p-6 md:p-8 rounded-3xl border border-white/5 shadow-lg group relative overflow-hidden"
              >
                {/* Subtle highlight */}
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/50 group-hover:bg-primary transition-colors"></div>

                <div className="absolute top-6 right-6">
                  <button onClick={(e) => handleToggleFavorite(chat.id, chat.isFavorite, e)} className="text-foreground/40 hover:text-primary transition-colors">
                    <Star className={`w-6 h-6 ${chat.isFavorite ? 'fill-primary text-primary' : ''}`} />
                  </button>
                </div>

                <div className="mb-4 pr-12">
                  <p className="text-sm text-foreground/60 uppercase tracking-wider font-semibold mb-2 flex justify-between items-center">
                    <span>{chat.cachedDate ? new Date(chat.cachedDate).toLocaleDateString() : (chat.timestamp?.toDate ? chat.timestamp.toDate().toLocaleDateString() : t.journal.justNow)}</span>
                  </p>
                  <h3 className="font-serif text-2xl text-foreground font-medium">&quot;{chat.question}&quot;</h3>
                </div>

                <Link href={`/journal/${chat.id}`} className="block group/link">
                  <div className="bg-black/20 p-6 rounded-2xl border border-white/5 mb-6 hover:bg-black/30 transition-colors cursor-pointer">
                    <p className="text-foreground/80 leading-relaxed font-serif text-lg whitespace-pre-wrap line-clamp-3">
                      {chat.answer}
                    </p>
                    <p className="text-primary text-sm mt-3 font-medium group-hover/link:underline">{t.journal.readFullGuidance}</p>
                  </div>
                </Link>

                <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                  <button
                    onClick={() => handleShare(chat)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground/80 hover:text-foreground bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    {t.journal.share}
                  </button>
                  <button
                    onClick={() => handleDelete(chat.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-white hover:bg-red-500/20 bg-white/5 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t.journal.delete}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}
