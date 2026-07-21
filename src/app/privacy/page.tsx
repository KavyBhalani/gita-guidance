import React from "react";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="flex-1 overflow-hidden relative py-20 px-4">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 glass p-8 md:p-12 rounded-3xl border border-white/5 shadow-lg">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Shield className="w-5 h-5" />
            <span>Legal</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Privacy Policy
          </h1>
          <p className="text-foreground/60 text-lg">
            Last Updated: July 2026
          </p>
        </div>

        <div className="space-y-8 text-foreground/80 leading-relaxed text-lg">
          <p>
            The Gita Guidance Team ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by Gita Guidance.
          </p>

          <h2 className="text-2xl font-serif font-bold text-foreground mt-8 mb-4">1. Information We Collect</h2>
          <p>
            When you register for an account, we collect your email address and basic profile information provided through Firebase Authentication. If you use our journaling features, we store your saved questions, AI-generated guidance, and personal reflection notes securely in our database.
          </p>

          <h2 className="text-2xl font-serif font-bold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            The information we collect is used to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Provide, operate, and maintain our application.</li>
            <li>Allow you to access your personal spiritual journal across multiple devices.</li>
            <li>Improve, personalize, and expand our services.</li>
            <li>Understand and analyze how you use our tool to enhance the AI guidance experience.</li>
          </ul>

          <h2 className="text-2xl font-serif font-bold text-foreground mt-8 mb-4">3. Data Storage and Security</h2>
          <p>
            Your data is stored securely using Google Firebase. We employ enterprise-grade security measures to protect your personal information and journal entries. Additionally, your recent chats are cached locally on your device (`localStorage`) to provide offline access and faster loading times. This local data remains on your personal device.
          </p>

          <h2 className="text-2xl font-serif font-bold text-foreground mt-8 mb-4">4. Third-Party Services</h2>
          <p>
            Our application relies on third-party services, including Google AdSense and OpenAI (or similar LLM providers), to process AI interactions and display advertisements. These third parties may use cookies, web beacons, or similar technologies to collect information about your interactions with our app for analytical or advertising purposes.
          </p>

          <h2 className="text-2xl font-serif font-bold text-foreground mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, you can contact The Gita Guidance Team at <a href="mailto:gitaguidanceweb@gmail.com" className="text-primary hover:underline">gitaguidanceweb@gmail.com</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
