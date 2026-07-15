import test from "node:test";
import assert from "node:assert/strict";

import { money, stockLabel } from "../utils/product.format.js";
import { getLatestUserMessage } from "../utils/conversation.js";
import { heuristicTurn } from "../nodes/understandTurn.node.js";
import { chatbotGraph } from "../graph/chatbot.graph.js";

test("formats catalog prices and stock safely", () => {
  assert.equal(money(1149), "INR 1,149");
  assert.equal(stockLabel({ stock_status: "few_left", stock_qty: 2 }), "Few left");
  assert.equal(stockLabel({ stock_status: "in_stock", stock_qty: 0 }), "Out of stock");
});

test("classifies selection, comparison, alternatives, and clarification without an LLM", () => {
  const state = { activeProductId: 9, shoppingContext: { lastDiscoveryQuery: "wealth bracelet" } };
  assert.equal(heuristicTurn(state, "2").action, "SELECT_PRODUCT");
  assert.deepEqual(heuristicTurn(state, "compare 1 and 2").comparisonIndexes, [1, 2]);
  assert.equal(heuristicTurn(state, "show other options").action, "SHOW_ALTERNATIVES");
  assert.equal(heuristicTurn(state, "help").action, "CLARIFY");
  assert.equal(heuristicTurn(state, "what is the price?").action, "PRODUCT_PRICE");
});

test("LangGraph retains and resets shopping state by session", async () => {
  const config = { configurable: { thread_id: `state-test-${Date.now()}` } };
  const result = await chatbotGraph.invoke({ messages: [{ role: "user", content: "reset" }] }, config);
  assert.equal(result.shownProducts.length, 0);
  assert.equal(result.activeProductId, null);
  assert.match(result.messages.at(-1).content, /start fresh/i);
  const snapshot = await chatbotGraph.getState(config);
  assert.equal(snapshot.values.shoppingContext.lastDiscoveryQuery, null);
});

test("gets the latest customer message when conversation includes an assistant reply", () => {
  assert.equal(getLatestUserMessage([{ role: "user", content: "show pyrite" }, { role: "assistant", content: "Here are options" }]), "show pyrite");
});
