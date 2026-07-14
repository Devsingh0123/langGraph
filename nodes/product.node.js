import llm from "../config/llm.js";
import { searchProducts } from "../services/product.service.js";
import productPrompt from "../prompts/product.prompt.js";
import { getConversationHistory } from "../utils/conversation.js";

export async function productNode(state) {
  console.log("===== Product Node =====");

  // 1. Puri conversation history
  const messages = state.messages;

  // 2. Current user question
  const userQuery = messages.at(-1).content;

  // 3. Previous conversation nikalna
  const conversationHistory =
getConversationHistory(
    messages,
    state.selectedProduct
);

  console.log("Current Question:", userQuery);

  console.log("Conversation History:", conversationHistory);

  // 4. Better search query banana
  const searchQuery = `
Conversation History:

${conversationHistory}


Current User Question:

${userQuery}
`;

  // 5. Pinecone search
  const { context, documents } = await searchProducts(searchQuery);

  // 6. LLM generation
  const chain = productPrompt.pipe(llm);

  const response = await chain.invoke({
    history: conversationHistory,
    context,

    question: userQuery,
  });

  // 7. State update
  return {
    messages: [
      {
        role: "assistant",
        content: response.content,
      },
    ],

    products: documents.map((doc) => ({
      name: doc.metadata.name,

      price: doc.metadata.price,

      image: doc.metadata.image,

      slug: doc.metadata.slug,
    })),

    selectedProduct: products.length === 1 ? products[0] : undefined,
  };
}
