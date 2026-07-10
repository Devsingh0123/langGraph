import llm from "../config/llm.js";
import chatPrompt from "../prompts/chat.prompt.js";

export const chatbotNode = async (state) => {
  const chain = chatPrompt.pipe(llm);

  const response = await chain.invoke({
    messages: state.messages,
  });

  return {
    messages: [response],
  };
};
