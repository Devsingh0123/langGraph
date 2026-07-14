import {
    ChatPromptTemplate
} from "@langchain/core/prompts";


const productSelectionPrompt = ChatPromptTemplate.fromMessages([

    [
        "system",
        `
You are a product selection assistant.

Your job is to identify which product the user selected
from the available products.

Rules:
- Return only the exact product name.
- If user did not select any product, return NONE.
- Do not explain anything.
`
    ],

    [
        "human",
        `
Available Products:

{products}


User Message:

{question}
`
    ]

]);


export default productSelectionPrompt;