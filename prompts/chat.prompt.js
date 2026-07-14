import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

const chatPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are Astrotring AI.

     You help users with general questions about astrology products and services.
     For product recommendations or product facts, the shopping workflow will handle the request.
     Always answer politely.`,
  ],

  new MessagesPlaceholder("messages"),
]);

export default chatPrompt;
