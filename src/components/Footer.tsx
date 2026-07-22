"use client";

import Link from "next/link";
import { Sparkles, Shield, Globe, MessageCircle, User, Heart, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { FeedbackWidget } from "./FeedbackWidget";

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubscribing) return;
    
    setIsSubscribing(true);
    try {
      // Lazy import to keep footer light until needed
      const { db } = await import("@/lib/firebase");
      const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
      
      const emailLower = email.trim().toLowerCase();
      
      // We use the email as the Document ID.
      // Because your Firebase rule says `allow create: if true;` and `allow update: if false;`
      // the first time they subscribe, it succeeds.
      // If they subscribe again, Firebase blocks the update, which elegantly prevents duplicates!
      await setDoc(doc(db, "newsletter_subscribers", emailLower), {
        email: emailLower,
        subscribedAt: serverTimestamp(),
        source: "footer_widget"
      });
      
      setEmail("");
      alert("Thank you! You have successfully subscribed to our wisdom newsletter.");
    } catch (error: unknown) {
      const fbError = error as { code?: string };
      if (fbError.code === 'permission-denied') {
        // They tried to update an existing subscription, meaning they are already on the list!
        setEmail("");
        alert("You are already subscribed to our newsletter! Thank you for your continued interest.");
      } else {
        console.error("Subscription error:", error);
        alert("Oops! Something went wrong. Please try again later.");
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur-md pt-16 pb-8 relative z-10 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span className="font-serif font-bold text-xl text-foreground">Gita Guidance</span>
            </Link>
            <p className="text-foreground/70 max-w-sm leading-relaxed mb-6">
              Your AI-powered spiritual companion. Navigate modern life's challenges with the timeless wisdom of the Bhagavad Gita.
            </p>
            
            <form onSubmit={handleSubscribe} className="max-w-sm mb-6">
              <h4 className="text-foreground font-semibold mb-3">Wisdom Newsletter</h4>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  required
                  className="flex-1 px-4 py-2 rounded-full bg-background border border-border text-foreground focus:outline-none focus:border-primary/50"
                />
                <button 
                  type="submit" 
                  disabled={isSubscribing}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
                >
                  {isSubscribing ? "Subscribing..." : "Subscribe"}
                </button>
              </div>
            </form>

            <FeedbackWidget />
          </div>
          
          <div>
            <h4 className="text-foreground font-semibold mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="/ask" className="text-foreground/60 hover:text-primary transition-colors">Seek Guidance</Link></li>
              <li><Link href="/journal" className="text-foreground/60 hover:text-primary transition-colors">Your Journal</Link></li>
              <li><Link href="/about" className="text-foreground/60 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-foreground/60 hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-6">Popular Topics</h4>
            <ul className="space-y-4">
              <li><Link href="/blog/overcoming-anger-with-the-bhagavad-gita" className="text-foreground/60 hover:text-primary transition-colors">Overcoming Anger</Link></li>
              <li><Link href="/blog/finding-your-life-purpose-dharma-according-to-krishna" className="text-foreground/60 hover:text-primary transition-colors">Finding Purpose</Link></li>
              <li><Link href="/blog/dealing-with-grief-and-loss-a-gita-perspective" className="text-foreground/60 hover:text-primary transition-colors">Dealing with Grief</Link></li>
              <li><Link href="/blog/how-to-manage-stress-and-anxiety-using-ancient-wisdom" className="text-foreground/60 hover:text-primary transition-colors">Managing Stress</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-6">Trust & Legal</h4>
            <ul className="space-y-4">
              <li><Link href="/trust/editorial-policy" className="text-foreground/60 hover:text-primary transition-colors">Editorial Policy</Link></li>
              <li><Link href="/trust/about-ai" className="text-foreground/60 hover:text-primary transition-colors">How Our AI Works</Link></li>
              <li><Link href="/privacy" className="text-foreground/60 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-foreground/60 hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-foreground/50 text-sm text-center md:text-left">
            © {currentYear} Gita Guidance. All rights reserved.
          </p>
          <div className="flex items-center gap-2 mt-4 md:mt-0 text-foreground/50 text-sm">
            <Shield className="w-4 h-4" /> Secured by Firebase
          </div>
        </div>
      </div>
    </footer>
  );
}
