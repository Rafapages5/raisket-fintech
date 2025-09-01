/**
 * Review Controller for Raisket Platform
 * Handles API endpoints for product reviews
 */

import { Request, Response } from 'express';
import { ReviewModel, CreateReviewData } from '../models/Review';
import { Pool } from 'pg';

export class ReviewController {
  private reviewModel: ReviewModel;

  constructor(database: Pool) {
    this.reviewModel = new ReviewModel(database);
  }

  /**
   * Create a new review
   * POST /api/reviews
   */
  async createReview(req: Request, res: Response) {
    try {
      const reviewData: CreateReviewData = req.body;
      
      // Validate required fields
      if (!reviewData.productId || !reviewData.reviewerName || 
          !reviewData.reviewerEmail || !reviewData.rating || 
          !reviewData.comment) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['productId', 'reviewerName', 'reviewerEmail', 'rating', 'comment']
        });
      }
      
      // Validate rating range
      if (reviewData.rating < 1 || reviewData.rating > 5) {
        return res.status(400).json({
          error: 'Rating must be between 1 and 5'
        });
      }
      
      // Create the review
      const review = await this.reviewModel.createReview(reviewData);
      
      // Return the created review
      res.status(201).json({
        message: 'Review created successfully',
        review
      });
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({
        error: 'Failed to create review',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get reviews for a specific product
   * GET /api/reviews/product/:productId
   */
  async getReviewsByProductId(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const {
        limit = 10,
        offset = 0,
        approvedOnly = true,
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = req.query;
      
      // Validate productId
      if (!productId) {
        return res.status(400).json({
          error: 'productId is required'
        });
      }
      
      // Get reviews
      const reviews = await this.reviewModel.getReviewsByProductId(productId, {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        approvedOnly: approvedOnly === 'true',
        sortBy: sortBy as 'created_at' | 'rating',
        sortOrder: sortOrder as 'ASC' | 'DESC'
      });
      
      // Get review statistics
      const stats = await this.reviewModel.getProductReviewStats(productId);
      
      res.json({
        reviews,
        stats,
        pagination: {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string)
        }
      });
    } catch (error) {
      console.error('Error getting reviews:', error);
      res.status(500).json({
        error: 'Failed to get reviews',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get a specific review by ID
   * GET /api/reviews/:id
   */
  async getReviewById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Validate ID
      if (!id) {
        return res.status(400).json({
          error: 'Review ID is required'
        });
      }
      
      // Get the review
      const review = await this.reviewModel.getReviewById(id);
      
      if (!review) {
        return res.status(404).json({
          error: 'Review not found'
        });
      }
      
      res.json({ review });
    } catch (error) {
      console.error('Error getting review:', error);
      res.status(500).json({
        error: 'Failed to get review',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Update a review (approve/reject)
   * PUT /api/reviews/:id
   */
  async updateReview(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Validate ID
      if (!id) {
        return res.status(400).json({
          error: 'Review ID is required'
        });
      }
      
      // For now, we'll only allow updating approval status
      // In a real application, you would check user permissions here
      if (Object.keys(updateData).some(key => !['isApproved', 'approvedBy', 'approvedAt'].includes(key))) {
        return res.status(400).json({
          error: 'Only approval status can be updated',
          allowedFields: ['isApproved', 'approvedBy', 'approvedAt']
        });
      }
      
      // Update the review
      const review = await this.reviewModel.updateReview(id, updateData);
      
      if (!review) {
        return res.status(404).json({
          error: 'Review not found'
        });
      }
      
      res.json({
        message: 'Review updated successfully',
        review
      });
    } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).json({
        error: 'Failed to update review',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Delete a review
   * DELETE /api/reviews/:id
   */
  async deleteReview(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Validate ID
      if (!id) {
        return res.status(400).json({
          error: 'Review ID is required'
        });
      }
      
      // Delete the review
      const deleted = await this.reviewModel.deleteReview(id);
      
      if (!deleted) {
        return res.status(404).json({
          error: 'Review not found'
        });
      }
      
      res.json({
        message: 'Review deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({
        error: 'Failed to delete review',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get all reviews (admin only)
   * GET /api/reviews
   */
  async getAllReviews(req: Request, res: Response) {
    try {
      const {
        limit = 20,
        offset = 0,
        approvedOnly = false
      } = req.query;
      
      // Get all reviews
      const { reviews, totalCount } = await this.reviewModel.getAllReviews({
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        approvedOnly: approvedOnly === 'true'
      });
      
      res.json({
        reviews,
        pagination: {
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          totalCount,
          totalPages: Math.ceil(totalCount / parseInt(limit as string))
        }
      });
    } catch (error) {
      console.error('Error getting all reviews:', error);
      res.status(500).json({
        error: 'Failed to get reviews',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get unique reviewer emails (admin only)
   * GET /api/reviews/emails
   */
  async getReviewerEmails(req: Request, res: Response) {
    try {
      // Get unique reviewer emails
      const query = `
        SELECT DISTINCT reviewer_email, reviewer_name
        FROM financial.reviews
        WHERE reviewer_email IS NOT NULL
        ORDER BY reviewer_email
      `;
      
      const result = await (this.reviewModel as any).db.query(query);
      
      // Extract emails and names
      const reviewers = result.rows.map((row: any) => ({
        email: row.reviewer_email,
        name: row.reviewer_name
      }));
      
      res.json({
        reviewers,
        count: reviewers.length
      });
    } catch (error) {
      console.error('Error getting reviewer emails:', error);
      res.status(500).json({
        error: 'Failed to get reviewer emails',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}