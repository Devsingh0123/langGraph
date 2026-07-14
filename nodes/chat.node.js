import llm from "../config/llm.js";
import chatPrompt from "../prompts/chat.prompt.js";

export async function chatNode(state) {
  const response = await chatPrompt.pipe(llm).invoke({ messages: state.messages });
  return { messages: [response] };
}
