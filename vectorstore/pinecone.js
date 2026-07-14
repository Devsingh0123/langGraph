import { PineconeStore } from "@langchain/pinecone";

import embeddings from "../config/embeddings.js";
import pinecone from "../config/pinecone.js";


export async function createVectorStore(documents){

    const index = pinecone.Index(
        process.env.PINECONE_INDEX_NAME
    );


    const vectorStore = await PineconeStore.fromDocuments(
        documents,
        embeddings,
        {
            pineconeIndex:index,
        }
    );


    console.log("✅ Data stored in Pinecone");


    return vectorStore;
}

// search

export async function searchVectorStore(query, k = 3) {

    const index = pinecone.Index(
        process.env.PINECONE_INDEX_NAME
    );

    const vectorStore = await PineconeStore.fromExistingIndex(
        embeddings,
        {
            pineconeIndex: index,
        }
    );

    const documents = await vectorStore.similaritySearch(
        query,
        k
    );

    return documents;
}