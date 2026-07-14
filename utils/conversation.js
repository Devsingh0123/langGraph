export function getConversationHistory(
    messages,
    selectedProduct
){

    let history = "";


    if(messages && messages.length > 1){

        history = messages
        .slice(0,-1)
        .map((message)=>{

            return `${message.role}: ${message.content}`;

        })
        .join("\n\n");

    }


    if(selectedProduct){

        history += `

Current Selected Product:

${selectedProduct.name}

`;

    }


    return history;

}