import axios from "axios";
import { searchVectorStore } from "../vectorstore/pinecone.js";

export async function fetchAllProducts() {
  const response = await axios.get(
    "https://backend.astrotring.shop/api/products",
  );

  return response.data.data;
}

// Semantic Search
export async function searchProducts(query) {
  const documents = await searchVectorStore(query, 3);

  const context = documents.map((doc) => doc.pageContent).join("\n\n");

  return {
    documents,
    context,
  };
}
