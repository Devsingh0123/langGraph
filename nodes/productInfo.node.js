import { getProductById, toProductCard } from "../services/product.service.js";
import { respondToShopper } from "../services/response.service.js";
import { getLatestUserMessage } from "../utils/conversation.js";

function resolveProductId(state) {
  const index = state.turn?.shownProductIndex;
  if (index && state.shownProducts?.[index - 1]) {
    return state.shownProducts[index - 1].id;
  }
  return state.activeProductId;
}

function factsForAction(product, action) {
  const common = { name: product.name, category: product.category?.name || null };
  if (action === "PRODUCT_PRICE") {
    return { ...common, price: product.after_price ?? null, originalPrice: product.before_price ?? null };
  }
  if (action === "PRODUCT_AVAILABILITY") {
    return { ...common, availability: product.stock_status || null };
  }
  if (action === "PRODUCT_USAGE") {
    return { ...common, howToUse: product.how_to_use || null };
  }
  return {
    ...common,
    price: product.after_price ?? null,
    description: product.description || null,
    benefits: product.benefits || null,
  };
}

export async function productInfoNode(state) {
  const productId = resolveProductId(state);
  if (!productId) {
    return {
      messages: [{
        role: "assistant",
        content: "Please choose a product from the options I showed, and I’ll help with its details.",
      }],
    };
  }

  const product = await getProductById(productId);
  if (!product) {
    return {
      messages: [{ role: "assistant", content: "I couldn’t find that product. Please choose another option." }],
      activeProductId: null,
    };
  }

  const message = await respondToShopper({
    goal: "Answer the customer’s question using only the supplied product facts.",
    shopperMessage: getLatestUserMessage(state.messages),
    productData: factsForAction(product, state.turn.action),
  });

  return {
    messages: [{ role: "assistant", content: message }],
    activeProductId: product.id,
    shownProducts: state.shownProducts || [toProductCard(product)],
  };
}
