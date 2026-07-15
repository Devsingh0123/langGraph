import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

let embeddings;

export function getEmbeddings() {
  if (!process.env.GOOGLE_API_KEY) throw new Error("GOOGLE_API_KEY is not configured");
  if (!embeddings) {
    embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-embedding-001",
    });
  }
  return embeddings;
}
