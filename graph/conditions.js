export function conversationRouter(state){


    const action =
    state.conversationDecision?.action;



    switch(action){


        case "SELECT_PRODUCT":

            return "selectProduct";


        case "CLARIFICATION_REQUIRED":

            return "clarification";


        case "FOLLOW_UP":

            return "continue";


        default:

            return "continue";

    }

}