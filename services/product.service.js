import axios from "axios";
import localProducts from "../data/products.json" with { type: "json" };
import { searchVectorStore } from "../vectorstore/pinecone.js";

const CATALOG_URL = "https://backend.astrotring.shop/api/products";
const PRODUCT_DETAIL_URL_TEMPLATE = process.env.PRODUCT_DETAIL_URL_TEMPLATE;
const CACHE_TTL_MS = 60_000;
let catalogCache = { products: null, expiresAt: 0 };

function validProduct(product) {
  return product && product.id !== undefined && typeof product.name === "string";
}

export async function fetchAllProducts({ forceRefresh = false } = {}) {
  if (!forceRefresh && catalogCache.products && Date.now() < catalogCache.expiresAt) {
    return catalogCache.products;
  }

  try {
    const response = await axios.get(CATALOG_URL, { timeout: 10_000 });
    const products = Array.isArray(response.data?.data) ? response.data.data.filter(validProduct) : [];
    if (products.length > 0) {
      catalogCache = { products, expiresAt: Date.now() + CACHE_TTL_MS };
      return products;
    }
  } catch (error) {
    console.warn("Catalog API unavailable; using local catalog fallback.", error.message);
  }

  const products = localProducts.filter(validProduct);
  catalogCache = { products, expiresAt: Date.now() + CACHE_TTL_MS };
  return products;
}

export async function getProductsByIds(ids) {
  const requestedIds = [...new Set(ids.map(String))];
  const products = await fetchAllProducts();
  const byId = new Map(products.map((product) => [String(product.id), product]));
  return requestedIds.map((id) => byId.get(id)).filter(Boolean);
}

export async function getProductById(id) {
  if (PRODUCT_DETAIL_URL_TEMPLATE) {
    try {
      const url = PRODUCT_DETAIL_URL_TEMPLATE.replace(":id", encodeURIComponent(String(id)));
      const response = await axios.get(url, { timeout: 10_000 });
      const product = response.data?.data;
      if (validProduct(product)) return product;
    } catch (error) {
      console.warn("Product detail API unavailable; falling back to catalog lookup.", error.message);
    }
  }

  const [product] = await getProductsByIds([id]);
  return product || null;
}

export function toProductCard(product) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug || null,
    image: product.image || null,
    price: product.after_price ?? null,
    category: product.category?.name || null,
  };
}

// Pinecone is used only to discover semantically relevant product IDs.
export async function searchProducts(query, k = 5) {
  return searchVectorStore(query, k);
}
