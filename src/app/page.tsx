"use client";

import Hero from "@/components/Hero";
import { BookOpen, Sparkles, Feather, Shield } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <main className="flex-1 flex flex-col">
      <Hero />
      
      {/* Features Section */}
      <section className="py-24 px-4 bg-background relative z-10">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-gray-100">{t.home.featuresTitle}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">{t.home.featuresSubtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: t.home.feature1Title, 
                desc: t.home.feature1Desc,
                icon: <Sparkles className="w-8 h-8 text-primary mb-4" />
              },
              { 
                title: t.home.feature2Title, 
                desc: t.home.feature2Desc,
                icon: <BookOpen className="w-8 h-8 text-primary mb-4" />
              },
              { 
                title: t.home.feature3Title, 
                desc: t.home.feature3Desc,
                icon: <Feather className="w-8 h-8 text-primary mb-4" />
              }
            ].map((feature, i) => (
              <div key={i} className="glass p-8 md:p-10 rounded-3xl text-center hover:-translate-y-2 transition-transform duration-500 border border-white/5 relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="font-serif text-2xl font-bold mb-4 text-gray-100">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-black/40 relative z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-gray-100">{t.home.testimonialsTitle}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">{t.home.testimonialsSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { quote: t.home.testimonial1Quote, author: t.home.testimonial1Author },
              { quote: t.home.testimonial2Quote, author: t.home.testimonial2Author },
              { quote: t.home.testimonial3Quote, author: t.home.testimonial3Author }
            ].map((testimonial, i) => (
              <div key={i} className="glass p-8 rounded-3xl border border-white/5 text-left">
                <div className="mb-6">
                  {[...Array(5)].map((_, idx) => (
                    <span key={idx} className="text-primary text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic leading-relaxed">&quot;{testimonial.quote}&quot;</p>
                <p className="text-primary font-semibold font-serif">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO & FAQ Section (For AdSense & Search Engines) */}
      <section className="py-24 px-4 bg-background relative z-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-gray-300">
          <h2 className="font-serif text-3xl font-bold mb-6 text-gray-100">Gita Guidance: Your Spiritual AI Companion</h2>
          <p className="mb-8 leading-relaxed">
            Welcome to Gita Guidance, a revolutionary AI-powered spiritual companion designed to help you navigate modern life's challenges using the timeless wisdom of the Bhagavad Gita. Our platform leverages advanced artificial intelligence to provide personalized, context-aware advice deeply rooted in ancient Vedic philosophy. Whether you are facing dilemmas in your career, relationships, or personal growth, our tool offers profound insights to guide your journey.
          </p>
          
          <h3 className="font-serif text-2xl font-bold mb-4 text-gray-100">How to Use This AI Tool</h3>
          <p className="mb-8 leading-relaxed">
            Using Gita Guidance is simple and intuitive. Begin by navigating to our "Ask" page. You can type any question, dilemma, or thought into the input box. For example, you might ask, "How do I deal with workplace stress?" or "What is my true purpose in life?" Our specialized AI engine analyzes your query and matches it against the teachings of Lord Krishna. Within seconds, you receive a detailed, customized response that bridges ancient wisdom with your contemporary situation. You can even click the audio button to have the guidance read aloud to you, creating a deeply immersive spiritual experience.
          </p>

          <h3 className="font-serif text-2xl font-bold mb-4 text-gray-100">Key Features</h3>
          <ul className="list-disc pl-6 mb-8 space-y-2 leading-relaxed">
            <li><strong>AI-Powered Insights:</strong> Contextual answers drawn directly from the philosophy of the Bhagavad Gita.</li>
            <li><strong>Personal Spiritual Journal:</strong> Automatically save your questions and the divine guidance you receive. Add your own private reflection notes to track your spiritual growth.</li>
            <li><strong>Multi-Language Support:</strong> Access wisdom in 11 different languages including English, Hindi, Gujarati, and Sanskrit.</li>
            <li><strong>Text-to-Speech Audio:</strong> Listen to the guidance with real-time text highlighting for an accessible, hands-free experience.</li>
            <li><strong>Offline Mode & Caching:</strong> Your journal entries are securely cached locally, ensuring you can read your past reflections even without an internet connection.</li>
          </ul>

          <h3 className="font-serif text-2xl font-bold mb-4 text-gray-100">Frequently Asked Questions (FAQ)</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-gray-200">Is this real Artificial Intelligence?</h4>
              <p className="leading-relaxed text-gray-400">Yes, Gita Guidance utilizes state-of-the-art Large Language Models (LLMs) that have been specifically instructed to align their responses with the philosophy, tone, and teachings of the Bhagavad Gita.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-200">Is my personal data and journal private?</h4>
              <p className="leading-relaxed text-gray-400">Absolutely. We use enterprise-grade Firebase authentication to secure your account. Your journal entries and reflection notes are completely private and tied securely to your unique user ID.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-200">Is this tool free to use?</h4>
              <p className="leading-relaxed text-gray-400">Yes, Gita Guidance is provided as a free tool to help spread spiritual awareness and provide peace of mind to seekers around the world.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-200">Who built this tool?</h4>
              <p className="leading-relaxed text-gray-400">This platform was developed by The Gita Guidance Team, a group of developers and spiritual enthusiasts dedicated to making ancient wisdom accessible to the modern world through technology. You can contact us at <a href="mailto:gitaguidanceweb@gmail.com" className="text-primary hover:underline">gitaguidanceweb@gmail.com</a>.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-background/80 backdrop-blur-md pt-16 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <span className="font-serif font-bold text-xl text-gray-100">{t.navbar.title}</span>
              </Link>
              <p className="text-gray-400 max-w-sm leading-relaxed mb-6">
                {t.home.footerDesc}
              </p>
            </div>
            
            <div>
              <h4 className="text-gray-100 font-semibold mb-6">{t.home.platform}</h4>
              <ul className="space-y-4">
                <li><Link href="/ask" className="text-gray-400 hover:text-primary transition-colors">{t.home.seekGuidance}</Link></li>
                <li><Link href="/journal" className="text-gray-400 hover:text-primary transition-colors">{t.home.yourJournal}</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-primary transition-colors">{t.home.aboutUs}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-gray-100 font-semibold mb-6">{t.home.legal}</h4>
              <ul className="space-y-4">
                <li><Link href="/privacy" className="text-gray-400 hover:text-primary transition-colors">{t.home.privacyPolicy || "Privacy Policy"}</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-primary transition-colors">{t.home.termsOfService || "Terms of Service"}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-gray-100 font-semibold mb-6">Resources</h4>
              <ul className="space-y-4">
                <li><Link href="/blog" className="text-gray-400 hover:text-primary transition-colors">Wisdom Blog</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-500 text-sm text-center md:text-left">
              {t.home.rightsReserved.replace("{year}", currentYear.toString())}
            </p>
            <div className="flex items-center gap-2 mt-4 md:mt-0 text-gray-500 text-sm">
              <Shield className="w-4 h-4" /> {t.home.securedByFirebase}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
