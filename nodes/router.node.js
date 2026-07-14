export function router(state) {

    console.log("Intent:", state.intent);

    if(state.intent === "product"){
        return "product";
    }

    return "chatbot";
}