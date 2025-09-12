/**
 * Review Routes for Raisket Platform
 * API endpoints for product reviews
 */

import { Router } from 'express';
import { ReviewController } from '../controllers/ReviewController';
import { Pool } from 'pg';

// Create router
const router = Router();

// In a real application, you would initialize the database connection properly
// For now, we'll use a placeholder
const database = {} as Pool;

// Initialize controller with database connection
const reviewController = new ReviewController(database);

// Routes
/**
 * @route POST /api/reviews
 * @desc Create a new review
 * @access Public
 */
router.post('/', reviewController.createReview.bind(reviewController));

/**
 * @route GET /api/reviews/product/:productId
 * @desc Get reviews for a specific product
 * @access Public
 */
router.get('/product/:productId', reviewController.getReviewsByProductId.bind(reviewController));

/**
 * @route GET /api/reviews/:id
 * @desc Get a specific review by ID
 * @access Public
 */
router.get('/:id', reviewController.getReviewById.bind(reviewController));

/**
 * @route PUT /api/reviews/:id
 * @desc Update a review (approve/reject)
 * @access Admin
 */
router.put('/:id', reviewController.updateReview.bind(reviewController));

/**
 * @route DELETE /api/reviews/:id
 * @desc Delete a review
 * @access Admin
 */
router.delete('/:id', reviewController.deleteReview.bind(reviewController));

/**
 * @route GET /api/reviews
 * @desc Get all reviews (admin only)
 * @access Admin
 */
router.get('/', reviewController.getAllReviews.bind(reviewController));

/**
 * @route GET /api/reviews/emails
 * @desc Get unique reviewer emails (admin only)
 * @access Admin
 */
router.get('/emails', reviewController.getReviewerEmails.bind(reviewController));

export default router;