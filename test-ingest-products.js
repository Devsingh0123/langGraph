import "dotenv/config";
import { ingestProducts } from "./services/ingestion.service.js";



await ingestProducts();