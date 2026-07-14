import llm from "../config/llm.js";
import productSelectionPrompt from "../prompts/productSelection.prompt.js";


export async function productSelectionNode(state) {


    const userMessage = state.messages
        .at(-1)
        .content;


    const products = state.products || [];


    if(products.length === 0){

        return {};

    }


    const chain = productSelectionPrompt.pipe(llm);


    const response = await chain.invoke({

        products: JSON.stringify(products),

        question: userMessage

    });


    const selectedName = response.content.trim();



    if(selectedName === "NONE"){

        return {};

    }



    const selectedProduct = products.find(
        (product)=>
            product.name
            .toLowerCase()
            .includes(
                selectedName.toLowerCase()
            )
    );


    return {

        selectedProduct

    };

}