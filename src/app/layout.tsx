import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://gita-guidance.vercel.app'),
  title: "Gita Guidance | AI Spiritual Companion",
  description: "Find clarity and inner peace through the ancient wisdom of the Bhagavad Gita, personalized by AI.",
  keywords: ["Bhagavad Gita", "Spiritual AI", "AI Therapy", "Hindu Philosophy", "Meditation", "Guidance", "Karma", "Dharma"],
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "Gita Guidance | AI Spiritual Companion",
    description: "Find clarity and inner peace through the ancient wisdom of the Bhagavad Gita.",
    siteName: "Gita Guidance",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gita Guidance | AI Spiritual Companion",
    description: "Find clarity and inner peace through the ancient wisdom of the Bhagavad Gita.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "url": "https://gita-guidance.vercel.app",
      "name": "Gita Guidance",
      "description": "AI-powered spiritual companion based on the Bhagavad Gita.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://gita-guidance.vercel.app/ask?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "name": "The Gita Guidance Team",
      "url": "https://gita-guidance.vercel.app",
      "logo": "https://gita-guidance.vercel.app/icon.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "gitaguidanceweb@gmail.com",
        "contactType": "customer support"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cinzel.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans transition-colors duration-500">
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <Navbar />
              {children}
              <Footer />
              <CookieConsent />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
