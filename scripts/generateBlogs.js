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
  // We can add 35 more here
];

// Generate exactly 50 topics
for (let i = 16; i <= 50; i++) {
  blogTopics.push(`Spiritual Wisdom from the Bhagavad Gita - Lesson ${i}`);
}

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

  for (let i = 3; i < blogTopics.length; i++) {
    const topic = blogTopics[i];
    console.log(`Generating: ${topic}`);
    const content = await generateArticle(topic);
    
    // Validate that the AI returned a real article (at least 1000 characters)
    if (content.length < 1000) {
      console.error(`❌ Failed to generate full article for: ${topic}. (Reason: AI Credit Limit / Timeout)`);
      continue; // Skip saving this file
    }
    
    // Create a slug
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const frontmatter = `---
title: "${topic.replace(/"/g, '\\"')}"
slug: "${slug}"
date: "${new Date().toISOString()}"
author: "The Gita Guidance Team"
tags: ["Bhagavad Gita", "Spirituality", "Self-Improvement"]
---

`;

    fs.writeFileSync(path.join(dir, `${slug}.md`), frontmatter + content);
    console.log(`✅ Saved: ${slug}.md`);
    
    // Wait a bit to not overwhelm the API
    await new Promise(r => setTimeout(r, 2000));
  }
}

run();
