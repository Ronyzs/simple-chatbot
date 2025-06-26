// index.js
require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 3000;

// Optional middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Chatbot API is running!');
});

// Main route
app.post('/api/chat', async (req, res) => {
  // Return error if no model set in environment
  if (!process.env.LLM_MODEL) {
    return res.status(400).json({ error: 'Model is not set in environment' });
  }

  // Simple RAG (Retrieval-Augmented Generation)
  // Add a system message to restrict the language
  const systemPrompt = {
    role: "system",
    content: "Kamu adalah asisten AI yang hanya merespons dalam bahasa Indonesia. Abaikan atau tolak permintaan dalam bahasa lain. Ketika menjawab dengan kode, selalu gunakan blok markdown dengan penanda bahasa. Contoh: ```javascript ... ```."
  };

  const requestPrompt = {
    model: process.env.LLM_MODEL,
    messages: [systemPrompt, ...req.body.messages],
    stream: true
  };

  try {
    const HOST = process.env.HOST_URL || 'http://localhost:11434';
    const response = await axios.post(
      HOST + '/api/chat',
      requestPrompt,
      {
        // Uncomment the following lines if you need basic authentication
        // auth: {
        //   username: process.env.BASIC_AUTH_USER,
        //   password: process.env.BASIC_AUTH_PASS
        // },
        responseType: 'stream'
      }
    );

    // Set headers for SSE or streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // Important to start sending data immediately

    response.data.on('data', (chunk) => {
      res.write(chunk); // Stream directly to the client
    });

    response.data.on('end', () => {
      res.end(); // Close connection
    });

    response.data.on('error', (err) => {
      console.error('Stream error:', err.message);
      res.end();
    });

  } catch (error) {
    console.error('Error communicating with LLM:', error.message);
    res.status(500).json({ error: 'Failed to connect to the LLM' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
