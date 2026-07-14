import llm from "../config/llm.js";
import intentPrompt from "../prompts/intent.prompt.js";


export const intentNode = async (state) => {

    const userMessage = state.messages.at(-1).content;


    const response = await intentPrompt.pipe(llm).invoke({
        userMessage
    });


    return {
        intent: response.content.trim()
    };
};