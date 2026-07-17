import { Request, Response } from 'express';
import { AppDataSource } from '../../db/datasource';
import { Product } from '../entities/productEntity';
import { Review } from '../entities/reviewEntity';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { sortBy } = req.query; // e.g. ?sortBy=expirationTime, distance, or rating

    const productRepo = AppDataSource.getRepository(Product);

    let orderQuery: any = {};
    if (sortBy === 'expirationTime') {
      orderQuery = { spoilageTime: 'ASC' };
    } else if (sortBy === 'distance') {
      orderQuery = { distance: 'ASC' };
    } else if (sortBy === 'rating') {
      orderQuery = { rating: 'DESC' };
    } else {
      orderQuery = { createdAt: 'DESC' }; // Default
    }

    const products = await productRepo.find({
      order: orderQuery,
      relations: ['reviews'],
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const addReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    
    // Extracted from JWT middleware
    const userName = (req as any).user?.name || (req as any).user?.username || 'Anonymous';

    const productRepo = AppDataSource.getRepository(Product);
    const reviewRepo = AppDataSource.getRepository(Review);

    const product = await productRepo.findOne({ where: { productId } });
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    // Protected Product logic
    if (product.isProtected) {
      // e.g. logic: restrict based on user role or verification.
      // Assuming req.user contains role or isVerified flag.
      const isVerified = (req as any).user?.isVerified;
      if (!isVerified) {
        res.status(403).json({ error: 'Only verified users can review protected products' });
        return;
      }
    }

    const review = reviewRepo.create({
      product,
      userName,
      rating,
      comment
    });

    await reviewRepo.save(review);

    // Update product rating
    product.rating = (product.rating + rating) / 2; // naive average for simplicity
    await productRepo.save(product);

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit review' });
  }
};
