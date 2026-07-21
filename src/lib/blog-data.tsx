export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: React.ReactNode;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "ancient-wisdom-modern-stress",
    title: "How Ancient Wisdom Applies to Modern Stress",
    date: "July 20, 2026",
    excerpt: "Discover how the teachings of the Bhagavad Gita can provide a profound anchor of peace in today's fast-paced, high-stress world.",
    content: (
      <>
        <p className="mb-6">
          In an era characterized by constant connectivity, endless notifications, and the relentless pursuit of professional success, stress has become an epidemic. We often look to modern psychology or self-help gurus for a solution, but some of the most effective antidotes to anxiety were written thousands of years ago in the Bhagavad Gita.
        </p>
        <h3 className="text-2xl font-serif font-bold text-foreground mt-8 mb-4">Detachment from Outcomes</h3>
        <p className="mb-6">
          One of the core teachings Lord Krishna imparts to Arjuna is the concept of <em>Nishkama Karma</em>—action performed without any expectation of fruits or results. In our modern workplace, we often tie our self-worth directly to our output, promotions, or social media likes. When we shift our focus from the "result" to the "process," we instantly alleviate a massive burden of performance anxiety. We learn to do our best simply because it is our duty, not because we are desperately grasping for a reward.
        </p>
        <h3 className="text-2xl font-serif font-bold text-foreground mt-8 mb-4">The Illusion of Control</h3>
        <p className="mb-6">
          Modern stress often stems from our desire to control every aspect of our environment. The Gita teaches that while we have control over our actions, we do not have control over the universe's grand design. Embracing this cosmic reality doesn't lead to fatalism; rather, it leads to a profound sense of surrender and peace. When we accept that we cannot control the macroeconomic climate, the actions of our peers, or the algorithms of the internet, we free up immense mental energy.
        </p>
        <h3 className="text-2xl font-serif font-bold text-foreground mt-8 mb-4">Practical Application</h3>
        <p className="mb-6">
          The next time you feel overwhelmed by an impending deadline or a complex life decision, pause. Ask yourself: "Am I doing my duty to the best of my ability?" If the answer is yes, then let go of the rest. By integrating these ancient philosophical pillars into our daily routines, we can transform our modern stress into a catalyst for spiritual awakening.
        </p>
      </>
    )
  },
  {
    slug: "dharma-in-age-of-ai",
    title: "Understanding Dharma in the Age of AI",
    date: "July 21, 2026",
    excerpt: "As Artificial Intelligence reshapes our careers and societies, how do we find and fulfill our true purpose (Dharma)?",
    content: (
      <>
        <p className="mb-6">
          The concept of <em>Dharma</em> is central to Vedic philosophy. It translates roughly to "duty," "righteousness," or "one's true path." For millennia, human beings found their Dharma in traditional roles: the teacher, the warrior, the merchant, the farmer. But what happens when Artificial Intelligence begins to automate the very tasks that once defined our identities?
        </p>
        <h3 className="text-2xl font-serif font-bold text-foreground mt-8 mb-4">Redefining Human Purpose</h3>
        <p className="mb-6">
          As AI takes over repetitive cognitive tasks, humanity is being forced to evolve. Our Dharma is no longer just about economic output; it is shifting toward what makes us uniquely human: empathy, creativity, philosophical inquiry, and spiritual connection. Lord Krishna advised Arjuna to follow his own nature (Svadharma) rather than poorly imitating someone else's. In the age of AI, our Svadharma is to cultivate our consciousness.
        </p>
        <h3 className="text-2xl font-serif font-bold text-foreground mt-8 mb-4">Using Technology for Spiritual Growth</h3>
        <p className="mb-6">
          Technology itself is neither inherently good nor bad—it is a tool. Just as a sword can be used for defense or destruction, AI can be used to distract us or elevate us. Platforms like Gita Guidance use AI not to replace human thought, but to serve as a mirror, reflecting ancient wisdom back to us in a format we can easily understand. By using technology to explore our inner landscapes, we are integrating AI into our spiritual practice.
        </p>
        <h3 className="text-2xl font-serif font-bold text-foreground mt-8 mb-4">The Future Path</h3>
        <p className="mb-6">
          The ultimate goal remains unchanged: self-realization. As the external world accelerates and changes with unprecedented speed, the internal world remains a sanctuary of eternal truth. Finding your Dharma today means finding your anchor in the divine, using whatever tools—ancient or modern—are available to you.
        </p>
      </>
    )
  },
  {
    slug: "beginners-guide-bhagavad-gita",
    title: "A Beginner's Guide to the Bhagavad Gita",
    date: "July 22, 2026",
    excerpt: "Start your spiritual journey here. A brief overview of the context, characters, and core philosophy of this timeless epic.",
    content: (
      <>
        <p className="mb-6">
          For many, the Bhagavad Gita can seem daunting. It is a 700-verse Hindu scripture that is part of the epic Mahabharata. However, its core message is surprisingly accessible and profoundly relevant to anyone seeking meaning in life.
        </p>
        <h3 className="text-2xl font-serif font-bold text-foreground mt-8 mb-4">The Setting: The Battlefield of the Mind</h3>
        <p className="mb-6">
          The Gita takes place on the battlefield of Kurukshetra, just before a massive war is about to begin. The great warrior Arjuna looks across the battlefield and sees his own relatives, teachers, and friends on the opposing side. Overcome with grief and moral confusion, he drops his weapons and refuses to fight. His charioteer, who is secretly Lord Krishna (the supreme divine being), proceeds to counsel him.
        </p>
        <p className="mb-6">
          While the setting is a physical war, it is widely understood as an allegory for the internal war we all face: the struggle between our higher spiritual aspirations and our lower ego-driven desires.
        </p>
        <h3 className="text-2xl font-serif font-bold text-foreground mt-8 mb-4">The Three Paths (Yogas)</h3>
        <p className="mb-6">
          Krishna outlines three primary paths to spiritual liberation:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li><strong>Karma Yoga (The Path of Action):</strong> Performing your duties selflessly without attachment to the results.</li>
          <li><strong>Jnana Yoga (The Path of Knowledge):</strong> Using intellect and philosophical inquiry to distinguish between the temporary material world and the eternal soul.</li>
          <li><strong>Bhakti Yoga (The Path of Devotion):</strong> Cultivating a deep, unconditional love and surrender to the Divine.</li>
        </ul>
        <h3 className="text-2xl font-serif font-bold text-foreground mt-8 mb-4">Where to Start?</h3>
        <p className="mb-6">
          You don't need to read the Gita front to back to benefit from it. Many seekers start by meditating on a single verse or using tools like Gita Guidance to ask specific questions. The wisdom of the Gita is not just to be read; it is to be lived. As you face your own daily "battles," let the teachings of Krishna be your charioteer.
        </p>
      </>
    )
  }
];
