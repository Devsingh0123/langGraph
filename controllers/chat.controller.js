// import { chatbotGraph } from "../graph/graph.js";

import { chatbotGraph } from "../graph/chatbot.graph.js";

export const chatController = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ message: "message must be a non-empty string" });
    }

    if (typeof sessionId !== "string" || !sessionId.trim()) {
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
    // console.log("result", result);
    const lastMessage = result.messages.at(-1);
        // console.log("lastMessage", lastMessage);


    res.json({
      response: lastMessage.content,
      products: result.shownProducts || [],
      activeProductId: result.activeProductId ?? null,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
