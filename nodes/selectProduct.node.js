export async function selectProductNode(state) {


    const decision =
        state.conversationDecision;


    const products =
        state.products || [];



    const selectedProduct =
        products.find(product =>
            product.name
            .toLowerCase()
            .includes(
              decision.productName
              .toLowerCase()
            )
        );



    if(!selectedProduct){

        return {};

    }


    return {

        selectedProduct

    };

}