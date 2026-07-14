export function getConversationHistory(
    messages,
    selectedProduct
){

    let history = "";
console.log("MESSAGES:", messages);

    if(messages && messages.length > 1){

        history = messages
        .slice(0,-1)
        .map((message)=>{


            let role = "unknown";


            if(message._getType){

                role = message._getType();

            }


            if(role === "human"){

                role = "User";

            }
            else if(role === "ai"){

                role = "Assistant";

            }



            return `${role}: ${message.content}`;


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