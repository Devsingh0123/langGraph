export function routeTurn(state) {
  switch (state.turn?.action) {
    case "DISCOVER_PRODUCTS":
    case "SHOW_ALTERNATIVES":
      return "discoverProducts";
    case "PRODUCT_DETAILS":
    case "PRODUCT_PRICE":
    case "PRODUCT_AVAILABILITY":
    case "PRODUCT_USAGE":
      return "productInfo";
    case "CLARIFY":
      return "clarify";
    default:
      return "chat";
  }
}
