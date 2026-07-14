export async function clarificationNode(state) {


    const decision =
        state.conversationDecision;


    return {

        messages:[
            {
                role:"assistant",
                content:
                decision.question ||
                "Please provide more details."
            }
        ]

    };

}