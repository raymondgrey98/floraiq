import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import plantRoutes from "./routes.js";
import { mcpRouter } from "./mcp-server.js";

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
  app.use("/mcp", mcpRouter); // MCP server — callable by Claude Code, mcporter, and other agents

  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      version: "2.0.0",
      services: {
        ai:         "OpenRouter (Gemma 4 31B)",
        vision:     "OpenRouter Vision",
        languages:  25,
        image:      "rastermill (Photon + native fallbacks)",
        mcp:        "mcporter-compatible MCP server at /mcp",
      },
      timestamp: new Date().toISOString(),
    });
  });

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  // Dev: always 7171 (the Vite proxy target) — a stray PORT env var (e.g. set by
  // preview harnesses to 3000) would otherwise collide with Vite and kill the API.
  // Production: respect PORT for deployment platforms.
  const port =
    process.env.NODE_ENV === "production"
      ? process.env.PORT || 7171
      : process.env.BACKEND_PORT || 7171;

  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.error(`[FloraIQ] Port ${port} is already in use — is another dev server running?`);
      process.exit(1);
    }
    throw err;
  });

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
