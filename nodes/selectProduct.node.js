export async function selectProductNode(state) {
  const decision = state.conversationDecision || {};

  const products = state.products || [];

  const productName = decision.productName;

  if (!productName || products.length === 0) {
    return {};
  }

  const selectedProduct = products.find((product) =>
    product.name.toLowerCase().includes(productName.toLowerCase()),
  );

  if (!selectedProduct) {
    return {};
  }

  return {
    selectedProduct,
  };
}
