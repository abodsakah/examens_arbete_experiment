import express from 'express';
import * as productController from '../controllers/productController';

const router = express.Router();

// Standard product routes
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/categories', productController.getProductCategories);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);

// Performance test routes
router.get('/:id/recommendations', productController.getProductRecommendations);
router.get('/:id/high-res-images', productController.getHighResolutionImages);
router.get('/:id/detailed-report', productController.getDetailedProductReport);

export default router;