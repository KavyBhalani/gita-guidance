"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Trash2, Share2, BookOpen, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function JournalPage() {
  const { user, loading: authLoading } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    const fetchAllChats = async () => {
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
      } catch (error) {
        console.error("Error fetching journal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllChats();
  }, [user, authLoading, router]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "chats", id));
      setChats(prev => prev.filter(chat => chat.id !== id));
    } catch (error) {
      console.error("Failed to delete chat:", error);
      alert("Failed to delete the reflection. Please try again.");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleShare = async (chat: any) => {
    const textToShare = `My question: ${chat.question}\n\nDivine Guidance:\n${chat.answer}\n\n- via Gita Guidance`;
    try {
      await navigator.clipboard.writeText(textToShare);
      alert("Guidance copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      alert("Failed to copy text.");
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
            Back to Guidance
          </Link>
          <h1 className="font-serif text-4xl font-bold text-foreground flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            Your Spiritual Journal
          </h1>
          <p className="text-foreground/70 mt-2">A record of your spiritual inquiries and the wisdom received.</p>
        </div>
      </div>

      {chats.length === 0 ? (
        <div className="glass p-12 rounded-3xl text-center">
          <p className="text-foreground/80 text-lg mb-6">Your journal is currently empty.</p>
          <Link href="/ask">
            <button className="px-8 py-3 bg-primary text-background font-semibold rounded-full hover:bg-primary-hover transition-colors shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              Seek Guidance
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {chats.map((chat) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className="glass p-6 md:p-8 rounded-3xl border border-white/5 shadow-lg group relative overflow-hidden"
              >
                {/* Subtle highlight */}
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/50 group-hover:bg-primary transition-colors"></div>

                <div className="mb-4">
                  <p className="text-sm text-foreground/60 uppercase tracking-wider font-semibold mb-2 flex justify-between items-center">
                    <span>{chat.timestamp?.toDate ? chat.timestamp.toDate().toLocaleDateString() : 'Just now'}</span>
                  </p>
                  <h3 className="font-serif text-2xl text-foreground font-medium">&quot;{chat.question}&quot;</h3>
                </div>

                <Link href={`/journal/${chat.id}`} className="block group/link">
                  <div className="bg-black/20 p-6 rounded-2xl border border-white/5 mb-6 hover:bg-black/30 transition-colors cursor-pointer">
                    <p className="text-foreground/80 leading-relaxed font-serif text-lg whitespace-pre-wrap line-clamp-3">
                      {chat.answer}
                    </p>
                    <p className="text-primary text-sm mt-3 font-medium group-hover/link:underline">Read full guidance →</p>
                  </div>
                </Link>

                <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                  <button
                    onClick={() => handleShare(chat)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground/80 hover:text-foreground bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <button
                    onClick={() => handleDelete(chat.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-white hover:bg-red-500/20 bg-white/5 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
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
