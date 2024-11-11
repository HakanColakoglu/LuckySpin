import { Server } from "http";

// Interface to define the shutdown functions for services
interface ShutdownFunctions {
  closePostgres?: () => Promise<void>;
}

const shutdownServices = (server: Server, services: ShutdownFunctions) => {
  const shutdown = async () => {
    console.log("Gracefully shutting down...");
    server.close(async () => {
      console.log("HTTP server closed");

      // Close PostgreSQL client if the shutdown function exists
      if (services.closePostgres) {
        try {
          await services.closePostgres();
        } catch (err) {
          console.error("Error disconnecting PostgreSQL client:", err);
        }
      }

      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

export { shutdownServices };
