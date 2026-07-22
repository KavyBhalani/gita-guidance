"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, setDoc, deleteDoc, onSnapshot, collection } from "firebase/firestore";

const STORAGE_KEY = "gita_guidance_favorite_blogs";

export function useFavoriteBlogs() {
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return [];
  });
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        // Load from local storage if logged out
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            setFavoriteSlugs(JSON.parse(stored));
          } else {
            setFavoriteSlugs([]);
          }
        } catch (e) {
          console.error("Failed to parse local favorite blogs", e);
        }
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to custom event for cross-component sync on the same page
  useEffect(() => {
    const handleSync = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavoriteSlugs(JSON.parse(stored));
      }
    };
    window.addEventListener("favoriteBlogsUpdated", handleSync);
    return () => window.removeEventListener("favoriteBlogsUpdated", handleSync);
  }, []);

  // Firebase listener
  useEffect(() => {
    if (!user) return;

    const favoritesRef = collection(db, "users", user.uid, "favoriteBlogs");
    const unsubscribe = onSnapshot(favoritesRef, (snapshot) => {
      const firebaseSlugs = snapshot.docs.map(doc => doc.id);
      
      const stored = localStorage.getItem(STORAGE_KEY);
      const localSlugs: string[] = stored ? JSON.parse(stored) : [];
      
      const mergedSlugs = Array.from(new Set([...firebaseSlugs, ...localSlugs]));
      
      setFavoriteSlugs(mergedSlugs);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedSlugs));
      
      // Attempt to heal Firebase silently if local has items missing in DB
      const missingInFirebase = localSlugs.filter(slug => !firebaseSlugs.includes(slug));
      missingInFirebase.forEach(async (slug) => {
        try {
          const docRef = doc(db, "users", user.uid, "favoriteBlogs", slug);
          await setDoc(docRef, { addedAt: new Date().toISOString() });
        } catch (e) {}
      });

      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching favorite blogs:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleFavorite = async (slug: string) => {
    const isCurrentlyFavorite = favoriteSlugs.includes(slug);
    
    // Optimistic update for UI
    const newSlugs = isCurrentlyFavorite 
      ? favoriteSlugs.filter(s => s !== slug)
      : [...favoriteSlugs, slug];
      
    setFavoriteSlugs(newSlugs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSlugs));
    window.dispatchEvent(new Event("favoriteBlogsUpdated"));

    if (user) {
      // Firebase update
      try {
        const docRef = doc(db, "users", user.uid, "favoriteBlogs", slug);
        if (isCurrentlyFavorite) {
          await deleteDoc(docRef);
        } else {
          // Store addedAt timestamp just in case we want to sort later
          await setDoc(docRef, { 
            addedAt: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error("Failed to toggle favorite in Firebase, falling back to local:", error);
      }
    }
    
    // Always update Local Storage as a fallback/sync mechanism
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSlugs));
  };

  const isFavorite = (slug: string) => favoriteSlugs.includes(slug);

  return { favoriteSlugs, toggleFavorite, isFavorite, isLoading };
}
