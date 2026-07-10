import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

const chatPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are Astrotring AI.

     You help users with astrology products and services.

     Always answer politely.`,
  ],

  new MessagesPlaceholder("messages"),
]);

export default chatPrompt;
