import llm from "../config/llm.js";
import chatPrompt from "../prompts/chat.prompt.js";

export const chatbotNode = async (state) => {
  // console.log("Node received state:", state);
  const chain = chatPrompt.pipe(llm);

  const response = await chain.invoke({ question: state.message });

  return {
    response: response.content,
  };
};
