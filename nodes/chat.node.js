import { getLlm } from "../config/llm.js";
import chatPrompt from "../prompts/chat.prompt.js";

export async function chatNode(state) {
  try {
    const response = await Promise.race([
      chatPrompt.pipe(getLlm()).invoke({ messages: state.messages }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("LLM response timed out")), 8_000)),
    ]);
    return { messages: [response] };
  } catch (error) {
    console.error("General chat response failed:", error.message);
    return { messages: [{ role: "assistant", content: "I can help you find astrology products by goal, product type, or budget. What are you looking for today?" }] };
  }
}
