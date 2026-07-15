import cors from "cors";
import express from "express";

import chatRouter from "./routes/chat.routes.js";

const app = express();
const corsOrigin = process.env.CORS_ORIGIN || "*";

app.disable("x-powered-by");
app.use(cors({ origin: corsOrigin === "*" ? true : corsOrigin.split(",").map((origin) => origin.trim()) }));
app.use(express.json({ limit: "32kb" }));
app.use("/api/chat", chatRouter);

app.get("/", (_req, res) => res.json({ message: "Astrotring AI Server Running" }));
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use((_req, res) => res.status(404).json({ message: "Route not found" }));
app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ message: "Request body must be valid JSON" });
  }
  console.error("Unhandled request error:", error);
  return res.status(500).json({ message: "Something went wrong" });
});

export default app;
