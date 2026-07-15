import { Pinecone } from "@pinecone-database/pinecone";

let pinecone;

export function getPinecone() {
  if (!process.env.PINECONE_API_KEY) throw new Error("PINECONE_API_KEY is not configured");
  if (!pinecone) pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  return pinecone;
}
