"use client";

import { useState, useEffect } from "react";
import { Volume2, Pause, Play, Star } from "lucide-react";
import { useFavoriteBlogs } from "@/hooks/useFavoriteBlogs";

interface BlogActionsProps {
  slug: string;
  rawText: string;
}

export function BlogActions({ slug, rawText }: BlogActionsProps) {
  const [speechState, setSpeechState] = useState<"idle" | "playing" | "paused">("idle");
  const { isFavorite, toggleFavorite } = useFavoriteBlogs();

  // Handle Speech cleanup
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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

    // Start speaking
    window.speechSynthesis.cancel(); // Clear any existing speech

    // Clean up text before speaking (strip markdown)
    const cleanText = rawText.replace(/<[^>]*>?/gm, '').replace(/[#*_\-~`\[\]]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Optional: Try to set voice to a clear English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes("en-US") && v.name.includes("Google"));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      setSpeechState("idle");
    };

    utterance.onerror = (e) => {
      console.error("Speech synthesis error", e);
      setSpeechState("idle");
    };

    window.speechSynthesis.speak(utterance);
    setSpeechState("playing");
  };

  const handleToggleFavorite = async () => {
    await toggleFavorite(slug);
  };

  return (
    <div className="flex items-center gap-3">
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
        title="Bookmark"
      >
        <Star className={`w-6 h-6 transition-colors ${isFavorite(slug) ? 'fill-primary text-primary' : 'text-foreground/40'}`} />
      </button>
    </div>
  );
}
