import Hero from "@/components/Hero";
import { BookOpen, Sparkles, Feather, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <Hero />
      
      {/* Features Section */}
      <section className="py-24 px-4 bg-background relative z-10">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-gray-100">Divine Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Discover how our platform brings ancient wisdom to your modern life.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Personalized Guidance", 
                desc: "Receive tailored wisdom based on your unique life situations, emotionally attuned to your struggles.",
                icon: <Sparkles className="w-8 h-8 text-primary mb-4" />
              },
              { 
                title: "Ancient Authenticity", 
                desc: "Rooted deeply in the authentic translations and verses of the Bhagavad Gita.",
                icon: <BookOpen className="w-8 h-8 text-primary mb-4" />
              },
              { 
                title: "Meditative Experience", 
                desc: "A calm, distraction-free environment designed for reflection, peace, and spiritual growth.",
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
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-gray-100">Voices of Clarity</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">See how others have found peace through divine guidance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { quote: "I was overwhelmed with anxiety about my career. The guidance I received felt like a warm, divine hug.", author: "Priya S." },
              { quote: "It doesn't feel like talking to a bot. It feels like consulting an ancient sage who truly understands human nature.", author: "David M." },
              { quote: "The way the answers are revealed, word by word, makes me slow down and actually absorb the wisdom.", author: "Arjun K." }
            ].map((testimonial, i) => (
              <div key={i} className="glass p-8 rounded-3xl border border-white/5 text-left">
                <div className="mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-primary text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic leading-relaxed">&quot;{testimonial.quote}&quot;</p>
                <p className="text-primary font-semibold font-serif">— {testimonial.author}</p>
              </div>
            ))}
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
                <span className="font-serif font-bold text-xl text-gray-100">Gita Guidance</span>
              </Link>
              <p className="text-gray-400 max-w-sm leading-relaxed mb-6">
                A digital spiritual sanctuary powered by AI. Find clarity, overcome doubts, and connect with eternal wisdom.
              </p>
            </div>
            
            <div>
              <h4 className="text-gray-100 font-semibold mb-6">Platform</h4>
              <ul className="space-y-4">
                <li><Link href="/ask" className="text-gray-400 hover:text-primary transition-colors">Seek Guidance</Link></li>
                <li><Link href="/journal" className="text-gray-400 hover:text-primary transition-colors">Your Journal</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-primary transition-colors">About Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-gray-100 font-semibold mb-6">Legal</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Gita Guidance. All rights reserved.
            </p>
            <div className="flex items-center gap-2 mt-4 md:mt-0 text-gray-500 text-sm">
              <Shield className="w-4 h-4" /> Secured by Firebase
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
