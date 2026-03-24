# CloudDesk RAG Support Chatbot

A Node.js RAG (Retrieval-Augmented Generation) chatbot that answers customer support questions using LanceDB for vector search and OpenAI for embeddings and chat completions.

## Features

- **RAG-powered responses** — retrieves relevant FAQ entries before generating answers
- **Vector search** — uses LanceDB to find semantically similar questions
- **OpenAI integration** — text-embedding-3-small for embeddings, GPT-3.5-turbo for chat
- **Modern chat UI** — responsive web interface with real-time messaging
- **Health check endpoint** — `/api/health` for monitoring
- **Easy FAQ updates** — edit `data/faqs.json` and restart the server

## Architecture

```
User Question
     |
     v
[Embed Query] ──> OpenAI text-embedding-3-small
     |
     v
[Vector Search] ──> LanceDB (top 3 matches)
     |
     v
[Build Prompt] ──> System prompt + FAQ context + user question
     |
     v
[Generate Reply] ──> OpenAI GPT-3.5-turbo
     |
     v
Chat Response
```

## Prerequisites

- Node.js >= 20.0.0
- OpenAI API key

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

   The app will be available at `http://localhost:3000`.

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `OPENAI_API_KEY` | Yes | — | Your OpenAI API key |
| `PORT` | No | `3000` | Server port |
| `NODE_ENV` | No | `development` | Environment mode |

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Health check — returns `{ "status": "ok" }` |
| `POST` | `/api/chat` | Send a message — body: `{ "message": "..." }`, returns `{ "response": "..." }` |
| `GET` | `/` | Serves the chat UI |

## Updating the FAQ Dataset

Edit `data/faqs.json` with your questions and answers:

```json
[
  {
    "question": "Your question here?",
    "answer": "Your answer here."
  }
]
```

Restart the server after making changes. Embeddings are regenerated on startup.

## Deploying to Railway

1. Push your code to GitHub
2. Create a new project on [Railway](https://railway.app)
3. Connect your GitHub repository
4. Add the `OPENAI_API_KEY` environment variable in Railway's dashboard
5. Railway will auto-detect the Node.js project and deploy using `npm start`

The `PORT` variable is automatically set by Railway — no manual configuration needed.
