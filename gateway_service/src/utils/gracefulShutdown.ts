import { Server } from 'http';

// Interface to define the shutdown functions for services
interface ShutdownFunctions {
  closeRedis?: () => Promise<void>;
}

const shutdownServices = (server: Server, services: ShutdownFunctions) => {
  const shutdown = async () => {
    console.log('Gracefully shutting down...');
    server.close(async () => {
      console.log('HTTP server closed');

      // Close Redis client if the shutdown function exists
      if (services.closeRedis) {
        try {
          await services.closeRedis();
        } catch (err) {
          console.error('Error disconnecting Redis client:', err);
        }
      }

      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

export { shutdownServices };
