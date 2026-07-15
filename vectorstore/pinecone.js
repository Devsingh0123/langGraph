import { PineconeStore } from "@langchain/pinecone";

import { getEmbeddings } from "../config/embeddings.js";
import { getPinecone } from "../config/pinecone.js";

function getIndex() {
  if (!process.env.PINECONE_INDEX_NAME) throw new Error("PINECONE_INDEX_NAME is not configured");
  return getPinecone().Index(process.env.PINECONE_INDEX_NAME);
}

export async function createVectorStore(documents) {
  return PineconeStore.fromDocuments(documents, getEmbeddings(), { pineconeIndex: getIndex() });
}

export async function searchVectorStore(query, k = 3) {
  const vectorStore = await PineconeStore.fromExistingIndex(getEmbeddings(), { pineconeIndex: getIndex() });
  return vectorStore.similaritySearch(query, k);
}
