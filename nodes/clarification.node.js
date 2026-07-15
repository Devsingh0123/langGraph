export async function clarificationNode(state) {
  const reset = state.turn?.action === "RESET_CONTEXT";
  return {
    messages: [{
      role: "assistant",
      content: reset
        ? "Sure - let's start fresh. What are you shopping for today?"
        : state.turn?.clarificationQuestion || "What kind of product would you like help finding?",
    }],
    ...(reset ? {
      shownProducts: [],
      activeProductId: null,
      shoppingContext: { lastDiscoveryQuery: null },
    } : {}),
  };
}
