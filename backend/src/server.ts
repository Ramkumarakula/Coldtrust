import app from './app';
import { serverConfig } from './config/server';
import { logger } from './config/logger';

app.listen(serverConfig.port, () => {
  logger.info(`ColdTrust Backend REST API server running on port ${serverConfig.port} [${serverConfig.nodeEnv}]`);
  logger.info(`Swagger UI API Documentation available at http://localhost:${serverConfig.port}/api-docs`);
});
