import {
 ChatPromptTemplate
} from "@langchain/core/prompts";


const conversationDecisionPrompt =
ChatPromptTemplate.fromMessages([

[
"system",

`
You are a conversation understanding assistant.

Analyze user's latest message.

Return only JSON.

Possible actions:

SELECT_PRODUCT
FOLLOW_UP
CLARIFICATION_REQUIRED
NEW_QUERY


Example output:

{{
 "action":"SELECT_PRODUCT",
 "productName":"5 Mukhi Rudraksha"
}}

Do not add explanation.

`

],


[
"human",

`
Conversation History:

{history}


Available Products:

{products}


Latest User Message:

{question}
`

]

]);


export default conversationDecisionPrompt;