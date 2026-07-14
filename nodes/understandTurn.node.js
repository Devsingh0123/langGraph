import llm from "../config/llm.js";
import { TurnSchema } from "../graph/state.js";
import turnUnderstandingPrompt from "../prompts/turnUnderstanding.prompt.js";
import { getConversationTranscript, getLatestUserMessage } from "../utils/conversation.js";

export async function understandTurnNode(state) {
  const structuredLlm = llm.withStructuredOutput(TurnSchema, {
    name: "shopping_turn",
  });

  const turn = await turnUnderstandingPrompt.pipe(structuredLlm).invoke({
    conversation: getConversationTranscript(state.messages, 12),
    shownProducts: JSON.stringify(state.shownProducts || []),
    activeProductId: state.activeProductId ?? null,
    latestMessage: getLatestUserMessage(state.messages),
  });

  return { turn };
}
