"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { LanguageCode, LanguageInfo, TranslationDictionary } from "@/lib/translations/types";
import { translations, LANGUAGES } from "@/lib/translations";

interface LanguageContextType {
  language: LanguageCode;
  languageInfo: LanguageInfo;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationDictionary;
  LANGUAGES: LanguageInfo[];
}

const defaultLanguageCode: LanguageCode = "en";

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguageCode,
  languageInfo: LANGUAGES[0],
  setLanguage: () => {},
  t: translations[defaultLanguageCode],
  LANGUAGES,
});

const ALL_LANGUAGE_CODES: LanguageCode[] = LANGUAGES.map((l) => l.id);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(defaultLanguageCode);

  useEffect(() => {
    const savedLang = localStorage.getItem("gita-language") as LanguageCode;
    if (savedLang && ALL_LANGUAGE_CODES.includes(savedLang)) {
      setLanguageState(savedLang);
      document.documentElement.lang = savedLang;
    } else {
      document.documentElement.lang = defaultLanguageCode;
    }
  }, []);

  const setLanguage = (newLang: LanguageCode) => {
    if (!ALL_LANGUAGE_CODES.includes(newLang)) return;
    setLanguageState(newLang);
    localStorage.setItem("gita-language", newLang);
    document.documentElement.lang = newLang;
  };

  const languageInfo = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];
  const t = translations[language] || translations[defaultLanguageCode];

  return (
    <LanguageContext.Provider value={{ language, languageInfo, setLanguage, t, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
