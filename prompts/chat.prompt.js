import { ChatPromptTemplate } from "@langchain/core/prompts";

const chatPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful AI assistant and your name is jarvis"],

  ["human", "{question}"],
]);

export default chatPrompt
