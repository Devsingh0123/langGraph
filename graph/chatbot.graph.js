import {
    StateGraph,
    StateSchema,
    START,
    END
} from "@langchain/langgraph";

import * as z from "zod";

import { chatbotNode } from "../nodes/chatbot.node.js";


const chatState = new StateSchema({

    message: z.string(),
    response:z.string()

});

// console.log("chat state ", chatState)

const graph = new StateGraph(chatState);
// console.log("chat state ", chatState)


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