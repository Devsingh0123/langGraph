import {
    StateSchema,
    MessagesValue
} from "@langchain/langgraph";

export const ChatState = new StateSchema({

    messages: MessagesValue

});