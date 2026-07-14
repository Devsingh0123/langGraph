import {
    ChatPromptTemplate
} from "@langchain/core/prompts";


const conversationDecisionPrompt =
ChatPromptTemplate.fromMessages([

[
"system",
`
You are a conversation understanding assistant.

Analyze the user's latest message based on conversation history.

Decide what action is required.

Possible actions:

1. SELECT_PRODUCT
User is choosing a product from previous options.

2. FOLLOW_UP
User is asking about previously discussed product/topic.

3. CLARIFICATION_REQUIRED
User question is ambiguous and needs clarification.

4. NEW_QUERY
User started a new topic.

Return only JSON.

Example:

{
 "action":"SELECT_PRODUCT",
 "productName":"5 Mukhi Rudraksha"
}

or

{
 "action":"CLARIFICATION_REQUIRED",
 "question":"Which product are you asking about?"
}

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