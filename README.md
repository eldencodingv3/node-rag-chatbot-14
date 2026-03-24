# RAG FAQ Chatbot

A Node.js RAG (Retrieval-Augmented Generation) chatbot for customer support. It uses LanceDB for vector storage and OpenAI for embeddings and chat completions, delivering accurate answers grounded in your FAQ dataset.

## Architecture

```
User Question
     |
     v
  Express API  -->  OpenAI Embeddings  -->  LanceDB Vector Search
     |                                            |
     v                                            v
  OpenAI Chat Completion  <--  Top-K relevant FAQ entries
     |
     v
  Answer returned to user
```

- **Express** — HTTP server and chat API
- **LanceDB** — Embedded vector database for storing and searching FAQ embeddings
- **OpenAI** — Text embeddings (`text-embedding-3-small`) and chat completions (`gpt-4o-mini`)

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/eldencodingv3/node-rag-chatbot-14.git
   cd node-rag-chatbot-14
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your OpenAI API key.

4. **Start the server**
   ```bash
   npm start
   ```
   The server will run at `http://localhost:3000`.

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `OPENAI_API_KEY` | Yes | — | Your OpenAI API key |
| `PORT` | No | `3000` | Port the server listens on |
| `NODE_ENV` | No | `development` | Environment mode (`development` or `production`) |

## Updating the FAQ Dataset

1. Edit `data/faqs.json` with your questions and answers
2. Restart the server — embeddings are regenerated on startup
3. The chatbot will immediately use the updated FAQ data

## Development

```bash
npm run dev
```

Uses Node.js `--watch` mode to auto-restart on file changes.

## Deployment

This project is configured for deployment on **Railway**:

- Push to `main` triggers automatic deployment
- Environment variables are configured in the Railway dashboard
- The app listens on the `PORT` environment variable provided by Railway

## License

MIT
