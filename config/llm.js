import { ChatGroq } from "@langchain/groq";

let llm;

export function getLlm() {
  if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY is not configured");
  if (!llm) {
    llm = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "openai/gpt-oss-20b",
      temperature: 0,
    });
  }
  return llm;
}
