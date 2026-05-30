import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import plantRoutes from "./routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(cors({ origin: "*" }));
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));
  app.use("/api", plantRoutes);

  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      version: "2.0.0",
      services: { ai: "OpenRouter (Gemma 4 31B)", vision: "OpenRouter Vision", languages: 25 },
      timestamp: new Date().toISOString(),
    });
  });

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 7171;

  server.listen(port, () => {
    console.log(`
╔══════════════════════════════════════╗
║   🌿 FloraIQ — Nature Intelligence  ║
║   Powered by OpenRouter AI           ║
╚══════════════════════════════════════╝

✓ Server: http://localhost:${port}
✓ AI: OpenRouter (Gemma 4 31B + Vision)
✓ Languages: 25+
`);
  });

  process.on("SIGTERM", () => {
    server.close(() => process.exit(0));
  });
}

startServer().catch(console.error);
