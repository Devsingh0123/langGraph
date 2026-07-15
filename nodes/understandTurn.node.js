import { getLlm } from "../config/llm.js";
import { TurnSchema } from "../graph/state.js";
import turnUnderstandingPrompt from "../prompts/turnUnderstanding.prompt.js";
import { getConversationTranscript, getLatestUserMessage } from "../utils/conversation.js";

const PRODUCT_WORDS = /bracelet|anklet|ring|pendant|crystal|stone|gemstone|yantra|rudraksha|turtle|horses?|combo|product|remedy|pyrite|amethyst|citrine|money|wealth|career|love|protection|planet|astrology|vastu|recommend|recommendation|gift|budget|under\s+(?:rs\.?|inr)?\s*\d+/i;
const DETAILS = /detail|about|benefit|describe|tell me more|what is (it|this|that)/i;
const PRICE = /price|cost|how much|discount|expensive/i;
const AVAILABILITY = /stock|available|availability|in stock|deliver/i;
const USAGE = /how (do|to|should) (i |we )?(use|wear|place)|usage|direction|where .*place/i;
const ALTERNATIVES = /alternative|another|other options?|something else|different options?|show more/i;
const COMPARE = /compare|difference|better.*(1|2|first|second)|which one/i;
const SELECT = /^(?:#?\d+|first|second|third|1st|2nd|3rd)$/i;

function indexesFrom(text) {
  const values = [...text.matchAll(/\b(?:option\s*)?(\d+)\b/gi)].map((match) => Number(match[1]));
  if (/\bfirst\b/i.test(text)) values.push(1);
  if (/\bsecond\b/i.test(text)) values.push(2);
  if (/\bthird\b/i.test(text)) values.push(3);
  return [...new Set(values)].filter((value) => value > 0 && value < 10);
}

export function heuristicTurn(state, message) {
  const indexes = indexesFrom(message);
  const selected = indexes[0] || null;
  const empty = { searchQuery: null, shownProductIndex: null, comparisonIndexes: null, clarificationQuestion: null };
  if (/^(reset|start over|new search)$/i.test(message.trim())) return { action: "RESET_CONTEXT", ...empty };
  if (/^(help|recommend|show products?|i need help)$/i.test(message.trim())) return { action: "CLARIFY", ...empty, clarificationQuestion: "What would you like to shop for? Tell me your goal, product type, or budget." };
  if (COMPARE.test(message)) return { action: "COMPARE_PRODUCTS", ...empty, comparisonIndexes: indexes.length ? indexes : null };
  if (SELECT.test(message.trim()) && selected) return { action: "SELECT_PRODUCT", ...empty, shownProductIndex: selected };
  if (PRICE.test(message)) return { action: "PRODUCT_PRICE", ...empty, shownProductIndex: selected };
  if (AVAILABILITY.test(message)) return { action: "PRODUCT_AVAILABILITY", ...empty, shownProductIndex: selected };
  if (USAGE.test(message)) return { action: "PRODUCT_USAGE", ...empty, shownProductIndex: selected };
  if (DETAILS.test(message) && (selected || state.activeProductId)) return { action: "PRODUCT_DETAILS", ...empty, shownProductIndex: selected };
  if (ALTERNATIVES.test(message)) return { action: "SHOW_ALTERNATIVES", ...empty, searchQuery: state.shoppingContext?.lastDiscoveryQuery || null };
  if (PRODUCT_WORDS.test(message)) return { action: "DISCOVER_PRODUCTS", ...empty, searchQuery: message };
  return { action: "GENERAL_CHAT", ...empty };
}

export async function understandTurnNode(state) {
  const latestMessage = getLatestUserMessage(state.messages);
  const fallback = heuristicTurn(state, latestMessage);
  if (fallback.action !== "GENERAL_CHAT" || !process.env.GROQ_API_KEY) return { turn: fallback };
  try {
    const structuredLlm = getLlm().withStructuredOutput(TurnSchema, { name: "shopping_turn" });
    const turn = await Promise.race([
      turnUnderstandingPrompt.pipe(structuredLlm).invoke({ conversation: getConversationTranscript(state.messages, 12), shownProducts: JSON.stringify(state.shownProducts || []), activeProductId: state.activeProductId ?? null, latestMessage }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Turn understanding timed out")), 5_000)),
    ]);
    return { turn: { ...turn, comparisonIndexes: turn.comparisonIndexes || null } };
  } catch (error) {
    console.warn("Turn understanding fell back to rules:", error.message);
    return { turn: fallback };
  }
}
