require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { initVectorStore } = require('./vectorStore');
const { chat } = require('./chat');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
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

// Initialize and start
async function start() {
  try {
    // Load FAQ data
    const faqPath = path.join(__dirname, '..', 'data', 'faqs.json');
    const faqs = JSON.parse(fs.readFileSync(faqPath, 'utf-8'));
    console.log(`Loaded ${faqs.length} FAQs`);

    // Initialize vector store
    await initVectorStore(faqs);

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
