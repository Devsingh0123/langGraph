import "dotenv/config";

import { Document } from "@langchain/core/documents";

import { createVectorStore } from "./vectorstore/pinecone.js";


const documents = [

    new Document({

        pageContent:
        `
        Product Name:
        Pyrite Bracelet

        Category:
        Bracelet

        Description:
        Wealth attracting gemstone bracelet.
        Helps with prosperity and confidence.

        Price:
        649
        `,

        metadata:{
            productId:29,
            name:"Pyrite Bracelet",
            price:649
        }

    })

];



await createVectorStore(documents);