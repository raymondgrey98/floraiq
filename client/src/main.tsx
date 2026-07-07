import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// PWA: offline support + installable from browser (production builds only,
// so it never interferes with Vite HMR in dev)
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* SW unsupported (e.g. some WebViews) — app works normally without it */
    });
  });
}
