import llm from "../config/llm.js";
import shoppingResponsePrompt from "../prompts/shoppingResponse.prompt.js";

export async function respondToShopper({ goal, shopperMessage, productData }) {
  const response = await shoppingResponsePrompt.pipe(llm).invoke({
    goal,
    shopperMessage,
    productData: JSON.stringify(productData),
  });
  return response.content;
}
