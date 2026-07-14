import products from "./data/products.json" with {type:"json"};
import { convertProductsToDocuments } from "./utils/product.document.js";



const docs = convertProductsToDocuments(products);


console.log(docs.length);