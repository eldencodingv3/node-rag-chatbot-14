require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { initVectorStore } = require('./vectorStore');
const { chat } = require('./chat');

const app = express();
const PORT = process.env.PORT || 3000;

let initialized = false;
let initError = null;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', initialized, error: initError ? initError.message : null });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  if (!initialized) {
    return res.status(503).json({ error: 'Service is still initializing. Please try again in a moment.' });
  }
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }
    const response = await chat(message);
    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Initialize vector store with retries
async function initialize(retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Initialization attempt ${attempt}/${retries}...`);
      const faqPath = path.join(__dirname, '..', 'data', 'faqs.json');
      const faqs = JSON.parse(fs.readFileSync(faqPath, 'utf-8'));
      console.log(`Loaded ${faqs.length} FAQs`);
      await initVectorStore(faqs);
      initialized = true;
      initError = null;
      console.log('Initialization complete!');
      return;
    } catch (error) {
      console.error(`Initialization attempt ${attempt} failed:`, error.message);
      initError = error;
      if (attempt < retries) {
        console.log('Retrying in 10 seconds...');
        await new Promise(r => setTimeout(r, 10000));
      }
    }
  }
  console.error('All initialization attempts failed. Server running but chat unavailable.');
}

// Start server first, then initialize
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  initialize();
});
