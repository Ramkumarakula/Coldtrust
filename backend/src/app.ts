import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { apiRateLimiter } from './middleware/rateLimiter';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import { setupSwagger } from './config/swagger';
import shipmentRoutes from './routes/shipment.routes';
import healthRoutes from './routes/health.routes';

const app: Express = express();

// Security & Utility Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use('/api/', apiRateLimiter);

// Swagger API Documentation
setupSwagger(app);

// API Routes
app.use('/health', healthRoutes);
app.use('/api/shipments', shipmentRoutes);

// Global Error Handling Middleware
app.use(errorHandler);

export default app;
