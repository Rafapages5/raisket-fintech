# Review API Endpoints

## Overview

This document outlines the backend API endpoints for managing product reviews, including creating, retrieving, updating, and deleting reviews. These endpoints are designed to handle user reviews and store their email addresses for future communication.

## API Endpoints

### 1. Create a New Review

#### Endpoint
```
POST /api/reviews
```

#### Request Body
```json
{
  "productId": "uuid",
  "userId": "uuid (optional)",
  "reviewerName": "string",
  "reviewerEmail": "string",
  "rating": "integer (1-5)",
  "title": "string (optional)",
  "comment": "string"
}
```

#### Response Format
```json
{
  "message": "Review created successfully",
  "review": {
    "id": "uuid",
    "productId": "uuid",
    "userId": "uuid (optional)",
    "reviewerName": "string",
    "reviewerEmail": "string",
    "rating": "integer",
    "title": "string (optional)",
    "comment": "string",
    "isApproved": "boolean",
    "approvedBy": "uuid (optional)",
    "approvedAt": "timestamp (optional)",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

### 2. Get Reviews for a Product

#### Endpoint
```
GET /api/reviews/product/:productId
```

#### Query Parameters
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| limit | integer | Number of reviews per page | `10` |
| offset | integer | Offset for pagination | `0` |
| approvedOnly | boolean | Only approved reviews | `true` |
| sortBy | string | Sort by field | `created_at` |
| sortOrder | string | Sort order | `DESC` |

#### Response Format
```json
{
  "reviews": [
    {
      "id": "uuid",
      "productId": "uuid",
      "userId": "uuid (optional)",
      "reviewerName": "string",
      "reviewerEmail": "string",
      "rating": "integer",
      "title": "string (optional)",
      "comment": "string",
      "isApproved": "boolean",
      "approvedBy": "uuid (optional)",
      "approvedAt": "timestamp (optional)",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ],
  "stats": {
    "productId": "uuid",
    "averageRating": "number",
    "reviewCount": "integer"
  },
  "pagination": {
    "limit": "integer",
    "offset": "integer"
  }
}
```

### 3. Get a Specific Review by ID

#### Endpoint
```
GET /api/reviews/:id
```

#### Response Format
```json
{
  "review": {
    "id": "uuid",
    "productId": "uuid",
    "userId": "uuid (optional)",
    "reviewerName": "string",
    "reviewerEmail": "string",
    "rating": "integer",
    "title": "string (optional)",
    "comment": "string",
    "isApproved": "boolean",
    "approvedBy": "uuid (optional)",
    "approvedAt": "timestamp (optional)",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

### 4. Update a Review (Approve/Reject)

#### Endpoint
```
PUT /api/reviews/:id
```

#### Request Body
```json
{
  "isApproved": "boolean (optional)",
  "approvedBy": "uuid (optional)",
  "approvedAt": "timestamp (optional)"
}
```

#### Response Format
```json
{
  "message": "Review updated successfully",
  "review": {
    "id": "uuid",
    "productId": "uuid",
    "userId": "uuid (optional)",
    "reviewerName": "string",
    "reviewerEmail": "string",
    "rating": "integer",
    "title": "string (optional)",
    "comment": "string",
    "isApproved": "boolean",
    "approvedBy": "uuid (optional)",
    "approvedAt": "timestamp (optional)",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

### 5. Delete a Review

#### Endpoint
```
DELETE /api/reviews/:id
```

#### Response Format
```json
{
  "message": "Review deleted successfully"
}
```

### 6. Get Reviewer Emails (Admin Only)

#### Endpoint
```
GET /api/reviews/emails
```

#### Response Format
```json
{
  "reviewers": [
    {
      "email": "string",
      "name": "string"
    }
  ],
  "count": "integer"
}
```

## Implementation Plan

#### Endpoint
```
GET /api/reviews
```

#### Query Parameters
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| limit | integer | Number of reviews per page | `20` |
| offset | integer | Offset for pagination | `0` |
| approvedOnly | boolean | Only approved reviews | `false` |

#### Response Format
```json
{
  "reviews": [
    {
      "id": "uuid",
      "productId": "uuid",
      "userId": "uuid (optional)",
      "reviewerName": "string",
      "reviewerEmail": "string",
      "rating": "integer",
      "title": "string (optional)",
      "comment": "string",
      "isApproved": "boolean",
      "approvedBy": "uuid (optional)",
      "approvedAt": "timestamp (optional)",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ],
  "pagination": {
    "limit": "integer",
    "offset": "integer",
    "totalCount": "integer",
    "totalPages": "integer"
  }
}
```

## Implementation Plan

### 1. Database Schema

The reviews table has been added to the database with the following structure:

```sql
CREATE TABLE IF NOT EXISTS financial.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Product relationship
    product_id UUID NOT NULL REFERENCES financial.products(id) ON DELETE CASCADE,
    
    -- User relationship (optional for non-registered users)
    user_id UUID REFERENCES core.users(id) ON DELETE SET NULL,
    
    -- Review details
    reviewer_name VARCHAR(100) NOT NULL,
    reviewer_email VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT NOT NULL,
    
    -- Approval status
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES core.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Backend Implementation

The backend implementation includes:

1. **Review Model**: Handles database operations for reviews
2. **Review Controller**: Handles API requests and responses
3. **Review Routes**: Defines API endpoints for reviews

### 3. Frontend Integration

The frontend has been updated to send review data to the new API endpoint:

```typescript
const response = await fetch('/api/reviews', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    productId,
    reviewerName: data.name,
    reviewerEmail: data.email,
    rating: data.rating,
    title: data.title,
    comment: data.comment,
  }),
});
```

## Security Considerations

1. **Input Validation**: All review data is validated before being stored in the database
2. **Rate Limiting**: API endpoints should implement rate limiting to prevent abuse
3. **Authentication**: Admin endpoints require proper authentication
4. **Data Privacy**: User email addresses are stored securely and used only for review management

## Error Handling

All API endpoints return appropriate HTTP status codes and error messages:

- 400: Bad Request (invalid parameters)
- 404: Not Found (review or product not found)
- 500: Internal Server Error (database or server issues)