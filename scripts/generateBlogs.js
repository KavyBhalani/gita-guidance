const fs = require('fs');
const path = require('path');

const API_ENDPOINT = "https://kavy1445-gita-guidance-api.hf.space/ask";

const blogTopics = [
  "Overcoming Anger with the Bhagavad Gita",
  "Finding Your Life Purpose (Dharma) according to Krishna",
  "Dealing with Grief and Loss: A Gita Perspective",
  "Leadership Lessons from the Bhagavad Gita",
  "How to Manage Stress and Anxiety using Ancient Wisdom",
  "The Concept of Karma: Action without Attachment",
  "Bhagavad Gita Chapter 1: The Yoga of Dejection (Arjuna Vishada Yoga)",
  "Bhagavad Gita Chapter 2: Sankhya Yoga Explained",
  "Building Better Relationships through Spiritual Wisdom",
  "How to Maintain Focus in a Distracted World",
  "Overcoming Depression: Insights from the Gita",
  "The Meaning of Success and Failure in Hinduism",
  "Balancing Work and Spiritual Life",
  "The Power of Meditation (Dhyana) in the Gita",
  "Understanding the Three Gunas: Sattva, Rajas, and Tamas",
  
  // New Topics for Batch 2 and onwards
  "Bhagavad Gita Chapter 3: Karma Yoga Explained",
  "The Concept of Reincarnation in the Bhagavad Gita",
  "How the Bhagavad Gita Defines True Happiness",
  "Detachment vs Indifference: What the Gita Teaches",
  "The Role of Faith (Shraddha) in Spiritual Growth",
  "Bhagavad Gita Chapter 4: Jnana Karma Sanyasa Yoga",
  "How to Overcome Fear Using Bhagavad Gita Wisdom",
  "The Meaning of Moksha (Liberation) in Hinduism",
  "Self-Control and Discipline: Lessons from Arjuna",
  "Bhagavad Gita Chapter 5: Karma Sanyasa Yoga",
  "The Nature of the Soul (Atman) in the Gita",
  "How to Make Difficult Decisions: The Gita Approach",
  "Bhagavad Gita Chapter 6: Dhyana Yoga (The Yoga of Meditation)",
  "Understanding Maya (Illusion) in the Bhagavad Gita",
  "The Concept of Yajna (Sacrifice) in Modern Life",
  "Bhagavad Gita Chapter 7: Jnana Vijnana Yoga",
  "Finding Inner Peace in a Chaotic World",
  "The Importance of Duty in the Bhagavad Gita",
  "Bhagavad Gita Chapter 8: Akshara Brahma Yoga",
  "How to Let Go of Ego According to Krishna",
  "The Concept of Bhakti Yoga (Devotion)",
  "Bhagavad Gita Chapter 9: Raja Vidya Raja Guhya Yoga",
  "Overcoming Jealousy and Envy: Gita Insights",
  "The Divine and Demoniac Natures in the Gita",
  "Bhagavad Gita Chapter 10: Vibhuti Yoga",
  "How to Deal with Toxic People: Ancient Wisdom",
  "The Concept of Time (Kala) in the Bhagavad Gita",
  "Bhagavad Gita Chapter 11: Vishvarupa Darshana Yoga",
  "The Universal Form of Krishna: A Deep Dive",
  "Bhagavad Gita Chapter 12: Bhakti Yoga Explained",
  "How to Cultivate Patience and Tolerance",
  "The Difference Between Mind and Intellect in the Gita",
  "Bhagavad Gita Chapter 13: Kshetra Kshetrajna Vibhaga Yoga",
  "Overcoming Laziness (Tamas) using the Gita",
  "The Ultimate Goal of Life According to the Bhagavad Gita"
];

async function generateArticle(topic) {
  const prompt = `Write a 1000-word SEO-optimized blog post about "${topic}" based on the Bhagavad Gita. Use professional, empathetic, and spiritual tone. Structure the post with a catchy Title, an Introduction, several <h2> and <h3> subheadings, practical applications, and a Conclusion. Return ONLY the raw markdown text for the blog post. Do not include any JSON wrappers or markdown code block ticks (\`\`\`) around the whole output.`;
  
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: prompt,
        language: "English",
        languageCode: "en"
      })
    });
    const data = await response.json();
    return data.answer || data.response || data.message || "Error generating content";
  } catch (error) {
    console.error("Error generating", topic, error);
    return "Error generating content";
  }
}

async function run() {
  const dir = path.join(__dirname, '..', 'src', 'content', 'blogs');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (let i = 0; i < blogTopics.length; i++) {
    const topic = blogTopics[i];
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const filePath = path.join(dir, `${slug}.md`);

    if (fs.existsSync(filePath)) {
      console.log(`⏭️ Skipping (already exists): ${slug}.md`);
      continue;
    }

    console.log(`Generating [${i+1}/${blogTopics.length}]: ${topic}`);
    const content = await generateArticle(topic);
    
    // Validate that the AI returned a real article (at least 1000 characters)
    if (content.length < 1000) {
      console.error(`❌ Failed to generate full article for: ${topic}. (Reason: AI Credit Limit / Timeout)`);
      continue; // Skip saving this file
    }
    
    const frontmatter = `---
title: "${topic.replace(/"/g, '\\"')}"
slug: "${slug}"
date: "${new Date().toISOString()}"
author: "The Gita Guidance Team"
tags: ["Bhagavad Gita", "Spirituality", "Self-Improvement"]
---

`;

    fs.writeFileSync(filePath, frontmatter + content);
    console.log(`✅ Saved: ${slug}.md`);
    
    // Wait a bit to not overwhelm the API
    await new Promise(r => setTimeout(r, 2000));
  }
}

run();
