function roleForMessage(message) {
  if (message?._getType?.() === "human" || message?.role === "user") return "User";
  if (message?._getType?.() === "ai" || message?.role === "assistant") return "Assistant";
  return "System";
}

export function getLatestUserMessage(messages = []) {
  return messages.at(-1)?.content || "";
}

export function getConversationTranscript(messages = [], limit = 12) {
  return messages.slice(-limit).map((message) =>
    `${roleForMessage(message)}: ${message.content}`,
  ).join("\n");
}
