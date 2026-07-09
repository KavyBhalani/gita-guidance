import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
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
  title: "Gita Guidance | AI Spiritual Companion",
  description: "Find clarity and inner peace through the ancient wisdom of the Bhagavad Gita, personalized by AI.",
  keywords: ["Bhagavad Gita", "Spiritual AI", "AI Therapy", "Hindu Philosophy", "Meditation", "Guidance", "Karma", "Dharma"],
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
      <body className="min-h-screen flex flex-col font-sans transition-colors duration-500">
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <Navbar />
              {children}
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
