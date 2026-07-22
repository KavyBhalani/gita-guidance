"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, Pause, Play, Star, Square } from "lucide-react";
import { useFavoriteBlogs } from "@/hooks/useFavoriteBlogs";

interface BlogClientContentProps {
  slug: string;
  htmlContent: string;
}

export function BlogClientContent({ slug, htmlContent }: BlogClientContentProps) {
  const [speechState, setSpeechState] = useState<"idle" | "playing" | "paused">("idle");
  const [chunkIndex, setChunkIndex] = useState<number>(-1);
  const { isFavorite, toggleFavorite } = useFavoriteBlogs();
  const containerRef = useRef<HTMLDivElement>(null);
  const [blocks, setBlocks] = useState<HTMLElement[]>([]);

  // Extract top-level elements for chunking
  useEffect(() => {
    if (containerRef.current) {
      const elements = Array.from(containerRef.current.children) as HTMLElement[];
      setBlocks(elements);
    }
  }, [htmlContent, speechState]); // Re-run when entering speech mode

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
    
    const text = blocks[index].innerText;
    
    // Skip empty chunks
    if (!text || !text.trim()) {
      playChunk(index + 1);
      return;
    }

    setChunkIndex(index);
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
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
    setTimeout(() => {
      // Need a slight delay to ensure DOM is ready if we unmounted anything
      playChunk(0);
    }, 50);
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

  // Dynamically apply styles to children based on speech state
  useEffect(() => {
    if (blocks.length === 0) return;
    
    blocks.forEach((el, i) => {
      el.style.transition = "all 0.3s ease-in-out";
      
      if (speechState !== "idle") {
        if (i === chunkIndex) {
          el.style.opacity = "1";
          el.style.transform = "scale(1.02)";
          el.style.transformOrigin = "left center";
          el.style.filter = "drop-shadow(0 0 15px rgba(245,158,11,0.2))";
        } else {
          el.style.opacity = "0.3";
          el.style.transform = "scale(1)";
          el.style.filter = "blur(1px)";
        }
      } else {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.filter = "none";
      }
    });
  }, [chunkIndex, speechState, blocks]);

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

      <div 
        ref={containerRef}
        className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:text-primary prose-a:text-primary hover:prose-a:text-primary-hover prose-strong:text-foreground prose-p:text-foreground/80 leading-loose"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </>
  );
}
