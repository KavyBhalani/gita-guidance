"use client";

import { useState, useEffect } from "react";
import { Volume2, Pause, Play, Star, Square } from "lucide-react";
import { useFavoriteBlogs } from "@/hooks/useFavoriteBlogs";

interface Block {
  html: string;
  text: string;
}

interface BlogClientContentProps {
  slug: string;
  blocks: Block[];
}

export function BlogClientContent({ slug, blocks }: BlogClientContentProps) {
  const [speechState, setSpeechState] = useState<"idle" | "playing" | "paused">("idle");
  const [chunkIndex, setChunkIndex] = useState<number>(-1);
  const { isFavorite, toggleFavorite } = useFavoriteBlogs();

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const playChunk = (index: number) => {
    if (index >= blocks.length) {
      setSpeechState("idle");
      setChunkIndex(-1);
      return;
    }
    
    // Skip empty chunks
    if (!blocks[index].text.trim()) {
      playChunk(index + 1);
      return;
    }

    setChunkIndex(index);
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(blocks[index].text);
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes("en-US") && v.name.includes("Google"));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => {
      playChunk(index + 1);
    };

    utterance.onerror = (e) => {
      console.error("Speech synthesis error", e);
      setSpeechState("idle");
      setChunkIndex(-1);
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

    setSpeechState("playing");
    playChunk(0);
  };

  const handleStopListen = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeechState("idle");
    setChunkIndex(-1);
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(slug);
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

      <div className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:text-primary prose-a:text-primary hover:prose-a:text-primary-hover prose-strong:text-foreground prose-p:text-foreground/80 leading-loose">
        {blocks.map((block, i) => (
          <div 
            key={i}
            className={`transition-all duration-300 ${
              speechState !== "idle" 
                ? i === chunkIndex 
                  ? "opacity-100 scale-[1.02] transform origin-left drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
                  : "opacity-30 blur-[1px]" 
                : "opacity-100"
            }`}
            dangerouslySetInnerHTML={{ __html: block.html }}
          />
        ))}
      </div>
    </>
  );
}
