import llm from "../config/llm.js";
import { chatbotGraph } from "../graph/chatbot.graph.js";

export const chatController = async (req, res) => {
  try {


const {message }= req.body
    const result = await chatbotGraph.invoke({
      message: message,
    });

    console.log('result ', result);

    res.json(result);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
