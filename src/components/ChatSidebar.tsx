"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageSquare, ArrowRight, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatSidebar({ refreshTrigger, isOpen, onClose }: { refreshTrigger?: number, isOpen?: boolean, onClose?: () => void }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recentChats, setRecentChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTimeout(() => {
        setRecentChats([]);
        setLoading(false);
      }, 0);
      return;
    }

    const fetchChats = async () => {
      try {
        const q = query(
          collection(db, "users", user.uid, "chats"),
          orderBy("timestamp", "desc"),
          limit(5)
        );
        const snapshot = await getDocs(q);
        const chats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecentChats(chats);
      } catch (error) {
        console.error("Error fetching recent chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user, refreshTrigger]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100] md:hidden backdrop-blur-sm"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <div className={`fixed md:relative top-0 left-0 h-full z-[110] md:z-10 w-[80%] md:w-80 max-w-sm border-r border-border bg-background/95 md:bg-background/90 backdrop-blur-md flex flex-col shrink-0 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-4 md:p-6 border-b border-border flex justify-between items-center">
          <h2 className="font-serif text-xl font-bold text-primary flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            {t.sidebar.recentGuidance}
          </h2>
          <button className="md:hidden text-foreground/80 hover:text-foreground p-2 bg-foreground/5 rounded-full" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
        {!user ? (
          <p className="text-foreground/60 text-sm text-center italic mt-4">
            {t.sidebar.signInPrompt}
          </p>
        ) : loading ? (
          <div className="flex justify-center mt-8">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : recentChats.length === 0 ? (
          <p className="text-foreground/60 text-sm text-center italic mt-4">
            {t.sidebar.noGuidancePrompt}
          </p>
        ) : (
          recentChats.map((chat) => (
            <Link key={chat.id} href={`/journal/${chat.id}`} onClick={onClose}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl glass hover:brightness-110 transition-all group cursor-pointer"
              >
                <p className="text-sm text-foreground/90 line-clamp-2 leading-relaxed">
                  &quot;{chat.question}&quot;
                </p>
                <div className="mt-2 text-xs text-primary/80 group-hover:text-primary flex items-center gap-1 transition-colors">
                  {t.sidebar.readReflection} <ArrowRight className="w-3 h-3" />
                </div>
              </motion.div>
            </Link>
          ))
        )}
      </div>

      <div className="p-4 md:p-6 border-t border-border bg-black/10">
        <Link href="/journal" className="block w-full" onClick={onClose}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 glass hover:brightness-110 text-foreground/80 rounded-xl transition-all flex items-center justify-center gap-2 group"
          >
            <span>{t.sidebar.seeAllChats}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </Link>
      </div>
    </div>
    </>
  );
}
