import { MessagesValue, StateSchema } from "@langchain/langgraph";
import * as z from "zod";

export const ProductCardSchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string(),
  slug: z.string().nullable(),
  image: z.string().nullable(),
  price: z.number().nullable(),
  category: z.string().nullable(),
});

export const TurnSchema = z.object({
  action: z.enum([
    "DISCOVER_PRODUCTS",
    "SHOW_ALTERNATIVES",
    "PRODUCT_DETAILS",
    "PRODUCT_PRICE",
    "PRODUCT_AVAILABILITY",
    "PRODUCT_USAGE",
    "COMPARE_PRODUCTS",
    "SELECT_PRODUCT",
    "RESET_CONTEXT",
    "GENERAL_CHAT",
    "CLARIFY",
  ]),
  searchQuery: z.string().nullable(),
  shownProductIndex: z.number().int().positive().nullable(),
  comparisonIndexes: z.array(z.number().int().positive()).max(3).nullable(),
  clarificationQuestion: z.string().nullable(),
});

const ShoppingContextSchema = z.object({
  lastDiscoveryQuery: z.string().nullable(),
});

export const ChatState = new StateSchema({
  messages: MessagesValue,
  turn: TurnSchema.optional(),
  shownProducts: z.array(ProductCardSchema).optional(),
  activeProductId: z.union([z.number(), z.string()]).nullable().optional(),
  shoppingContext: ShoppingContextSchema.optional(),
});
