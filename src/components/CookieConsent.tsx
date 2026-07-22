"use client";

import { useState, useEffect } from "react";
import { X, Shield } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "accepted");
    // Implementation for Google Consent Mode v2 would go here
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
    }
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie_consent", "declined");
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-background/95 backdrop-blur-xl border-t border-border shadow-2xl transform transition-transform duration-500 ease-in-out">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1 flex gap-4">
          <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary flex-shrink-0 mt-1">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-foreground font-semibold mb-1">
              {t.home?.cookieTitle || "We value your privacy"}
            </h3>
            <p className="text-foreground/70 text-sm leading-relaxed max-w-3xl">
              {t.home?.cookieDesc || "We use cookies to enhance your browsing experience, serve personalized ads, and analyze our traffic. By clicking \"Accept All\", you consent to our use of cookies in accordance with Google Consent Mode v2 requirements."} 
              <Link href="/privacy" className="text-primary hover:underline ml-1">
                Read our Privacy Policy.
              </Link>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0 justify-end">
          <button
            onClick={declineCookies}
            className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-white/5 rounded-full transition-colors border border-border"
          >
            {t.home?.cookieDecline || "Decline"}
          </button>
          <button
            onClick={acceptCookies}
            className="px-6 py-2 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary-hover rounded-full transition-colors shadow-lg"
          >
            {t.home?.cookieAccept || "Accept All"}
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-2 text-foreground/50 hover:text-foreground hover:bg-white/5 rounded-full transition-colors ml-2"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
