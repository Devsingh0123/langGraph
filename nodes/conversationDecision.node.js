
import llm from "../config/llm.js";
import conversationDecisionPrompt 
from "../prompts/conversationDecision.prompt.js";

import {
    getConversationHistory
} from "../utils/conversation.js";


export async function conversationDecisionNode(state){


    const messages = state.messages;


    const history =
    getConversationHistory(
        messages,
        state.selectedProduct
    );


    const question =
    messages.at(-1).content;



    const chain =
    conversationDecisionPrompt.pipe(llm);



    const response =
    await chain.invoke({

        history,

        products:
        JSON.stringify(
            state.products || []
        ),

        question

    });



    let decision;


    try{

        decision =
        JSON.parse(
            response.content
        );

    }
    catch(error){

        decision = {

            action:"NEW_QUERY"

        };

    }



    return {

        conversationDecision:
        decision

    };

}