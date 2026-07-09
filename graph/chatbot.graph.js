import {
    StateGraph,
    StateSchema,
    START,
    END
} from "@langchain/langgraph";

import { z } from "zod";

import { chatbotNode } from "../nodes/chatbot.node.js";


const ChatState = new StateSchema({

    message: z.string()

});


const graph = new StateGraph(ChatState);


graph.addNode(
    "chatbot",
    chatbotNode
);


graph.addEdge(
    START,
    "chatbot"
);


graph.addEdge(
    "chatbot",
    END
);


export const chatbotGraph = graph.compile();