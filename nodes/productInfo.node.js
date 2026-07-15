import { getProductById, toProductCard } from "../services/product.service.js";
import { productFacts } from "../utils/product.format.js";

function resolveProductId(state) {
  const index = state.turn?.shownProductIndex;
  return index && state.shownProducts?.[index - 1] ? state.shownProducts[index - 1].id : state.activeProductId;
}

async function resolveComparison(state) {
  const indexes = state.turn?.comparisonIndexes || [];
  const ids = indexes.length
    ? indexes.map((index) => state.shownProducts?.[index - 1]?.id).filter(Boolean)
    : (state.shownProducts || []).slice(0, 2).map((product) => product.id);
  return (await Promise.all(ids.map(getProductById))).filter(Boolean);
}

export async function productInfoNode(state) {
  try {
    if (state.turn?.action === "COMPARE_PRODUCTS") {
      const products = await resolveComparison(state);
      if (products.length < 2) return { messages: [{ role: "assistant", content: "Please choose at least two products from the options I showed (for example, 'compare 1 and 2')." }] };
      return { messages: [{ role: "assistant", content: `Here's a factual comparison:\n\n${products.map((product, index) => `${index + 1}. ${productFacts(product, { includeDetails: true })}`).join("\n\n")}` }], activeProductId: products[0].id };
    }

    const productId = resolveProductId(state);
    if (!productId) return { messages: [{ role: "assistant", content: "Please choose a product from the options I showed, and I'll help with its details." }] };
    const product = await getProductById(productId);
    if (!product) return { messages: [{ role: "assistant", content: "I couldn't find that product. Please choose another option." }], activeProductId: null };

    const action = state.turn?.action;
    const message = action === "SELECT_PRODUCT"
      ? `Selected ${product.name}. What would you like to know - details, price, availability, or how to use it?`
      : productFacts(product, { includeUsage: action === "PRODUCT_USAGE", includeDetails: action === "PRODUCT_DETAILS" });
    return { messages: [{ role: "assistant", content: message }], activeProductId: product.id, shownProducts: state.shownProducts || [toProductCard(product)] };
  } catch (error) {
    console.error("Product information lookup failed:", error.message);
    return { messages: [{ role: "assistant", content: "I can't load that product's current details right now. Please try again in a moment." }] };
  }
}
