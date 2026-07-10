


import {
  StateGraph,
  START,
  END,
  MemorySaver,
} from "@langchain/langgraph";

import { ChatState } from "./state.js";
import { chatbotNode } from "../nodes/chatbot.node.js";

const graph = new StateGraph(ChatState);

graph.addNode("chatbot", chatbotNode);

graph.addEdge(START, "chatbot");
graph.addEdge("chatbot", END);


const checkpointer = new MemorySaver();
export const chatbotGraph = graph.compile({checkpointer});