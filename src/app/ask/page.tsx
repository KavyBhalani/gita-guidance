"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, RefreshCcw, History, Volume2, Square, Play, Pause } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import ChatSidebar from "@/components/ChatSidebar";

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [state, setState] = useState<"idle" | "waiting" | "revealing" | "finished">("idle");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [response, setResponse] = useState("");
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [speechState, setSpeechState] = useState<"idle" | "playing" | "paused">("idle");
  const [charIndex, setCharIndex] = useState<number>(-1);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();
  const { t, languageInfo } = useLanguage();

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // rotating wisdom
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state === "waiting") {
      interval = setInterval(() => {
        setQuoteIndex((prev) => (prev + 1) % t.ask.quotes.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [state, t.ask.quotes.length]);

  // Auth verification check
  const router = useRouter();
  useEffect(() => {
    if (user && !user.emailVerified) {
      router.push("/verify-email");
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [user, router]);

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
        body: JSON.stringify({ 
          question,
          language: languageInfo.name,
          languageCode: languageInfo.id
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch guidance");

      const data = await res.json();

      // Parse the backend response. Assuming data.answer or data.response or just text.
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
            language: languageInfo.name,
            timestamp: serverTimestamp()
          });
          setRefreshTrigger(prev => prev + 1);
        } catch (saveError) {
          console.error("Failed to auto-save chat:", saveError);
        }
      }
    } catch (error) {
      console.error(error);
      setResponse(t.ask.errorMessage);
      setState("revealing");
    }
  };

  const handleReset = () => {
    setQuestion("");
    setResponse("");
    setDisplayedWords([]);
    setState("idle");
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const handleListen = () => {
    if (!window.speechSynthesis) return;

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
    const utterance = new SpeechSynthesisUtterance(response);
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

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-64px)] relative overflow-hidden">
      {/* Mobile History Toggle */}
      <div className="md:hidden absolute top-4 left-4 z-20">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Toggle History Sidebar"
          className="flex items-center gap-2 px-4 py-2 glass rounded-full text-primary hover:bg-white/10 transition-colors shadow-lg border border-white/10"
        >
          <History className="w-4 h-4" />
          <span className="text-sm font-medium">{t.ask.history}</span>
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
                    {t.ask.title}
                  </h1>
                  <p className="text-foreground/60 text-lg">
                    {t.ask.subtitle}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="w-full relative">
                  <textarea
                    ref={textareaRef}
                    value={question}
                    onChange={handleInput}
                    placeholder={t.ask.placeholder}
                    aria-label="Ask your spiritual question"
                    className="w-full min-h-[150px] max-h-[400px] p-8 rounded-3xl text-xl leading-relaxed text-foreground/90 placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none glass shadow-2xl transition-all"
                    autoFocus
                  />

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!question.trim()}
                    aria-label="Submit question"
                    className="absolute bottom-6 right-6 p-4 rounded-full bg-primary text-background disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all"
                  >
                    <Send className="w-6 h-6 ml-1" />
                  </motion.button>
                </form>

                <p className="mt-4 text-xs text-foreground/40 text-center max-w-lg">
                  Disclaimer: This is an AI trained on the Bhagavad Gita. While it aims for accuracy, AI can occasionally hallucinate or provide imperfect advice. It is not a substitute for professional mental health care.
                </p>

                <div className="flex gap-2 mt-6 overflow-x-auto pb-2 custom-scrollbar w-full max-w-full">
                  {[
                    { label: "Anxiety & Stress", text: t.ask.chips.anxiety },
                    { label: "Grief & Loss", text: t.ask.chips.grief },
                    { label: "Dilemma at Work", text: t.ask.chips.dilemma },
                    { label: "Anger & Patience", text: t.ask.chips.anger },
                    { label: "Finding Purpose", text: t.ask.chips.purpose },
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setQuestion(chip.text);
                        if (textareaRef.current) {
                          textareaRef.current.style.height = "auto";
                          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                        }
                      }}
                      className="whitespace-nowrap px-4 py-2 rounded-full glass border border-white/5 text-sm font-medium text-foreground/80 hover:bg-white/10 hover:text-primary transition-colors"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
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
                    &quot;{t.ask.quotes[quoteIndex || 0]}&quot;
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
                  <p className="text-foreground/50 text-sm mb-4 uppercase tracking-widest font-semibold">{t.ask.yourQuestion}</p>
                  <h2 className="font-serif text-2xl md:text-3xl text-primary opacity-90">&quot;{question}&quot;</h2>
                </div>

                <div className="glass p-8 md:p-12 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    {speechState !== "idle" && (
                      <button
                        onClick={handleStopListen}
                        className="p-2 rounded-full bg-white/5 text-foreground/60 hover:bg-white/10 hover:text-red-400 transition-colors"
                        title="Stop"
                      >
                        <Square className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={handleListen}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors text-sm font-medium border ${speechState === 'playing' ? 'bg-primary/20 text-primary border-primary/40 animate-pulse' : 'bg-primary/10 text-primary hover:bg-primary/20 border-primary/20'}`}
                      title={speechState === "playing" ? "Pause" : t.ask.listen}
                    >
                      {speechState === "playing" ? <Pause className="w-4 h-4" /> : (speechState === "paused" ? <Play className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />)}
                      {speechState === "playing" ? "Pause" : (speechState === "paused" ? "Resume" : t.ask.listen)}
                    </button>
                  </div>

                  <p className="font-serif text-xl md:text-2xl leading-loose text-foreground min-h-[200px] mt-4">
                    {state === "revealing" ? (
                      displayedWords.map((word, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, filter: "blur(8px)" }}
                          animate={{ opacity: 1, filter: "blur(0px)" }}
                          transition={{ duration: 0.4 }}
                          className="inline-block mr-[0.3em] mb-2"
                        >
                          {word}
                        </motion.span>
                      ))
                    ) : (
                      renderHighlightedText(response, charIndex)
                    )}
                    {state === "revealing" && (
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="inline-block w-3 h-5 bg-primary ml-1 align-middle"
                      />
                    )}
                  </p>
                </div>
                
                <p className="mt-6 text-xs text-foreground/40 text-center mx-auto max-w-2xl">
                  This guidance is generated by Artificial Intelligence for spiritual comfort and self-reflection. It is not professional advice. AI can make mistakes.
                </p>

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
                      {t.ask.seekFurther}
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
