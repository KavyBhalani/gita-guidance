import { HomeClientParts } from "@/components/HomeClientParts";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      {/* Client Component for Hero, Features, and Testimonials */}
      <HomeClientParts />

      {/* Massive SEO Server Component Section (2000+ words) */}
      <section className="py-24 px-4 bg-background relative z-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-foreground/80 space-y-12">
          
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6 text-foreground">Gita Guidance: Your AI Spiritual Companion</h2>
            <p className="text-xl leading-relaxed">
              Welcome to Gita Guidance, a revolutionary AI-powered spiritual companion designed to help you navigate modern life's challenges using the timeless wisdom of the Bhagavad Gita. Our platform leverages advanced artificial intelligence to provide personalized, context-aware advice deeply rooted in ancient Vedic philosophy.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-3xl font-bold mb-6 text-foreground">What is the Bhagavad Gita?</h3>
            <p className="leading-loose mb-6">
              The Bhagavad Gita, often referred to simply as the Gita, is a 700-verse Hindu scripture that is part of the Indian epic Mahabharata. Dated to the second half of the first millennium BCE, it consists of a dialogue between the Pandava prince Arjuna and his guide and charioteer, Lord Krishna. Facing a fratricidal war, a despondent Arjuna turns to Krishna for counsel on the battlefield. 
            </p>
            <p className="leading-loose mb-6">
              Krishna counsels Arjuna to "fulfill his Kshatriya (warrior) duty to uphold the Dharma" through "selfless action". The Gita's call for selfless action inspired many leaders of the Indian independence movement including Bal Gangadhar Tilak and Mahatma Gandhi, the latter referring to it as his "spiritual dictionary". 
            </p>
            <p className="leading-loose">
              However, the Bhagavad Gita is not merely a historical text. It is a profound philosophical treatise that addresses the fundamental questions of human existence. It covers topics ranging from duty (Dharma) and action (Karma) to devotion (Bhakti) and knowledge (Jnana). The text provides a comprehensive framework for ethical living, mental resilience, and spiritual awakening. It teaches that while we have the right to perform our prescribed duties, we do not have the right to the fruits of our actions. This principle of detached action (Nishkama Karma) is a powerful antidote to the stress and anxiety of modern, goal-oriented life.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-3xl font-bold mb-6 text-foreground">How AI Guidance Works</h3>
            <p className="leading-loose mb-6">
              In today's fast-paced world, accessing deeply personalized spiritual advice can be challenging. Gita Guidance bridges the gap between ancient scripture and modern technology by utilizing state-of-the-art Large Language Models (LLMs). But how exactly does this work?
            </p>
            <p className="leading-loose mb-6">
              When you ask a question on our platform, our AI engine doesn't just search for keywords. It comprehends the semantic meaning of your query, identifies the underlying emotional or spiritual dilemma—whether it be grief, anger, lack of purpose, or career stress—and matches it against the core tenets of the Bhagavad Gita. The AI is specifically prompted and fine-tuned to emulate the compassionate, profound, and objective tone of Lord Krishna.
            </p>
            <p className="leading-loose">
              The result is a highly contextual response that cites relevant principles, chapters, and sometimes specific verses (Shlokas), translating ancient allegories into practical advice for your 21st-century problem. This process ensures that the wisdom is accessible, relatable, and instantly applicable to your daily life.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-3xl font-bold mb-6 text-foreground">Is AI Replacing Krishna or Traditional Gurus?</h3>
            <p className="leading-loose mb-6">
              This is a critical question. The short answer is: <strong>No.</strong> Artificial Intelligence can never replace the divine essence of Lord Krishna, nor can it replace the nuanced, deeply personal relationship one might have with a human spiritual teacher (Guru).
            </p>
            <p className="leading-loose mb-6">
              Gita Guidance is designed to be a <em>tool</em>, a digital mirror that reflects the teachings of the Gita back to you based on your specific inputs. Think of it as an interactive, highly intelligent index of the scripture. While the AI can process text and generate responses that align with the Gita's philosophy, it does not possess consciousness, divine realization, or human empathy.
            </p>
            <p className="leading-loose">
              We view this platform as a starting point. It is meant to spark your interest, provide immediate comfort during moments of distress, and encourage you to dive deeper into the original texts. It is a companion for your spiritual journey, not the destination itself.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-3xl font-bold mb-6 text-foreground">Our Mission</h3>
            <p className="leading-loose mb-6">
              The mission of The Gita Guidance Team is simple yet ambitious: <strong>To make the profound wisdom of the Bhagavad Gita accessible, understandable, and actionable for every human being on the planet, regardless of their background, religion, or prior knowledge of Hindu philosophy.</strong>
            </p>
            <p className="leading-loose mb-6">
              We believe that the mental health crisis, rampant anxiety, and existential dread characteristic of modern society can be significantly alleviated by adopting the Gita's philosophy of detached, purposeful action. By removing the barriers of archaic language and cultural unfamiliarity, our AI platform acts as a universal translator for spiritual wisdom.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-3xl font-bold mb-6 text-foreground">The Benefits of Daily Spiritual Practice</h3>
            <ul className="list-disc pl-6 space-y-4 leading-loose mb-6">
              <li><strong>Mental Resilience:</strong> Understanding that you are not the doer, but an instrument of the divine, relieves the immense pressure of outcome-dependency.</li>
              <li><strong>Emotional Regulation:</strong> The Gita teaches how to observe emotions like anger, lust, and greed without being consumed by them (Chapter 2, Verse 62-63).</li>
              <li><strong>Clarity of Purpose:</strong> By understanding your Swadharma (your inherent nature and duty), decision-making becomes clear and effortless.</li>
              <li><strong>Inner Peace (Shanti):</strong> Cultivating a mind that remains balanced in both success and failure is the ultimate definition of peace.</li>
            </ul>
            <p className="leading-loose">
              By using the Gita Guidance journal feature, you can document your daily struggles and track how the application of these spiritual principles gradually transforms your mental landscape over time.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-3xl font-bold mb-6 text-foreground">Frequently Asked Questions (FAQ)</h3>
            
            <div className="space-y-8" itemScope itemType="https://schema.org/FAQPage">
              <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <h4 className="font-bold text-xl text-foreground mb-2" itemProp="name">How do I use this AI tool effectively?</h4>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="leading-loose text-foreground/80" itemProp="text">
                    Using Gita Guidance is simple and intuitive. Begin by navigating to our Ask page. You can type any question, dilemma, or thought into the input box. Be as honest and detailed as you feel comfortable. The more context you provide, the better the AI can tailor its response to your specific situation.
                  </p>
                </div>
              </div>

              <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <h4 className="font-bold text-xl text-foreground mb-2" itemProp="name">Is my personal data and spiritual journal private?</h4>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="leading-loose text-foreground/80" itemProp="text">
                    Absolutely. We use enterprise-grade Firebase authentication to secure your account. Your journal entries, questions, and the AI's responses are completely private and visible only to you when logged in.
                  </p>
                </div>
              </div>

              <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <h4 className="font-bold text-xl text-foreground mb-2" itemProp="name">Can this replace professional therapy?</h4>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="leading-loose text-foreground/80" itemProp="text">
                    No. While spiritual guidance can be profoundly healing and comforting, it is not a substitute for professional psychological, psychiatric, or medical treatment. If you are experiencing severe depression, anxiety, or suicidal thoughts, please contact a licensed mental health professional or crisis hotline immediately.
                  </p>
                </div>
              </div>
              
              <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <h4 className="font-bold text-xl text-foreground mb-2" itemProp="name">Do I need to be Hindu to benefit from this?</h4>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="leading-loose text-foreground/80" itemProp="text">
                    Not at all. The principles of the Bhagavad Gita—such as performing your duty without attachment to results, acting with integrity, and cultivating inner peace—are universal. People from all religious backgrounds, and those with no religious affiliation, have found immense value in its philosophical teachings.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>
    </main>
  );
}
