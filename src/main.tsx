import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Render the app
createRoot(document.getElementById("root")!).render(<App />);

// Register Service Worker for offline support and caching
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("Service Worker registered:", registration.scope);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 1000 * 60 * 60); // Check every hour
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}
