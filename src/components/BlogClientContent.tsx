"use client";

import { useState, useEffect } from "react";
import { Volume2, Pause, Play, Star, Square } from "lucide-react";
import { useFavoriteBlogs } from "@/hooks/useFavoriteBlogs";

interface BlogClientContentProps {
  slug: string;
  htmlContent: string;
  cleanText: string;
}

export function BlogClientContent({ slug, htmlContent, cleanText }: BlogClientContentProps) {
  const [speechState, setSpeechState] = useState<"idle" | "playing" | "paused">("idle");
  const [charIndex, setCharIndex] = useState<number>(-1);
  const [chunkIndex, setChunkIndex] = useState<number>(-1);
  const { isFavorite, toggleFavorite } = useFavoriteBlogs();

  // Split cleanText into paragraphs for reliable TTS playback
  const chunks = cleanText.split(/\n+/).filter(c => c.trim().length > 0);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const playChunk = (index: number) => {
    if (index >= chunks.length) {
      setSpeechState("idle");
      setChunkIndex(-1);
      setCharIndex(-1);
      return;
    }
    
    setChunkIndex(index);
    setCharIndex(0);
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes("en-US") && v.name.includes("Google"));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onboundary = (e) => {
      if (e.name === "word") {
        setCharIndex(e.charIndex);
      }
    };

    utterance.onend = () => {
      // Play next chunk
      playChunk(index + 1);
    };

    utterance.onerror = (e) => {
      console.error("Speech synthesis error", e);
      setSpeechState("idle");
      setChunkIndex(-1);
      setCharIndex(-1);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSpeechToggle = () => {
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

    // Start speaking from first chunk
    setSpeechState("playing");
    playChunk(0);
  };

  const handleStopListen = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeechState("idle");
    setChunkIndex(-1);
    setCharIndex(-1);
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(slug);
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
    <>
      <div className="flex items-center justify-end gap-3 mb-8 w-full">
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
          onClick={handleSpeechToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors text-sm font-medium border ${speechState === 'playing' ? 'bg-primary/20 text-primary border-primary/40 animate-pulse' : 'bg-primary/10 text-primary hover:bg-primary/20 border-primary/20'}`}
          title={speechState === "playing" ? "Pause" : "Listen to article"}
        >
          {speechState === "playing" ? <Pause className="w-4 h-4" /> : (speechState === "paused" ? <Play className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />)}
          {speechState === "playing" ? "Pause" : (speechState === "paused" ? "Resume" : "Listen")}
        </button>

        <button
          onClick={handleToggleFavorite}
          className="p-2 rounded-full hover:bg-white/5 transition-colors"
          title={isFavorite(slug) ? "Remove Bookmark" : "Bookmark Article"}
        >
          <Star className={`w-6 h-6 transition-colors ${isFavorite(slug) ? 'fill-primary text-primary' : 'text-foreground/40'}`} />
        </button>
      </div>

      {speechState !== "idle" ? (
        <div className="bg-black/20 p-6 md:p-8 rounded-2xl border border-white/5 mb-8 relative">
           <div className="text-foreground/90 leading-loose font-serif text-xl space-y-6">
             {chunks.map((chunk, i) => (
               <p key={i} className={i === chunkIndex ? "text-foreground font-medium" : "text-foreground/40"}>
                 {i === chunkIndex ? renderHighlightedText(chunk, charIndex) : chunk}
               </p>
             ))}
           </div>
        </div>
      ) : (
        <div 
          className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:text-primary prose-a:text-primary hover:prose-a:text-primary-hover prose-strong:text-foreground prose-p:text-foreground/80 leading-loose"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      )}
    </>
  );
}
