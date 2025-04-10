import { Request, Response } from 'express';
import { ApiError, asyncHandler } from '../middleware/errorHandler';
import * as productService from '../services/productService';
import * as performanceFeatureService from '../services/performanceFeatureService';
import { ProductFilter } from '../models/Product';

// Get all products with filtering, sorting and pagination
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const filters: ProductFilter = {
    category: req.query.category as string,
    minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
    maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
    featured: req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined,
    sortBy: req.query.sortBy as any,
    sortDirection: req.query.sortDirection as any,
    limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
  };

  const result = await productService.getProducts(filters);

  res.status(200).json({
    success: true,
    count: result.products.length,
    total: result.total,
    data: result.products
  });
});

// Get a product by ID
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);
  const product = await productService.getProductById(productId);

  if (!product) {
    throw new ApiError(404, `Product not found with ID: ${productId}`);
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// Get featured products
export const getFeaturedProducts = asyncHandler(async (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
  const products = await productService.getFeaturedProducts(limit);

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// Search products
export const searchProducts = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query.q as string;
  
  if (!query) {
    throw new ApiError(400, 'Search query is required');
  }
  
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const products = await productService.searchProducts(query, limit);

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// Get product categories
export const getProductCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await productService.getProductCategories();

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

// Performance feature: Get product recommendations
export const getProductRecommendations = asyncHandler(async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);
  const size = req.query.size as 'small' | 'medium' | 'large' || 'medium';
  
  // Simulate a slight delay to test frontend loading states
  const delay = req.query.delay ? parseInt(req.query.delay as string) : 0;
  
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, Math.min(delay, 5000)));
  }
  
  const recommendations = await performanceFeatureService.getProductRecommendations(productId, size);

  res.status(200).json({
    success: true,
    count: recommendations.length,
    data: recommendations
  });
});

// Performance feature: Get high resolution images
export const getHighResolutionImages = asyncHandler(async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);
  const images = await performanceFeatureService.getHighResolutionImages(productId);

  if (!images) {
    throw new ApiError(404, `Images not found for product ID: ${productId}`);
  }

  res.status(200).json({
    success: true,
    data: images
  });
});

// Performance feature: Get detailed product report
export const getDetailedProductReport = asyncHandler(async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);
  
  // Simulate a heavier workload to test frontend performance
  const report = await performanceFeatureService.getDetailedProductReport(productId);

  if (!report) {
    throw new ApiError(404, `Report not available for product ID: ${productId}`);
  }

  res.status(200).json({
    success: true,
    data: report
  });
});