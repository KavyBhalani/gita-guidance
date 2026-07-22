import React from "react";
import { Mail, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="flex-1 overflow-hidden relative py-20 px-4">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10 glass p-8 md:p-12 rounded-3xl border border-white/5 shadow-lg text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-6">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Contact Us
          </h1>
          <p className="text-foreground/70 text-lg leading-relaxed">
            We would love to hear from you. Whether you have questions about the platform, feedback on the AI guidance, or partnership inquiries, please feel free to reach out.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center gap-4 transition-colors hover:bg-white/10">
          <Mail className="w-8 h-8 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Email The Gita Guidance Team</h2>
          <p className="text-foreground/60 mb-2">We typically respond within 24-48 hours.</p>
          <a 
            href="mailto:gitaguidanceweb@gmail.com" 
            className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            gitaguidanceweb@gmail.com
          </a>
        </div>
      </div>
    </main>
  );
}
