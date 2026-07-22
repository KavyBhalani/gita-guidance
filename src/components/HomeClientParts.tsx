"use client";

import Hero from "@/components/Hero";
import { BookOpen, Sparkles, Feather } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function HomeClientParts() {
  const { t } = useLanguage();

  return (
    <>
      <Hero />
      
      {/* Features Section */}
      <section className="py-24 px-4 bg-background relative z-10">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-foreground">{t.home.featuresTitle}</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto text-lg">{t.home.featuresSubtitle}</p>
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
                <h3 className="font-serif text-2xl font-bold mb-4 text-foreground">{feature.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-black/40 relative z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-foreground">{t.home.testimonialsTitle}</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto text-lg">{t.home.testimonialsSubtitle}</p>
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
                <p className="text-foreground/80 mb-6 italic leading-relaxed">&quot;{testimonial.quote}&quot;</p>
                <p className="text-primary font-semibold font-serif">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
