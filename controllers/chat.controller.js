import { chatbotGraph } from "../graph/chatbot.graph.js";

const MAX_MESSAGE_LENGTH = 2_000;
const MAX_SESSION_ID_LENGTH = 128;

export const chatController = async (req, res) => {
  try {
    const { message, sessionId } = req.body || {};

    if (typeof message !== "string" || !message.trim() || message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ message: "message must be a non-empty string" });
    }

    if (typeof sessionId !== "string" || !sessionId.trim() || sessionId.length > MAX_SESSION_ID_LENGTH) {
      return res.status(400).json({ message: "sessionId must be a non-empty string" });
    }

    const result = await chatbotGraph.invoke(
      {
        messages: [
          {
            role: "user",
            content: message.trim(),
          },
        ],
      },
      {
        configurable: {
          thread_id: sessionId,
        },
      },
    );
    const lastMessage = result.messages.at(-1);

    res.json({
      response: String(lastMessage?.content || ""),
      products: result.shownProducts || [],
      activeProductId: result.activeProductId ?? null,
      sessionId,
    });
  } catch (error) {
    console.error("Chat request failed:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
