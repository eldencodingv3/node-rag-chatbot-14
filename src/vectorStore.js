const lancedb = require('@lancedb/lancedb');
const path = require('path');
const { getEmbeddings } = require('./embeddings');

const DB_PATH = path.join(process.cwd(), 'data', 'lancedb');
const TABLE_NAME = 'faqs';

let db = null;
let table = null;

async function initVectorStore(faqs) {
  db = await lancedb.connect(DB_PATH);

  // Check if table already exists
  const tableNames = await db.tableNames();
  if (tableNames.includes(TABLE_NAME)) {
    await db.dropTable(TABLE_NAME);
  }

  // Create combined text for embedding
  const texts = faqs.map(faq => `Question: ${faq.question}\nAnswer: ${faq.answer}`);

  // Get embeddings for all FAQs
  console.log(`Generating embeddings for ${faqs.length} FAQs...`);
  const embeddings = await getEmbeddings(texts);

  // Create records with vectors
  const records = faqs.map((faq, i) => ({
    id: i,
    question: faq.question,
    answer: faq.answer,
    text: texts[i],
    vector: embeddings[i],
  }));

  // Create table
  table = await db.createTable(TABLE_NAME, records);
  console.log(`Vector store initialized with ${records.length} FAQs`);
  return table;
}

async function searchSimilar(queryEmbedding, limit = 3) {
  if (!table) throw new Error('Vector store not initialized');
  const results = await table.vectorSearch(queryEmbedding).limit(limit).toArray();
  return results;
}

module.exports = { initVectorStore, searchSimilar };
