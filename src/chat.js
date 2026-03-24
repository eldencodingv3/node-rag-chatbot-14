const OpenAI = require('openai');
const { getEmbedding } = require('./embeddings');
const { searchSimilar } = require('./vectorStore');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function chat(userMessage) {
  // Step 1: Embed the user's question
  const queryEmbedding = await getEmbedding(userMessage);

  // Step 2: Search for relevant FAQs
  const relevantFaqs = await searchSimilar(queryEmbedding, 3);

  // Step 3: Build context from retrieved FAQs
  const context = relevantFaqs
    .map((faq, i) => `[${i + 1}] Q: ${faq.question}\nA: ${faq.answer}`)
    .join('\n\n');

  // Step 4: Generate response with GPT-3.5-turbo
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `You are a helpful customer support assistant for CloudDesk, a project management tool. Answer the user's question based on the following FAQ context. If the context doesn't contain relevant information, say you don't have that information and suggest contacting support@clouddesk.com.

FAQ Context:
${context}`,
      },
      {
        role: 'user',
        content: userMessage,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return completion.choices[0].message.content;
}

module.exports = { chat };
