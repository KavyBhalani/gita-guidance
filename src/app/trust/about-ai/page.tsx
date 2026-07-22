import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Our AI Works | Gita Guidance",
  description: "Transparency on how our AI is trained, its limitations, and our commitment to authenticity.",
};

export default function AboutAIPage() {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 mt-12 mb-20 relative z-10">
      <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8 text-primary">How Our AI Works</h1>
      
      <div className="space-y-8 text-foreground/80 leading-loose text-lg">
        <section>
          <h2 className="font-serif text-2xl font-bold mb-4 text-foreground">Our Core Technology</h2>
          <p>
            Gita Guidance utilizes advanced Large Language Models (LLMs) that have been carefully prompted and fine-tuned to reflect the philosophical principles of the Bhagavad Gita. When you submit a question, our system processes the semantic meaning of your query, identifies the underlying emotional or spiritual dilemma, and searches its trained corpus for relevant teachings from the Gita.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold mb-4 text-foreground">Accuracy and Hallucinations</h2>
          <p>
            While we strive for the highest degree of accuracy, it is important to acknowledge that AI is not infallible. Large Language Models can occasionally suffer from "hallucinations"—generating information that seems plausible but is factually incorrect or philosophically inconsistent.
          </p>
          <p className="mt-4">
            We highly recommend treating the AI's responses as a starting point for contemplation rather than an absolute truth. Always refer back to authentic translations and commentaries of the Bhagavad Gita for deep study.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold mb-4 text-foreground">Data Privacy</h2>
          <p>
            Your spiritual inquiries are deeply personal. We do not use your individual chat data to train our foundation models. Your journal entries are secured using Firebase Authentication and are visible only to you.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold mb-4 text-foreground">Not a Substitute for Human Care</h2>
          <p>
            The guidance provided by our AI is meant for spiritual comfort, self-reflection, and philosophical exploration. It is <strong>not</strong> a substitute for professional psychological counseling, therapy, or medical advice. If you are experiencing severe mental health distress, please contact a licensed professional immediately.
          </p>
        </section>
      </div>
    </main>
  );
}
