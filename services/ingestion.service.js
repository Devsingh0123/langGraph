import { convertProductsToDocuments } from "../utils/product.document.js";
import { createVectorStore } from "../vectorstore/pinecone.js";
import { fetchAllProducts } from "./product.service.js";



export async function ingestProducts() {

    console.log("Fetching products...");

    const products = await fetchAllProducts();

    console.log(`Fetched ${products.length} products`);

    const documents = convertProductsToDocuments(products);

    console.log(`Converted ${documents.length} documents`);

    await createVectorStore(documents);

    console.log("All products uploaded to Pinecone");
}