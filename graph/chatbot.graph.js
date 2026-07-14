import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";

import { ChatState } from "./state.js";

import { chatbotNode } from "../nodes/chatbot.node.js";
import { productNode } from "../nodes/product.node.js";
import { intentNode } from "../nodes/intent.node.js";

import { conversationDecisionNode } from "../nodes/conversationDecision.node.js";

import { clarificationNode } from "../nodes/clarification.node.js";


import { router } from "../nodes/router.node.js";

import { conversationRouter } from "./conditions.js";
import { selectProductNode } from "../nodes/selectProduct.node.js";

const graph = new StateGraph(ChatState);

// =================
// Nodes
// =================

graph.addNode("decision", conversationDecisionNode);

graph.addNode("intentClassifier", intentNode);

graph.addNode("chatbot", chatbotNode);

graph.addNode("product", productNode);

graph.addNode("selectProduct", selectProductNode);

graph.addNode("clarification", clarificationNode);

// =================
// Starting Point
// =================

graph.addEdge(START, "decision");

// =================
// Conversation Decision Routing
// =================

graph.addConditionalEdges(
  "decision",

  conversationRouter,

  {
    selectProduct: "selectProduct",

    clarification: "clarification",

    continue: "intentClassifier",
  },
);

// =================
// Intent Routing
// =================

graph.addConditionalEdges(
  "intentClassifier",

  router,

  {
    chatbot: "chatbot",

    product: "product",
  },
);

// =================
// End Nodes
// =================

graph.addEdge("chatbot", END);

graph.addEdge("product", END);

graph.addEdge("selectProduct", END);

graph.addEdge("clarification", END);

// =================
// Memory
// =================

const checkpointer = new MemorySaver();

export const chatbotGraph = graph.compile({
  checkpointer,
});
