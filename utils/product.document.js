import { Document } from "@langchain/core/documents";

export function convertProductsToDocuments(products) {
  return products.map((product) => {
    const content = `
Product Name:
${product.name}

Category:
${product.category?.name || ""}

Description:
${product.description || ""}

Benefits:
${product.benefits || ""}

Price:
${product.after_price || ""}

Stock Status:
${product.stock_status || ""}
`;

    const metadata = {
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.after_price,
      category: product.category?.name,
    };

    return new Document({
      pageContent: content,
      metadata,
    });
  });
}
