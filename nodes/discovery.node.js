import { getProductsByIds, searchProducts, toProductCard } from "../services/product.service.js";
import { getLatestUserMessage } from "../utils/conversation.js";
import { money, shortReason, stockLabel } from "../utils/product.format.js";

export async function discoveryNode(state) {
  const isAlternativeRequest = state.turn?.action === "SHOW_ALTERNATIVES";
  const query = state.turn?.searchQuery || state.shoppingContext?.lastDiscoveryQuery || getLatestUserMessage(state.messages);
  let documents;
  try {
    documents = await searchProducts(query, 12);
  } catch (error) {
    console.error("Product discovery failed:", error.message);
    return { messages: [{ role: "assistant", content: "I can't search the catalog right now. Please try again in a moment." }] };
  }

  const excludedIds = isAlternativeRequest ? new Set((state.shownProducts || []).map((product) => String(product.id))) : new Set();
  const productIds = documents.map((document) => document.metadata?.productId).filter((id) => id !== undefined && !excludedIds.has(String(id)));
  let products;
  try {
    products = await getProductsByIds(productIds);
  } catch (error) {
    console.error("Catalog lookup failed:", error.message);
    return { messages: [{ role: "assistant", content: "I found possible matches but cannot load their current details. Please try again shortly." }] };
  }
  const cards = products.slice(0, 3).map(toProductCard);
  if (!cards.length) {
    return {
      messages: [{ role: "assistant", content: "I couldn't find a close match. Could you tell me the product type, your goal (such as wealth, protection, or a planet), and your budget?" }],
      shoppingContext: { ...state.shoppingContext },
    };
  }

  const productById = new Map(products.map((product) => [String(product.id), product]));
  const intro = isAlternativeRequest ? "Here are a few different options:" : "Here are the best matches I found:";
  const message = `${intro}\n\n${cards.map((card, index) => {
    const product = productById.get(String(card.id));
    return `${index + 1}. **${card.name}** - ${money(card.price)} | ${stockLabel(product)}\n   ${shortReason(product)}`;
  }).join("\n\n")}\n\nReply with a number for details, or ask me to compare them.`;

  return {
    messages: [{ role: "assistant", content: message }],
    shownProducts: cards,
    activeProductId: null,
    shoppingContext: { lastDiscoveryQuery: query },
  };
}
