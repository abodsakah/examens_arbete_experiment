import express from 'express';
import * as benchmarkController from '../controllers/benchmarkController';

const router = express.Router();

// Benchmark routes
router.post('/', benchmarkController.submitBenchmarkData);
router.get('/', benchmarkController.getBenchmarkData);
router.get('/stats', benchmarkController.getBenchmarkStats);

export default router;