"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, RefreshCcw, History } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import ChatSidebar from "@/components/ChatSidebar";

const WISDOM_QUOTES = [
  "You have the right to perform your prescribed duty, but you are not entitled to the fruits of action.",
  "When meditation is mastered, the mind is unwavering like the flame of a lamp in a windless place.",
  "There is neither this world nor the world beyond nor happiness for the one who doubts.",
  "A person can rise through the efforts of their own mind; for the mind is the friend of the soul.",
  "Seek refuge in the attitude of detachment and you will amass the wealth of spiritual awareness."
];

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [state, setState] = useState<"idle" | "waiting" | "revealing" | "finished">("idle");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [response, setResponse] = useState("");
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Rotating wisdom during the wait state
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state === "waiting") {
      interval = setInterval(() => {
        setQuoteIndex((prev) => (prev + 1) % WISDOM_QUOTES.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [state]);

  // Word-by-word reveal effect
  useEffect(() => {
    if (state === "revealing") {
      const words = response.split(" ");
      let currentIndex = 0;

      const revealInterval = setInterval(() => {
        if (currentIndex < words.length) {
          setDisplayedWords((prev) => [...prev, words[currentIndex]]);
          currentIndex++;
        } else {
          clearInterval(revealInterval);
          setState("finished");
        }
      }, 100); // 100ms per word reveal

      return () => clearInterval(revealInterval);
    }
  }, [state, response]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setState("waiting");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) throw new Error("Failed to fetch guidance");

      const data = await res.json();

      // Parse the backend response. Assuming data.answer or data.response or just text.
      // If the backend returns a simple string, use it. If an object, extract the main text.
      const answerText = data.answer || data.response || data.message || JSON.stringify(data);

      setResponse(answerText);
      setDisplayedWords([]);
      setState("revealing");

      // Auto-save to Firestore if user is logged in
      if (user) {
        try {
          await addDoc(collection(db, "users", user.uid, "chats"), {
            question,
            answer: answerText,
            timestamp: serverTimestamp()
          });
          setRefreshTrigger(prev => prev + 1);
        } catch (saveError) {
          console.error("Failed to auto-save chat:", saveError);
        }
      }
    } catch (error) {
      console.error(error);
      setResponse("The cosmic connection was interrupted. Please try asking again.");
      setState("revealing");
    }
  };

  const handleReset = () => {
    setQuestion("");
    setResponse("");
    setDisplayedWords([]);
    setState("idle");
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-64px)] relative overflow-hidden">
      {/* Mobile History Toggle */}
      <div className="md:hidden absolute top-4 left-4 z-20">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center gap-2 px-4 py-2 glass rounded-full text-primary hover:bg-white/10 transition-colors shadow-lg border border-white/10"
        >
          <History className="w-4 h-4" />
          <span className="text-sm font-medium">History</span>
        </button>
      </div>

      {/* Sidebar for Hybrid Layout */}
      <ChatSidebar refreshTrigger={refreshTrigger} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden mt-12 md:mt-0">
        {/* Dynamic Background Glow based on state */}
        <motion.div
          animate={{
            scale: state === "waiting" ? [1, 1.2, 1] : 1,
            opacity: state === "waiting" ? [0.3, 0.6, 0.3] : 0.2
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"
        />

        <div className="w-full max-w-3xl z-10">
          <AnimatePresence mode="wait">

            {/* IDLE STATE: Input Form */}
            {state === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center w-full"
              >
                <div className="text-center mb-12">
                  <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-primary">
                    What troubles your mind?
                  </h1>
                  <p className="text-foreground/60 text-lg">
                    Pour your thoughts into the sacred space below.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="w-full relative">
                  <textarea
                    ref={textareaRef}
                    value={question}
                    onChange={handleInput}
                    placeholder="e.g., How do I find peace when everything feels overwhelming?"
                    className="w-full min-h-[150px] max-h-[400px] p-8 rounded-3xl text-xl leading-relaxed text-foreground/90 placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none glass shadow-2xl transition-all"
                    autoFocus
                  />

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!question.trim()}
                    className="absolute bottom-6 right-6 p-4 rounded-full bg-primary text-background disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all"
                  >
                    <Send className="w-6 h-6 ml-1" />
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* WAITING STATE: Rotating Wisdom */}
            {state === "waiting" && (
              <motion.div
                key="waiting"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                transition={{ duration: 1 }}
                className="flex flex-col items-center justify-center min-h-[40vh] text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="mb-12 relative w-32 h-32 flex items-center justify-center"
                >
                  <div className="absolute inset-0 rounded-full border-t-2 border-primary border-opacity-50 blur-[2px]"></div>
                  <div className="absolute inset-2 rounded-full border-r-2 border-accent border-opacity-50 blur-[1px]"></div>
                  <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={quoteIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.8 }}
                    className="font-serif text-2xl md:text-3xl text-foreground/80 max-w-2xl leading-relaxed italic"
                  >
                    &quot;{WISDOM_QUOTES[quoteIndex]}&quot;
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            )}

            {/* REVEALING & FINISHED STATE: Display Answer */}
            {(state === "revealing" || state === "finished") && (
              <motion.div
                key="answer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="w-full"
              >
                <div className="mb-12 text-center">
                  <p className="text-foreground/50 text-sm mb-4 uppercase tracking-widest font-semibold">Your Question</p>
                  <h2 className="font-serif text-2xl md:text-3xl text-primary opacity-90">&quot;{question}&quot;</h2>
                </div>

                <div className="glass p-8 md:p-12 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                  <p className="font-serif text-xl md:text-2xl leading-loose text-foreground min-h-[200px]">
                    {displayedWords.map((word, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, filter: "blur(8px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.4 }}
                        className="inline-block mr-[0.3em] mb-2"
                      >
                        {word}
                      </motion.span>
                    ))}
                    {state === "revealing" && (
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="inline-block w-3 h-5 bg-primary ml-1 align-middle"
                      />
                    )}
                  </p>
                </div>

                {state === "finished" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mt-12 flex flex-col sm:flex-row justify-center gap-4"
                  >
                    <button
                      onClick={handleReset}
                      className="flex items-center justify-center gap-3 px-8 py-4 glass rounded-full hover:bg-white/10 transition-colors text-foreground/80 font-medium group"
                    >
                      <RefreshCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-700" />
                      Seek Further Guidance
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
