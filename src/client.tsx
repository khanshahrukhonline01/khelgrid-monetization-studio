import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";

// Ensure process and process.env exist on window for client libraries
if (typeof window !== "undefined") {
  if (!window.process) {
    (window as unknown as { process: { env: Record<string, string> } }).process = {
      env: { NODE_ENV: "development" },
    };
  }
}

try {
  hydrateRoot(document, <StartClient />, {
    onRecoverableError(error, errorInfo) {
      const msg = error instanceof Error ? error.message : String(error);
      if (
        msg.includes("hydrat") ||
        msg.includes("did not match") ||
        msg.includes("client properties")
      ) {
        return;
      }
      console.warn("[KhelGrid] Recoverable hydration error:", error, errorInfo);
    },
  });
} catch (error) {
  console.error("[KhelGrid] Client hydration failed:", error);
}
