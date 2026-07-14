import {
 ChatPromptTemplate
} from "@langchain/core/prompts";


const intentPrompt = ChatPromptTemplate.fromMessages([

[
"system",
`
You are an intent classifier.

Classify user message into only:

product
chatbot

Return only category name.
`
],

[
"human",
`
User message:
{userMessage}
`
]

]);


export default intentPrompt;