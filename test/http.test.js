import test from "node:test";
import assert from "node:assert/strict";

import app from "../app.js";

async function request(server, path, options = {}) {
  const { port } = server.address();
  return fetch(`http://127.0.0.1:${port}${path}`, options);
}

test("health and chat validation routes return documented responses", async (t) => {
  const server = app.listen(0);
  t.after(() => server.close());

  const health = await request(server, "/health");
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { status: "ok" });

  const invalid = await request(server, "/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ sessionId: "customer-1", message: "" }),
  });
  assert.equal(invalid.status, 400);
  assert.deepEqual(await invalid.json(), { message: "message must be a non-empty string" });

  const shopping = await request(server, "/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ sessionId: "customer-1", message: "I need a wealth bracelet" }),
  });
  assert.equal(shopping.status, 200);
  assert.match((await shopping.json()).response, /can't search the catalog/i);
});
