# Astrotring Shopping Assistant

A multi-turn astrology ecommerce assistant exposed as an Express API. LangGraph manages the conversation workflow and state, Pinecone performs semantic product discovery, and the product catalog is the authoritative source for every price, stock, description, benefit, and usage instruction shown to customers.

## Architecture

```text
Customer
   |
   v
POST /api/chat --> Express validation and error handling
   |                         |
   v                         v
LangGraph session <------ MemorySaver checkpoint
   |
   +--> understandTurn
          |
          +--> discoverProducts --> Pinecone vector search --> product IDs
          |                              |                       |
          |                              +-----------------------+
          |                                   catalog lookup
          +--> productInfo -------------> catalog lookup
          +--> clarify
          +--> chat
   |
   v
JSON: response, product cards, active product ID
```

## Folder structure

```text
app.js                 Express application, middleware, health check, and error handling
index.js               server entrypoint
config/                LLM, embedding, and Pinecone clients
controllers/           HTTP request handlers
data/                  local catalog fallback
graph/                 LangGraph state schema and workflow
nodes/                 workflow actions
prompts/               LLM prompts
routes/                API routes
scripts/               catalog ingestion command
services/              catalog and ingestion services
test/                  node:test checks
utils/                 formatting, conversation, and document helpers
vectorstore/           Pinecone adapter
```

## LangGraph workflow

```text
START -> understandTurn -> discoverProducts -> END
                       -> productInfo      -> END
                       -> clarify          -> END
                       -> chat             -> END
```

State is isolated by the `sessionId` supplied on each request. It stores the transcript, currently shown product cards, selected product ID, and most recent discovery query. Supported turns include discovery, alternatives, selection, price, availability, details, usage, comparison, clarification, and reset (`reset`, `start over`, or `new search`).

### Node responsibilities

- `understandTurn`: classifies the latest user message into an action and any referenced product indexes.
- `discoverProducts`: runs Pinecone search, resolves the result back through the catalog, and returns product cards.
- `productInfo`: loads authoritative catalog details for selected or referenced products and handles comparisons.
- `clarify`: asks for missing information or clears the shopping context on reset.
- `chat`: handles non-shopping conversation with the general LLM.

## RAG pipeline

1. `npm.cmd run ingest` fetches active products and converts them to LangChain documents.
2. Gemini embeds the documents and Pinecone stores them.
3. A shopping request searches Pinecone and receives relevant product IDs.
4. The catalog service loads those IDs from the catalog API, with the checked-in catalog as a fallback.
5. The response is formatted only from the catalog result.

Pinecone metadata is never used as product truth; it only discovers catalog IDs.

## Environment variables

Copy `.env.example` to `.env`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | No | HTTP port, default `5001`. |
| `CORS_ORIGIN` | No | `*` or comma-separated frontend origins. |
| `GROQ_API_KEY` | For LLM features | General chat and ambiguous intent resolution. |
| `GOOGLE_API_KEY` | For RAG | Gemini embedding key. |
| `PINECONE_API_KEY` | For RAG | Pinecone API key. |
| `PINECONE_INDEX_NAME` | For RAG | Existing Pinecone index. |
| `PRODUCT_CATALOG_URL` | No | Catalog endpoint override. |
| `PRODUCT_DETAIL_URL_TEMPLATE` | No | Detail endpoint containing `:id`. |

## Pinecone setup

Create a Pinecone index compatible with the output dimension of `gemini-embedding-001`. After configuring environment variables, index the catalog:

```powershell
npm.cmd run ingest
```

Re-run ingestion whenever catalog content changes. Product IDs must remain stable because they connect vector matches to catalog records.

## Installation and development

```powershell
npm.cmd install
Copy-Item .env.example .env
npm.cmd test
npm.cmd run dev
```

For a production process:

```powershell
npm.cmd start
```

## Production deployment

- Terminate TLS at a reverse proxy or hosting platform.
- Set `CORS_ORIGIN` to known frontend origins.
- Run ingestion as a controlled deployment or scheduled job, not in the web process.
- Monitor catalog, Pinecone, Gemini, and Groq failures. The API returns a non-fabricated fallback on dependency failures.
- `MemorySaver` persists sessions only for one process lifetime. Replace it with a shared LangGraph saver such as Redis or Postgres before multi-instance deployment or restart-safe persistence is required.

## API documentation

### `GET /health`

Returns:

```json
{ "status": "ok" }
```

### `POST /api/chat`

Request:

```json
{
  "sessionId": "customer-123",
  "message": "I need a bracelet for wealth"
}
```

Response:

```json
{
  "sessionId": "customer-123",
  "response": "Here are the best matches I found: ...",
  "products": [
    {
      "id": 82,
      "name": "Pyrite Anklet",
      "slug": "pyrite-anklet",
      "image": "https://...",
      "price": 649,
      "category": "Pyrite"
    }
  ],
  "activeProductId": null
}
```

`message` must be a non-empty string up to 2,000 characters. `sessionId` must be a non-empty string up to 128 characters. Invalid requests return `400`; unknown routes return `404`; unexpected errors return `500`.

## Conversation flow

```text
Customer: I need something for wealth under 1000
Assistant: Here are the best matches I found: 1, 2, and 3.

Customer: 1
Assistant: Selected product. What would you like to know?

Customer: Is it in stock? How do I use it?
Assistant: Current catalog-backed availability and usage instructions.

Customer: Compare 1 and 2
Assistant: Catalog-backed factual comparison.

Customer: Show other options
Assistant: New Pinecone-discovered products.
```

## Verification

```powershell
npm.cmd test
Get-ChildItem -Recurse -File -Filter *.js | ForEach-Object { node --check $_.FullName }
```

The test suite covers formatting, deterministic intent routing, LangGraph reset/state retention, health routing, and invalid chat request handling. The syntax sweep above verifies all local JavaScript imports parse successfully.

## Future improvements

- Add a shared persistent LangGraph checkpoint saver.
- Add authentication, customer profiles, carts, orders, and checkout integrations.
- Add catalog webhooks and namespace-aware reindexing.
- Add rate limiting, tracing, metrics, and dependency health checks.
- Add isolated Pinecone/catalog integration fixtures for full external-service tests.
