# GasRápido API Documentation

## Overview

This document provides documentation for the GasRápido RESTful API, which serves as the backend interface for the mobile and web applications.

## Base URL

```
https://your-domain.com/api
```

## Authentication

All API endpoints require authentication using JWT tokens obtained through the Supabase authentication system. Tokens should be included in the `Authorization` header:

```
Authorization: Bearer <token>
```

## API Endpoints

### Invitations

#### Create Invitation
- **URL**: `/api/invites`
- **Method**: `POST`
- **Description**: Create a new invitation for clients, vendors, or couriers
- **Request Body**:
  ```json
  {
    "type": "client|vendor|courier",
    "email": "user@example.com",
    "expiryDays": 7
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "invite": {
      "id": "uuid",
      "code": "ABC123",
      "type": "client|vendor|courier",
      "email": "user@example.com",
      "status": "pending",
      "expiresAt": "2025-12-31T23:59:59Z"
    }
  }
  ```

#### Get Invitations
- **URL**: `/api/invites`
- **Method**: `GET`
- **Description**: Retrieve invitations with optional filtering
- **Query Parameters**:
  - `type`: Filter by invitation type (client, vendor, courier)
  - `status`: Filter by invitation status (pending, accepted, expired, revoked)
- **Response**:
  ```json
  {
    "success": true,
    "invites": [
      {
        "id": "uuid",
        "code": "ABC123",
        "type": "vendor",
        "email": "vendor@example.com",
        "status": "pending",
        "expiresAt": "2025-12-31T23:59:59Z"
      }
    ]
  }
  ```

### Verification

#### Upload Verification Document
- **URL**: `/api/verification/documents`
- **Method**: `POST`
- **Description**: Upload a document for verification
- **Request Body**: FormData with fields:
  - `userId`: User ID
  - `documentType`: Type of document (id, license, insurance, vehicle_registration)
  - `file`: The document file
- **Response**:
  ```json
  {
    "success": true,
    "document": {
      "id": "uuid",
      "userId": "user-uuid",
      "documentType": "id",
      "fileName": "document.pdf",
      "mimeType": "application/pdf",
      "fileSize": 1024,
      "status": "pending",
      "uploadedAt": "2025-12-31T23:59:59Z"
    }
  }
  ```

#### Get Verification Status
- **URL**: `/api/verification/status`
- **Method**: `GET`
- **Description**: Get verification status for a user
- **Query Parameters**:
  - `userId`: User ID
- **Response**:
  ```json
  {
    "success": true,
    "status": {
      "userId": "user-uuid",
      "status": "pending|in_review|approved|rejected",
      "documents": [
        {
          "documentId": "doc-uuid",
          "type": "id",
          "status": "uploaded",
          "name": "id-document.pdf",
          "uploadedAt": "2025-12-31T23:59:59Z"
        }
      ],
      "lastUpdated": "2025-12-31T23:59:59Z"
    }
  }
  ```

### Users

#### Get User Profile
- **URL**: `/api/users/profile`
- **Method**: `GET`
- **Description**: Get user profile information
- **Response**:
  ```json
  {
    "success": true,
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "client|vendor|courier|admin",
      "name": "John Doe",
      "phone": "+1234567890",
      "status": "active|pending_documents|verified|blocked|rejected"
    }
  }
  ```

#### Update User Profile
- **URL**: `/api/users/profile`
- **Method**: `PUT`
- **Description**: Update user profile information
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "phone": "+1234567890"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "client",
      "name": "John Doe",
      "phone": "+1234567890",
      "status": "active"
    }
  }
  ```

### Orders

#### Create Order
- **URL**: `/api/orders`
- **Method**: `POST`
- **Description**: Create a new gas cylinder order
- **Request Body**:
  ```json
  {
    "productId": "product-uuid",
    "quantity": 1,
    "deliveryAddress": {
      "street": "123 Main St",
      "city": "Luanda",
      "coordinates": {
        "lat": -8.8396,
        "lng": 13.2894
      }
    }
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "order": {
      "id": "order-uuid",
      "productId": "product-uuid",
      "quantity": 1,
      "status": "pending",
      "totalAmount": 100.00,
      "createdAt": "2025-12-31T23:59:59Z"
    }
  }
  ```

#### Get Orders
- **URL**: `/api/orders`
- **Method**: `GET`
- **Description**: Get orders for the authenticated user
- **Query Parameters**:
  - `status`: Filter by order status (pending, confirmed, in_transit, delivered, cancelled)
- **Response**:
  ```json
  {
    "success": true,
    "orders": [
      {
        "id": "order-uuid",
        "productId": "product-uuid",
        "quantity": 1,
        "status": "pending",
        "totalAmount": 100.00,
        "createdAt": "2025-12-31T23:59:59Z"
      }
    ]
  }
  ```

### Notifications

#### Get Notifications
- **URL**: `/api/notifications`
- **Method**: `GET`
- **Description**: Get notifications for the authenticated user
- **Response**:
  ```json
  {
    "success": true,
    "notifications": [
      {
        "id": "notification-uuid",
        "title": "Order Confirmed",
        "message": "Your order has been confirmed",
        "type": "order|system|alert",
        "read": false,
        "createdAt": "2025-12-31T23:59:59Z"
      }
    ]
  }
  ```

#### Mark Notification as Read
- **URL**: `/api/notifications/{id}/read`
- **Method**: `POST`
- **Description**: Mark a notification as read
- **Response**:
  ```json
  {
    "success": true
  }
  ```

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message"
}
```

Common HTTP status codes:
- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Missing or invalid authentication
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `500`: Internal Server Error - Unexpected server error

## Rate Limiting

The API implements rate limiting to prevent abuse. Current limits:
- 100 requests per minute per IP address
- 1000 requests per hour per authenticated user

Exceeding these limits will result in a `429 Too Many Requests` response.

## Versioning

The API is currently at version 1.0. Future versions will be indicated in the URL path:

```
https://your-domain.com/api/v1/...
```