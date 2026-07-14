import { searchProducts, getProductsByIds, toProductCard } from "../services/product.service.js";
import { respondToShopper } from "../services/response.service.js";
import { getLatestUserMessage } from "../utils/conversation.js";

export async function discoveryNode(state) {
  const isAlternativeRequest = state.turn?.action === "SHOW_ALTERNATIVES";
  const query = state.turn?.searchQuery || state.shoppingContext?.lastDiscoveryQuery ||
    getLatestUserMessage(state.messages);

  const documents = await searchProducts(query, 10);
  const excludedIds = isAlternativeRequest
    ? new Set((state.shownProducts || []).map((product) => String(product.id)))
    : new Set();
  const productIds = documents
    .map((document) => document.metadata?.productId)
    .filter((id) => id !== undefined && !excludedIds.has(String(id)));

  const products = await getProductsByIds(productIds);
  const cards = products.slice(0, 3).map(toProductCard);

  const message = await respondToShopper({
    goal: isAlternativeRequest ? "Offer different relevant options." : "Recommend suitable products.",
    shopperMessage: getLatestUserMessage(state.messages),
    productData: cards,
  });

  return {
    messages: [{ role: "assistant", content: message }],
    shownProducts: cards,
    shoppingContext: {
      lastUserRequest: getLatestUserMessage(state.messages),
      lastDiscoveryQuery: query,
      currentNeed: query,
    },
  };
}
