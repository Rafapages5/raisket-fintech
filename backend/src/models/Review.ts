/**
 * Review Model for Raisket Platform
 * Handles product reviews and user information
 */

import { Pool, QueryResult } from 'pg';

// Review interface
export interface Review {
  id: string;
  productId: string;
  userId?: string;
  reviewerName: string;
  reviewerEmail: string;
  rating: number;
  title?: string;
  comment: string;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Review creation interface (without auto-generated fields)
export interface CreateReviewData {
  productId: string;
  userId?: string;
  reviewerName: string;
  reviewerEmail: string;
  rating: number;
  title?: string;
  comment: string;
}

// Review update interface
export interface UpdateReviewData {
  isApproved?: boolean;
  approvedBy?: string;
  approvedAt?: Date;
}

// Review statistics interface
export interface ProductReviewStats {
  productId: string;
  averageRating: number;
  reviewCount: number;
}

export class ReviewModel {
  private db: Pool;

  constructor(database: Pool) {
    this.db = database;
  }

  /**
   * Create a new review
   */
  async createReview(reviewData: CreateReviewData): Promise<Review> {
    const client = await this.db.connect();
    
    try {
      await client.query('BEGIN');
      
      // Insert the review
      const query = `
        INSERT INTO financial.reviews (
          product_id, user_id, reviewer_name, reviewer_email, 
          rating, title, comment, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING *
      `;
      
      const values = [
        reviewData.productId,
        reviewData.userId,
        reviewData.reviewerName,
        reviewData.reviewerEmail,
        reviewData.rating,
        reviewData.title,
        reviewData.comment
      ];
      
      const result = await client.query(query, values);
      
      // Update product review stats
      await this.updateProductReviewStats(client, reviewData.productId);
      
      await client.query('COMMIT');
      
      return this.mapRowToReview(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get a review by ID
   */
  async getReviewById(id: string): Promise<Review | null> {
    const query = `
      SELECT r.*, 
             u.email as user_email,
             p.name as product_name
      FROM financial.reviews r
      LEFT JOIN core.users u ON r.user_id = u.id
      LEFT JOIN financial.products p ON r.product_id = p.id
      WHERE r.id = $1
    `;
    
    const result = await this.db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapRowToReview(result.rows[0]);
  }

  /**
   * Get reviews for a product
   */
  async getReviewsByProductId(
    productId: string, 
    options: { 
      limit?: number; 
      offset?: number; 
      approvedOnly?: boolean;
      sortBy?: 'created_at' | 'rating';
      sortOrder?: 'ASC' | 'DESC';
    } = {}
  ): Promise<Review[]> {
    const {
      limit = 10,
      offset = 0,
      approvedOnly = true,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = options;
    
    let query = `
      SELECT r.*, 
             u.email as user_email
      FROM financial.reviews r
      LEFT JOIN core.users u ON r.user_id = u.id
      WHERE r.product_id = $1
    `;
    
    const params: any[] = [productId];
    let paramIndex = 2;
    
    if (approvedOnly) {
      query += ` AND r.is_approved = $${paramIndex}`;
      params.push(true);
      paramIndex++;
    }
    
    query += ` ORDER BY r.${sortBy} ${sortOrder}`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await this.db.query(query, params);
    
    return result.rows.map((row: any) => this.mapRowToReview(row));
  }

  /**
   * Get review statistics for a product
   */
  async getProductReviewStats(productId: string): Promise<ProductReviewStats> {
    const query = `
      SELECT 
        product_id,
        COALESCE(AVG(rating), 0) as average_rating,
        COUNT(*) as review_count
      FROM financial.reviews
      WHERE product_id = $1 AND is_approved = true
      GROUP BY product_id
    `;
    
    const result = await this.db.query(query, [productId]);
    
    if (result.rows.length === 0) {
      return {
        productId,
        averageRating: 0,
        reviewCount: 0
      };
    }
    
    const row = result.rows[0];
    return {
      productId,
      averageRating: parseFloat(row.average_rating),
      reviewCount: parseInt(row.review_count)
    };
  }

  /**
   * Update a review
   */
  async updateReview(id: string, updateData: UpdateReviewData): Promise<Review | null> {
    const client = await this.db.connect();
    
    try {
      await client.query('BEGIN');
      
      const fields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;
      
      if (updateData.isApproved !== undefined) {
        fields.push(`is_approved = $${paramIndex}`);
        values.push(updateData.isApproved);
        paramIndex++;
      }
      
      if (updateData.approvedBy !== undefined) {
        fields.push(`approved_by = $${paramIndex}`);
        values.push(updateData.approvedBy);
        paramIndex++;
      }
      
      if (updateData.approvedAt !== undefined) {
        fields.push(`approved_at = $${paramIndex}`);
        values.push(updateData.approvedAt);
        paramIndex++;
      }
      
      if (fields.length === 0) {
        throw new Error('No fields to update');
      }
      
      fields.push(`updated_at = NOW()`);
      
      const query = `
        UPDATE financial.reviews
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;
      
      values.push(id);
      
      const result = await client.query(query, values);
      
      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return null;
      }
      
      // If approval status changed, update product review stats
      if (updateData.isApproved !== undefined) {
        const review = result.rows[0];
        await this.updateProductReviewStats(client, review.product_id);
      }
      
      await client.query('COMMIT');
      
      return this.mapRowToReview(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Delete a review
   */
  async deleteReview(id: string): Promise<boolean> {
    const client = await this.db.connect();
    
    try {
      await client.query('BEGIN');
      
      // Get the product ID before deleting
      const productQuery = `SELECT product_id FROM financial.reviews WHERE id = $1`;
      const productResult = await client.query(productQuery, [id]);
      
      if (productResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return false;
      }
      
      const productId = productResult.rows[0].product_id;
      
      // Delete the review
      const query = `DELETE FROM financial.reviews WHERE id = $1`;
      const result = await client.query(query, [id]);
      
      // Update product review stats
      await this.updateProductReviewStats(client, productId);
      
      await client.query('COMMIT');
      
      return result.rowCount > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get all reviews with pagination
   */
  async getAllReviews(options: {
    limit?: number;
    offset?: number;
    approvedOnly?: boolean;
  } = {}): Promise<{ reviews: Review[]; totalCount: number }> {
    const { limit = 20, offset = 0, approvedOnly = false } = options;
    
    let countQuery = `SELECT COUNT(*) as count FROM financial.reviews`;
    const countParams: any[] = [];
    
    if (approvedOnly) {
      countQuery += ` WHERE is_approved = $1`;
      countParams.push(true);
    }
    
    const countResult = await this.db.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);
    
    let query = `
      SELECT r.*, 
             u.email as user_email,
             p.name as product_name
      FROM financial.reviews r
      LEFT JOIN core.users u ON r.user_id = u.id
      LEFT JOIN financial.products p ON r.product_id = p.id
    `;
    
    const params: any[] = [];
    let paramIndex = 1;
    
    if (approvedOnly) {
      query += ` WHERE r.is_approved = $${paramIndex}`;
      params.push(true);
      paramIndex++;
    }
    
    query += ` ORDER BY r.created_at DESC`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await this.db.query(query, params);
    
    return {
      reviews: result.rows.map((row: any) => this.mapRowToReview(row)),
      totalCount
    };
  }

  /**
   * Helper method to update product review statistics
   */
  private async updateProductReviewStats(client: any, productId: string): Promise<void> {
    const statsQuery = `
      SELECT 
        COALESCE(AVG(rating), 0) as average_rating,
        COUNT(*) as review_count
      FROM financial.reviews
      WHERE product_id = $1 AND is_approved = true
    `;
    
    const statsResult = await client.query(statsQuery, [productId]);
    const stats = statsResult.rows[0];
    
    const updateQuery = `
      UPDATE financial.products
      SET 
        average_rating = $1,
        review_count = $2,
        updated_at = NOW()
      WHERE id = $3
    `;
    
    await client.query(updateQuery, [
      parseFloat(stats.average_rating),
      parseInt(stats.review_count),
      productId
    ]);
  }

  /**
   * Helper method to map database row to Review interface
   */
  private mapRowToReview(row: any): Review {
    return {
      id: row.id,
      productId: row.product_id,
      userId: row.user_id,
      reviewerName: row.reviewer_name,
      reviewerEmail: row.reviewer_email || row.user_email,
      rating: row.rating,
      title: row.title,
      comment: row.comment,
      isApproved: row.is_approved,
      approvedBy: row.approved_by,
      approvedAt: row.approved_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}