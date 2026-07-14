import "dotenv/config";

import { searchProducts } from "./services/product.service.js";

const products = await searchProducts(
    "I want a bracelet for wealth"
);

console.log(products);