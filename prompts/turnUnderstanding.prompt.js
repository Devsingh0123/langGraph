import { ChatPromptTemplate } from "@langchain/core/prompts";

export default ChatPromptTemplate.fromMessages([
  ["system", `You classify the shopper's latest turn for a shopping assistant.
Use the conversation, shown products, and active product. Resolve references such as "the first one" to a 1-based shownProductIndex.
Use DISCOVER_PRODUCTS for a new product need, SHOW_ALTERNATIVES for different options, and product actions for questions about a selected or referenced item.
Use COMPARE_PRODUCTS for a comparison request and SELECT_PRODUCT when the customer only chooses an option. Return comparisonIndexes for comparison requests.
Use PRODUCT_AVAILABILITY for questions about stock or availability.
Use CLARIFY only when a product search cannot proceed without missing information.`],
  ["human", `Conversation:\n{conversation}\n\nShown products:\n{shownProducts}\n\nActive product ID: {activeProductId}\n\nLatest message: {latestMessage}`],
]);
