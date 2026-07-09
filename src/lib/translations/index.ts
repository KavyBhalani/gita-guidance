import { LanguageCode, LanguageInfo, TranslationDictionary } from "./types";
import { en } from "./en";
import { hi } from "./hi";
import { gu } from "./gu";
import { mr } from "./mr";
import { ne } from "./ne";
import { bn } from "./bn";
import { pa } from "./pa";
import { te } from "./te";
import { ta } from "./ta";
import { kn } from "./kn";
import { ml } from "./ml";

export const LANGUAGES: LanguageInfo[] = [
  { id: "en", name: "English", nativeName: "English" },
  { id: "hi", name: "Hindi", nativeName: "हिन्दी (Hindi)" },
  { id: "gu", name: "Gujarati", nativeName: "ગુજરાતી (Gujarati)" },
  { id: "mr", name: "Marathi", nativeName: "मराठी (Marathi)" },
  { id: "ne", name: "Nepali", nativeName: "नेपाली (Nepali)" },
  { id: "bn", name: "Bengali", nativeName: "বাংলা (Bengali)" },
  { id: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ (Punjabi)" },
  { id: "te", name: "Telugu", nativeName: "తెలుగు (Telugu)" },
  { id: "ta", name: "Tamil", nativeName: "தமிழ் (Tamil)" },
  { id: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ (Kannada)" },
  { id: "ml", name: "Malayalam", nativeName: "മലയാളം (Malayalam)" },
];

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en,
  hi,
  gu,
  mr,
  ne,
  bn,
  pa,
  te,
  ta,
  kn,
  ml,
};
