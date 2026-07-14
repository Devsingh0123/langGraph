export async function clarificationNode(state) {
  return {
    messages: [{
      role: "assistant",
      content: state.turn?.clarificationQuestion ||
        "What kind of product would you like help finding?",
    }],
  };
}
