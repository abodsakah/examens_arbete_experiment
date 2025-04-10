import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import config from './config';
import { logger } from './utils/logger';
import { testConnection, initDatabase } from './config/database';
import { setupDatabase } from './utils/setupDatabase';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';
import { apiLimiter, benchmarkLimiter } from './middleware/rateLimiter';
import { setupStaticFiles } from './middleware/staticFiles';
import { initTrackingSimulation } from './services/trackingSimulationService';

// Import routes
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import benchmarkRoutes from './routes/benchmarkRoutes';

// Initialize express app
const app = express();

// Apply middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(express.json({ limit: '1mb' })); // Parse JSON request bodies with size limit
app.use(express.urlencoded({ extended: true, limit: '1mb' })); // Parse URL-encoded request bodies

// Configure CORS
app.use(
  cors({
    origin: '*',
  })
);

// Setup static file serving
setupStaticFiles(app);

// Apply rate limiters to routes that need them
app.use('/api/v1/benchmark', benchmarkLimiter);
app.use('/api', apiLimiter);

// API routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/benchmark', benchmarkRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Root endpoint
app.get('/api/v1', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the WebShop API',
    version: '1.0.0',
    endpoints: {
      products: '/api/v1/products',
      orders: '/api/v1/orders',
      benchmark: '/api/v1/benchmark',
    },
  });
});

// Handle 404 errors
app.use(notFoundHandler);

// Handle all other errors
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Setup database if it doesn't exist
    await setupDatabase();

    // Test database connection
    await testConnection();

    // Initialize database tables and seed data
    await initDatabase();

    // Start the order tracking simulation
    initTrackingSimulation();

    // Start the server
    app.listen(config.server.port, () => {
      logger.info(`Server running in ${config.server.nodeEnv} mode on port ${config.server.port}`);
      logger.info(`API is available at http://localhost:${config.server.port}/api/v1`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
