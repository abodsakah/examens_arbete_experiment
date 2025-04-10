import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import * as benchmarkService from '../services/benchmarkService';

// Submit benchmark data
export const submitBenchmarkData = asyncHandler(async (req: Request, res: Response) => {
  const benchmarkData = req.body;
  
  // Add required fields if missing
  if (!benchmarkData.id) {
    benchmarkData.id = `benchmark-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  
  if (!benchmarkData.timestamp) {
    benchmarkData.timestamp = Date.now();
  }
  
  if (!benchmarkData.clientId) {
    benchmarkData.clientId = req.ip || 'unknown';
  }
  
  if (!benchmarkData.userAgent) {
    benchmarkData.userAgent = req.headers['user-agent'] || 'unknown';
  }
  
  // Store the benchmark data
  const result = benchmarkService.addBenchmarkData(benchmarkData);
  
  res.status(201).json({
    success: true,
    message: 'Benchmark data received successfully',
    id: result.id
  });
});

// Get benchmark data
export const getBenchmarkData = asyncHandler(async (req: Request, res: Response) => {
  const clientId = req.query.clientId as string;
  const data = benchmarkService.getBenchmarkData(clientId);
  
  res.status(200).json({
    success: true,
    count: data.length,
    data
  });
});

// Get benchmark statistics
export const getBenchmarkStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = benchmarkService.getBenchmarkStats();
  
  res.status(200).json({
    success: true,
    data: stats
  });
});