import { Router } from 'express';
import { productCtrl } from '../controllers/control';
// Assuming you have some sort of JWT middleware
// import { authMiddleware } from '../utils/authMiddleware';

const router = Router();

// Define product routes
router.get('/products', productCtrl.getProducts);

// Use authMiddleware to populate req.user from JWT
// router.post('/products/:productId/reviews', authMiddleware, productCtrl.addReview);
router.post('/products/:productId/reviews', productCtrl.addReview);

export default router;
