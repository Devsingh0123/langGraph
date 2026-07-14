import { StateSchema, MessagesValue } from "@langchain/langgraph";
import * as z from "zod";

export const ChatState = new StateSchema({
  messages: MessagesValue,
  intent: z.string().optional(),
  products: z.array(z.any()).optional(),
  conversationContext: z.string().optional(),
  selectedProduct: z.any().optional(),
  conversationDecision: z.any().optional(),
});
