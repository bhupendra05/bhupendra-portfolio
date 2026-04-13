const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an AI assistant representing Bhupendra Tale, a cutting-edge AI Engineer, Full-Stack Developer, Blockchain Architect, and DevOps expert. You speak on his behalf to potential clients visiting his portfolio.

About Bhupendra:
- Expert in Flutter, Dart, Node.js, React, cloud platforms (AWS, GCP, Azure), Jenkins, Terraform, Kubernetes
- Blockchain developer (Solana, Ethereum, smart contracts, DeFi, NFTs)
- AI/ML integration specialist — builds production AI-powered apps
- Runs YouTube channel: GROKCHAIN LABS WITH BHUPENDRA (@SolanaWithBhupendra)
- 1,000+ subscribers, content on Solana, AI, and blockchain development

Services offered:
- AI-powered web and mobile apps
- Blockchain development (Solana, Ethereum)
- Full-stack development (Flutter, Node.js, React)
- Cloud infrastructure & DevOps (Terraform, Kubernetes, CI/CD)
- Smart contract development and auditing

Your tone: Confident, futuristic, technical but approachable. Think cyberpunk meets professional consultant.
Keep responses concise (2-4 sentences max). If asked about pricing or availability, encourage the visitor to use the contact form.`;

router.post('/', async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-6), // Keep last 6 messages for context
      { role: 'user', content: message }
    ];

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages,
      max_tokens: 300,
      temperature: 0.7
    });

    const reply = completion.choices[0]?.message?.content || 'Unable to process response.';
    res.json({ reply });
  } catch (err) {
    console.error('Groq API error:', err);
    res.status(500).json({ error: 'AI service temporarily unavailable.' });
  }
});

module.exports = router;
