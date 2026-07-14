import { END, MemorySaver, START, StateGraph } from "@langchain/langgraph";

import { ChatState } from "./state.js";
import { chatNode } from "../nodes/chat.node.js";
import { clarificationNode } from "../nodes/clarification.node.js";
import { discoveryNode } from "../nodes/discovery.node.js";
import { productInfoNode } from "../nodes/productInfo.node.js";
import { routeTurn } from "../nodes/router.node.js";
import { understandTurnNode } from "../nodes/understandTurn.node.js";

const graph = new StateGraph(ChatState);

graph.addNode("understandTurn", understandTurnNode);
graph.addNode("discoverProducts", discoveryNode);
graph.addNode("productInfo", productInfoNode);
graph.addNode("chat", chatNode);
graph.addNode("clarify", clarificationNode);

graph.addEdge(START, "understandTurn");
graph.addConditionalEdges("understandTurn", routeTurn, {
  discoverProducts: "discoverProducts",
  productInfo: "productInfo",
  chat: "chat",
  clarify: "clarify",
});

graph.addEdge("discoverProducts", END);
graph.addEdge("productInfo", END);
graph.addEdge("chat", END);
graph.addEdge("clarify", END);

// Replace this with a shared checkpoint saver (for example Postgres or Redis)
// when deploying multiple server instances. The graph itself is checkpoint-ready.
export const chatbotGraph = graph.compile({
  checkpointer: new MemorySaver(),
});
