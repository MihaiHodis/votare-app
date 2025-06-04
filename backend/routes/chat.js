const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
require('dotenv').config();

// Inițializăm clientul OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Rută POST pentru întrebări către GPT
router.post('/ask', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Mesajul este necesar' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [{ role: 'user', content: message }],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('Eroare GPT:', err);
    res.status(500).json({ error: 'Eroare la generarea răspunsului GPT' });
  }
});

module.exports = router;