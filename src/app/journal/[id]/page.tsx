"use client";

import { useEffect, useState, use } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SingleChatPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user, loading: authLoading } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chat, setChat] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchChat = async () => {
      try {
        const docRef = doc(db, "users", user.uid, "chats", resolvedParams.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setChat({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No such document!");
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

  const handleShare = async () => {
    if (!chat) return;
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

  if (!chat) return null;

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 min-h-[calc(100vh-64px)] relative z-10">
      <div className="mb-8">
        <Link href="/journal" className="inline-flex items-center gap-2 text-primary hover:text-primary-hover mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Journal
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 md:p-10 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

        <div className="mb-8 text-center">
          <p className="text-sm text-foreground/60 uppercase tracking-widest font-semibold mb-4">
            {chat.timestamp?.toDate ? chat.timestamp.toDate().toLocaleDateString() : 'Reflection'}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-primary font-bold leading-tight">
            &quot;{chat.question}&quot;
          </h1>
        </div>

        <div className="bg-black/20 p-6 md:p-8 rounded-2xl border border-white/5 mb-8">
          <p className="text-foreground/90 leading-loose font-serif text-xl whitespace-pre-wrap">
            {chat.answer}
          </p>
        </div>

        <div className="flex justify-center border-t border-white/5 pt-6">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-8 py-3 text-background font-semibold bg-primary hover:bg-primary-hover hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] rounded-full transition-all"
          >
            <Share2 className="w-5 h-5" />
            Share this Wisdom
          </button>
        </div>
      </motion.div>
    </main>
  );
}
