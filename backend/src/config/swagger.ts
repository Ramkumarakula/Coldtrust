import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { Express } from 'express';
import { logger } from './logger';

export const setupSwagger = (app: Express): void => {
  try {
    const swaggerPath = path.join(__dirname, '../swagger/swagger.yaml');
    const swaggerDocument = YAML.load(swaggerPath);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    logger.info('Swagger UI initialized at /api-docs');
  } catch (error) {
    logger.error('Failed to initialize Swagger UI:', error);
  }
};
