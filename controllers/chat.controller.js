// import { chatbotGraph } from "../graph/graph.js";

import { chatbotGraph } from "../graph/chatbot.graph.js";

export const chatController = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    const result = await chatbotGraph.invoke(
      {
        messages: [
          {
            role: "user",
            content: message,
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
      products: result.products || [],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
