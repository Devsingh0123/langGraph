function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

export function money(value) {
  return Number.isFinite(Number(value)) ? `INR ${Number(value).toLocaleString("en-IN")}` : "Price unavailable";
}

export function stockLabel(product) {
  if (!product || product.stock_status === "out_of_stock" || Number(product.stock_qty) <= 0) return "Out of stock";
  if (product.stock_status === "few_left") return "Few left";
  return "In stock";
}

export function productFacts(product, { includeUsage = false, includeDetails = false } = {}) {
  const lines = [`**${cleanText(product.name)}**`, `Price: ${money(product.after_price)}${product.before_price ? ` (was ${money(product.before_price)})` : ""}`, `Availability: ${stockLabel(product)}`];
  if (product.category?.name) lines.push(`Category: ${cleanText(product.category.name)}`);
  if (includeDetails && product.description) lines.push(`About: ${cleanText(product.description)}`);
  if (includeDetails && product.benefits) lines.push(`Benefits: ${cleanText(product.benefits)}`);
  if (includeUsage && product.how_to_use) lines.push(`How to use: ${cleanText(product.how_to_use)}`);
  return lines.join("\n");
}

export function shortReason(product) {
  const source = cleanText(product?.description || product?.benefits);
  return source ? source.split(/[.!\r\n]/).find(Boolean)?.trim() || "Matches your request." : "Matches your request.";
}
