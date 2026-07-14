import { ChatPromptTemplate } from "@langchain/core/prompts";

export default ChatPromptTemplate.fromMessages([
  ["system", "You are a concise, helpful shopping assistant. Use only the provided product data. Do not invent facts."],
  ["human", "Goal: {goal}\nCustomer message: {shopperMessage}\nProduct data: {productData}"],
]);
