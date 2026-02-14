# QR Restaurant Menu & Ordering API Documentation

## Overview

This API provides endpoints for managing a QR-based restaurant menu and ordering platform. The system supports restaurant management, table management, QR code generation, session handling, and subscription management.

**Base URL:** `http://localhost:8080/api`

**Response Format:** All responses follow a standardized format:

### Success Response Format
```json
{
  "success": true,
  "message": "Descriptive success message",
  "data": {}
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Clear error message",
  "error": {
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles
- **SUPER_ADMIN**: Full system access
- **RESTAURANT_ADMIN**: Restaurant owner with limited access

---

## 1. Authentication APIs

### POST /api/auth/signup

**Description:** Register a new user account

**Authentication Required:** No

**Request Body:**
```json
{
  "name": "string (required, 2-50 characters)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6 characters)",
  "role": "string (required, SUPER_ADMIN or RESTAURANT_ADMIN)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt_token_string",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "RESTAURANT_ADMIN",
      "provider": "LOCAL",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- **409 Conflict:** Email already exists
- **422 Validation Error:** Invalid input data
- **500 Internal Server Error:** Registration failed

---

### POST /api/auth/login

**Description:** Login with email and password

**Authentication Required:** No

**Request Body:**
```json
{
  "email": "string (required, valid email)",
  "password": "string (required)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_string",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "RESTAURANT_ADMIN",
      "provider": "LOCAL",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- **401 Unauthorized:** Invalid email or password
- **422 Validation Error:** Invalid input data
- **500 Internal Server Error:** Login failed

---

### POST /api/auth/google

**Description:** Login with Google OAuth token

**Authentication Required:** No

**Request Body:**
```json
{
  "token": "string (required, Google OAuth token)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Google authentication successful",
  "data": {
    "token": "jwt_token_string",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "RESTAURANT_ADMIN",
      "provider": "GOOGLE",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- **401 Unauthorized:** Google authentication failed
- **422 Validation Error:** Invalid token format
- **500 Internal Server Error:** Authentication failed

---

## 2. Restaurant Management APIs

### GET /api/restaurants/me

**Description:** Get current user's restaurant details

**Authentication Required:** Yes (Restaurant Owner)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Restaurant retrieved successfully",
  "data": {
    "id": 1,
    "name": "My Restaurant",
    "owner_id": 1,
    "address": "123 Main St",
    "status": "ACTIVE",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- **401 Unauthorized:** Invalid or missing token
- **403 Forbidden:** Restaurant Owner privileges required
- **404 Not Found:** Restaurant not found
- **500 Internal Server Error:** Failed to retrieve restaurant

---

### PATCH /api/restaurants/me

**Description:** Update current user's restaurant details

**Authentication Required:** Yes (Restaurant Owner + Active Subscription)

**Request Body:**
```json
{
  "name": "string (optional, 2-100 characters)",
  "address": "string (optional, max 500 characters)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Restaurant updated successfully",
  "data": {
    "id": 1,
    "name": "Updated Restaurant Name",
    "owner_id": 1,
    "address": "Updated Address",
    "status": "ACTIVE",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- **401 Unauthorized:** Invalid or missing token
- **403 Forbidden:** Restaurant Owner privileges or active subscription required
- **404 Not Found:** Restaurant not found
- **409 Conflict:** Restaurant name already taken
- **422 Validation Error:** Invalid input data
- **500 Internal Server Error:** Failed to update restaurant

---

### GET /api/restaurants

**Description:** Get all restaurants (Admin only)

**Authentication Required:** Yes (Super Admin)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Restaurants retrieved successfully",
  "data": {
    "restaurants": [
      {
        "id": 1,
        "name": "Restaurant 1",
        "owner_id": 1,
        "address": "123 Main St",
        "status": "ACTIVE",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "totalItems": 50,
      "totalPages": 5,
      "currentPage": 1,
      "itemsPerPage": 10
    }
  }
}
```

**Error Responses:**
- **401 Unauthorized:** Invalid or missing token
- **403 Forbidden:** Super Admin privileges required
- **422 Validation Error:** Invalid pagination parameters
- **500 Internal Server Error:** Failed to retrieve restaurants

---

### POST /api/restaurants

**Description:** Create a new restaurant (Admin only)

**Authentication Required:** Yes (Super Admin)

**Request Body:**
```json
{
  "name": "string (required, 2-100 characters)",
  "owner_id": "integer (required, valid user ID)",
  "address": "string (optional, max 500 characters)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Restaurant created successfully",
  "data": {
    "id": 1,
    "name": "New Restaurant",
    "owner_id": 1,
    "address": "123 Main St",
    "status": "ACTIVE",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- **400 Bad Request:** Invalid owner_id provided
- **401 Unauthorized:** Invalid or missing token
- **403 Forbidden:** Super Admin privileges required
- **409 Conflict:** Restaurant name already exists
- **422 Validation Error:** Invalid input data
- **500 Internal Server Error:** Failed to create restaurant

---

### PATCH /api/restaurants/:id/enable

**Description:** Enable a restaurant (Admin only)

**Authentication Required:** Yes (Super Admin)

**Path Parameters:**
- `id` (required): Restaurant ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Restaurant enabled successfully",
  "data": {
    "id": 1,
    "name": "Restaurant Name",
    "owner_id": 1,
    "address": "123 Main St",
    "status": "ACTIVE",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- **401 Unauthorized:** Invalid or missing token
- **403 Forbidden:** Super Admin privileges required
- **404 Not Found:** Restaurant not found
- **422 Validation Error:** Invalid restaurant ID
- **500 Internal Server Error:** Failed to enable restaurant

---

### PATCH /api/restaurants/:id/disable

**Description:** Disable a restaurant (Admin only)

**Authentication Required:** Yes (Super Admin)

**Path Parameters:**
- `id` (required): Restaurant ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Restaurant disabled successfully",
  "data": {
    "id": 1,
    "name": "Restaurant Name",
    "owner_id": 1,
    "address": "123 Main St",
    "status": "DISABLED",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- **401 Unauthorized:** Invalid or missing token
- **403 Forbidden:** Super Admin privileges required
- **404 Not Found:** Restaurant not found
- **422 Validation Error:** Invalid restaurant ID
- **500 Internal Server Error:** Failed to disable restaurant

---

## 3. Table Management APIs

### POST /api/tables

**Description:** Create a new table for the restaurant

**Authentication Required:** Yes (Restaurant Owner)

**Request Body:**
```json
{
  "table_number": "string (required, 1-20 characters)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Table created successfully",
  "data": {
    "id": 1,
    "restaurant_id": 1,
    "table_number": "T001",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- **401 Unauthorized:** Invalid or missing token
- **403 Forbidden:** Restaurant Owner privileges required or no restaurant found
- **409 Conflict:** Table number already exists for this restaurant
- **422 Validation Error:** Invalid input data
- **500 Internal Server Error:** Failed to create table

---

### GET /api/tables

**Description:** Get all tables for the restaurant

**Authentication Required:** Yes (Restaurant Owner)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Tables retrieved successfully",
  "data": [
    {
      "id": 1,
      "restaurant_id": 1,
      "table_number": "T001",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "restaurant_id": 1,
      "table_number": "T002",
      "created_at": "2024-01-01T01:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- **401 Unauthorized:** Invalid or missing token
- **403 Forbidden:** Restaurant Owner privileges required or no restaurant found
- **500 Internal Server Error:** Failed to retrieve tables

---

### PATCH /api/tables/:id

**Description:** Update a table

**Authentication Required:** Yes (Restaurant Owner)

**Path Parameters:**
- `id` (required): Table ID

**Request Body:**
```json
{
  "table_number": "string (optional, 1-20 characters)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Table updated successfully",
  "data": {
    "id": 1,
    "restaurant_id": 1,
    "table_number": "T001-Updated",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- **401 Unauthorized:** Invalid or missing token
- **403 Forbidden:** Restaurant Owner privileges required or no restaurant found
- **404 Not Found:** Table not found
- **409 Conflict:** Table number already exists for this restaurant
- **422 Validation Error:** Invalid input data
- **500 Internal Server Error:** Failed to update table

---

### DELETE /api/tables/:id

**Description:** Delete a table

**Authentication Required:** Yes (Restaurant Owner)

**Path Parameters:**
- `id` (required): Table ID

**Success Response (204):**
```json
{
  "success": true,
  "message": "Table deleted successfully"
}
```

**Error Responses:**
- **401 Unauthorized:** Invalid or missing token
- **403 Forbidden:** Restaurant Owner privileges required or no restaurant found
- **404 Not Found:** Table not found
- **422 Validation Error:** Invalid table ID
- **500 Internal Server Error:** Failed to delete table

---

## 4. QR Token Management APIs

### POST /api/tables/:id/qr

**Description:** Generate QR token for a table

**Authentication Required:** Yes (Restaurant Owner)

**Path Parameters:**
- `id` (required): Table ID

**Success Response (201):**
```json
{
  "success": true,
  "message": "QR token generated successfully",
  "data": {
    "id": 1,
    "table_id": 1,
    "table_number": "T001",
    "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
    "is_active": true,
    "expires_at": "2024-01-02T00:00:00.000Z",
    "regenerated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- **401 Unauthorized:** Invalid or missing token
- **403 Forbidden:** Restaurant Owner privileges required or no restaurant found
- **404 Not Found:** Table not found
- **422 Validation Error:** Invalid table ID
- **500 Internal Server Error:** Failed to generate QR token

---

### PATCH /api/qr/:id/rotate

**Description:** Rotate (regenerate) a QR token

**Authentication Required:** Yes (Restaurant Owner)

**Path Parameters:**
- `id` (required): QR Token ID

**Success Response (201):**
```json
{
  "success": true,
  "message": "QR token rotated successfully",
  "data": {
    "id": 2,
    "table_id": 1,
    "table_number": "T001",
    "token": "z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1",
    "is_active": true,
    "expires_at": "2024-01-02T12:00:00.000Z",
    "regenerated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- **401 Unauthorized:** Invalid or missing token
- **403 Forbidden:** Restaurant Owner privileges required or unauthorized access
- **404 Not Found:** QR token not found
- **422 Validation Error:** Invalid QR token ID
- **500 Internal Server Error:** Failed to rotate QR token

---

### GET /api/qr/:id

**Description:** Get QR token details

**Authentication Required:** Yes (Restaurant Owner)

**Path Parameters:**
- `id` (required): QR Token ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "QR token retrieved successfully",
  "data": {
    "id": 1,
    "table_id": 1,
    "table_number": "T001",
    "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
    "is_active": true,
    "expires_at": "2024-01-02T00:00:00.000Z",
    "regenerated_at": "2024-01-01T00:00:00.000Z",
    "RestaurantTable": {
      "id": 1,
      "restaurant_id": 1,
      "table_number": "T001",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- **401 Unauthorized:** Invalid or missing token
- **403 Forbidden:** Restaurant Owner privileges required or unauthorized access
- **404 Not Found:** QR token not found
- **422 Validation Error:** Invalid QR token ID
- **500 Internal Server Error:** Failed to retrieve QR token

---

## 5. Session Management APIs

### POST /api/sessions/start

**Description:** Start a new session using QR token

**Authentication Required:** No

**Request Body:**
```json
{
  "qr_token": "string (required, min 10 characters)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Session started successfully",
  "data": {
    "id": 1,
    "restaurant_id": 1,
    "qr_token_id": 1,
    "status": "ACTIVE",
    "last_activity_at": "2024-01-01T00:00:00.000Z",
    "expires_at": "2024-01-01T06:00:00.000Z",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- **403 Forbidden:** Restaurant is not active
- **404 Not Found:** QR token not found or expired
- **409 Conflict:** An active session already exists for this QR code
- **422 Validation Error:** Invalid QR token format
- **500 Internal Server Error:** Failed to start session

---

### POST /api/sessions/cancel

**Description:** Cancel an active session

**Authentication Required:** No

**Request Body:**
```json
{
  "session_id": "integer (required, valid session ID)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Session cancelled successfully",
  "data": {
    "id": 1,
    "restaurant_id": 1,
    "qr_token_id": 1,
    "status": "CLOSED",
    "last_activity_at": "2024-01-01T00:00:00.000Z",
    "expires_at": "2024-01-01T06:00:00.000Z",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- **404 Not Found:** Active session not found
- **422 Validation Error:** Invalid session ID
- **500 Internal Server Error:** Failed to cancel session

---

## 6. Subscription Management APIs

### POST /api/subscriptions

**Description:** Create a new subscription (Admin only)

**Authentication Required:** Yes (Super Admin)

**Request Body:**
```json
{
  "restaurant_id": "integer (required, valid restaurant ID)",
  "plan": "string (required, BASIC/PREMIUM/ENTERPRISE)",
  "starts_at": "string (required, ISO 8601 date)",
  "ends_at": "string (required, ISO 8601 date, must be after starts_at)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Subscription created successfully",
  "data": {
    "id": 1,
    "restaurant_id": 1,
    "plan": "PREMIUM",
    "status": "ACTIVE",
    "starts_at": "2024-01-01T00:00:00.000Z",
    "ends_at": "2024-12-31T23:59:59.000Z",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- **401 Unauthorized:** Invalid or missing token
- **403 Forbidden:** Super Admin privileges required
- **404 Not Found:** Restaurant not found
- **422 Validation Error:** Invalid input data or date validation failed
- **500 Internal Server Error:** Failed to create subscription

---

### PATCH /api/subscriptions/:id/cancel

**Description:** Cancel a subscription (Admin only)

**Authentication Required:** Yes (Super Admin)

**Path Parameters:**
- `id` (required): Subscription ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Subscription cancelled successfully",
  "data": {
    "id": 1,
    "restaurant_id": 1,
    "plan": "PREMIUM",
    "status": "CANCELED",
    "starts_at": "2024-01-01T00:00:00.000Z",
    "ends_at": "2024-12-31T23:59:59.000Z",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- **400 Bad Request:** Cannot cancel a non-active subscription
- **401 Unauthorized:** Invalid or missing token
- **403 Forbidden:** Super Admin privileges required
- **404 Not Found:** Subscription not found
- **422 Validation Error:** Invalid subscription ID
- **500 Internal Server Error:** Failed to cancel subscription

---

### GET /api/subscriptions/me

**Description:** Get current user's subscriptions

**Authentication Required:** Yes (Any authenticated user)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Subscriptions retrieved successfully",
  "data": [
    {
      "id": 1,
      "restaurant_id": 1,
      "plan": "PREMIUM",
      "status": "ACTIVE",
      "starts_at": "2024-01-01T00:00:00.000Z",
      "ends_at": "2024-12-31T23:59:59.000Z",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- **401 Unauthorized:** Invalid or missing token
- **403 Forbidden:** No restaurant found for this user
- **500 Internal Server Error:** Failed to retrieve subscriptions

---

## 7. Menu Management APIs

### POST /api/menus

**Description:** Create a new menu for the restaurant

**Authentication Required:** Yes (Restaurant Owner + Active Subscription)

**Request Body:**
```json
{
  "name": "string (required, min 2 characters)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Menu created successfully",
  "data": {
    "id": 1,
    "name": "Lunch Menu",
    "restaurant_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- **401 Unauthorized:** Invalid or missing token
- **403 Forbidden:** Restaurant Owner privileges or active subscription required
- **422 Validation Error:** Invalid input data (name too short)
- **500 Internal Server Error:** Failed to create menu

---

### GET /api/menus

**Description:** Get all menus for the restaurant with their items

**Authentication Required:** Yes (Restaurant Owner + Active Subscription)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Menus retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Lunch Menu",
      "restaurant_id": 1,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "items": [
        {
          "id": 1,
          "name": "Burger",
          "price": "12.99",
          "menu_id": 1,
          "is_available": true,
          "created_at": "2024-01-01T00:00:00.000Z",
          "updated_at": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  ]
}
```

**Error Responses:**
- **401 Unauthorized:** Invalid or missing token
- **403 Forbidden:** Restaurant Owner privileges or active subscription required
- **500 Internal Server Error:** Failed to retrieve menus

---

### POST /api/menu-items

**Description:** Create a new menu item

**Authentication Required:** Yes (Restaurant Owner + Active Subscription)

**Request Body:**
```json
{
  "name": "string (required)",
  "price": "number (required, must be greater than 0)",
  "menu_id": "integer (required, valid menu ID)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Menu item created successfully",
  "data": {
    "id": 1,
    "name": "Burger",
    "price": "12.99",
    "menu_id": 1,
    "is_available": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- **401 Unauthorized:** Invalid or missing token
- **403 Forbidden:** Restaurant Owner privileges or active subscription required
- **404 Not Found:** Menu not found
- **422 Validation Error:** Invalid input data (missing fields, invalid price)
- **500 Internal Server Error:** Failed to create menu item

---

### PATCH /api/menu-items/:id

**Description:** Update a menu item

**Authentication Required:** Yes (Restaurant Owner + Active Subscription)

**Path Parameters:**
- `id` (required): Menu Item ID

**Request Body:**
```json
{
  "name": "string (optional)",
  "price": "number (optional, must be greater than 0)",
  "is_available": "boolean (optional)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Menu item updated successfully",
  "data": {
    "id": 1,
    "name": "Cheeseburger",
    "price": "13.99",
    "menu_id": 1,
    "is_available": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- **401 Unauthorized:** Invalid or missing token
- **403 Forbidden:** Restaurant Owner privileges, active subscription required, or unauthorized access to menu item
- **404 Not Found:** Menu item not found
- **422 Validation Error:** Invalid input data (invalid price)
- **500 Internal Server Error:** Failed to update menu item

---

## 8. Cart Management APIs

### POST /api/cart/items

**Description:** Add an item to the cart or update quantity if item already exists

**Authentication Required:** Yes (Active Session + Active Subscription)

**Request Body:**
```json
{
  "menu_item_id": "integer (required, valid menu item ID)",
  "quantity": "integer (required, must be greater than 0)"
}
```

**Success Response (201 for new item, 200 for quantity update):**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "id": 1,
    "cart_id": 1,
    "menu_item_id": 5,
    "quantity": 2,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- **403 Forbidden:** Active session or active subscription required
- **404 Not Found:** Menu item not found
- **409 Conflict:** Menu item is not available for ordering
- **422 Validation Error:** Invalid input data (missing fields, invalid quantity)
- **500 Internal Server Error:** Failed to add item to cart

---

### PATCH /api/cart/items/:id

**Description:** Update the quantity of a cart item

**Authentication Required:** Yes (Active Session)

**Path Parameters:**
- `id` (required): Cart Item ID

**Request Body:**
```json
{
  "quantity": "integer (required, must be greater than 0)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Cart item updated successfully",
  "data": {
    "id": 1,
    "cart_id": 1,
    "menu_item_id": 5,
    "quantity": 3,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

**Error Responses:**
- **403 Forbidden:** Active session required
- **404 Not Found:** Cart item not found
- **422 Validation Error:** Invalid quantity
- **500 Internal Server Error:** Failed to update cart item

---

### DELETE /api/cart/items/:id

**Description:** Remove an item from the cart

**Authentication Required:** Yes (Active Session)

**Path Parameters:**
- `id` (required): Cart Item ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Cart item removed successfully"
}
```

**Error Responses:**
- **403 Forbidden:** Active session required
- **404 Not Found:** Cart item not found
- **500 Internal Server Error:** Failed to remove cart item

---

### GET /api/cart

**Description:** Get the current cart with all items and menu item details

**Authentication Required:** Yes (Active Session)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Cart retrieved successfully",
  "data": {
    "id": 1,
    "session_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "items": [
      {
        "id": 1,
        "cart_id": 1,
        "menu_item_id": 5,
        "quantity": 2,
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z",
        "menuItem": {
          "id": 5,
          "name": "Burger",
          "price": "12.99",
          "menu_id": 1,
          "is_available": true,
          "created_at": "2024-01-01T00:00:00.000Z",
          "updated_at": "2024-01-01T00:00:00.000Z"
        }
      }
    ]
  }
}
```

**Error Responses:**
- **403 Forbidden:** Active session required
- **500 Internal Server Error:** Failed to retrieve cart

---

## 9. Order Management APIs

### POST /api/orders

**Description:** Create an order from the current cart items

**Authentication Required:** Yes (Active Session + Active Subscription)

**Request Body:** None (uses items from current cart)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "id": 1,
    "session_id": 1,
    "status": "PLACED",
    "total_amount": "25.98",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- **403 Forbidden:** Active session, active subscription required, or cart is empty
- **500 Internal Server Error:** Failed to create order

**Notes:**
- Order snapshots the price at the time of order creation
- Cart is cleared after successful order creation
- Orders are immutable once created

---

### GET /api/orders/session

**Description:** Get all orders for the current session

**Authentication Required:** Yes (Active Session)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "id": 1,
      "session_id": 1,
      "status": "PLACED",
      "total_amount": "25.98",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "items": [
        {
          "id": 1,
          "order_id": 1,
          "menu_item_id": 5,
          "quantity": 2,
          "price_snapshot": "12.99",
          "created_at": "2024-01-01T00:00:00.000Z",
          "updated_at": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  ]
}
```

**Error Responses:**
- **403 Forbidden:** Active session required
- **500 Internal Server Error:** Failed to retrieve orders

---

### GET /api/orders

**Description:** Get all orders for the restaurant (Restaurant Owner only)

**Authentication Required:** Yes (Restaurant Owner + Active Subscription)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "id": 1,
      "session_id": 1,
      "status": "PLACED",
      "total_amount": "25.98",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "items": [
        {
          "id": 1,
          "order_id": 1,
          "menu_item_id": 5,
          "quantity": 2,
          "price_snapshot": "12.99",
          "created_at": "2024-01-01T00:00:00.000Z",
          "updated_at": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  ]
}
```

**Error Responses:**
- **401 Unauthorized:** Invalid or missing token
- **403 Forbidden:** Restaurant Owner privileges or active subscription required
- **500 Internal Server Error:** Failed to retrieve orders

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200  | OK - Request successful |
| 201  | Created - Resource created successfully |
| 204  | No Content - Resource deleted successfully |
| 400  | Bad Request - Invalid request data |
| 401  | Unauthorized - Authentication required |
| 403  | Forbidden - Insufficient permissions |
| 404  | Not Found - Resource not found |
| 409  | Conflict - Resource already exists |
| 422  | Unprocessable Entity - Validation failed |
| 500  | Internal Server Error - Server error |

---

## Error Codes

| Code | Description |
|------|-------------|
| VALIDATION_ERROR | Input validation failed |
| SIGNUP_ERROR | User registration failed |
| LOGIN_ERROR | User login failed |
| TOKEN_VERIFICATION_ERROR | JWT token verification failed |
| CREATE_RESTAURANT_ERROR | Restaurant creation failed |
| UPDATE_RESTAURANT_ERROR | Restaurant update failed |
| CREATE_TABLE_ERROR | Table creation failed |
| UPDATE_TABLE_ERROR | Table update failed |
| DELETE_TABLE_ERROR | Table deletion failed |
| GENERATE_QR_ERROR | QR token generation failed |
| ROTATE_QR_ERROR | QR token rotation failed |
| GET_QR_ERROR | QR token retrieval failed |
| START_SESSION_ERROR | Session start failed |
| CANCEL_SESSION_ERROR | Session cancellation failed |
| CREATE_SUBSCRIPTION_ERROR | Subscription creation failed |
| CANCEL_SUBSCRIPTION_ERROR | Subscription cancellation failed |
| GET_SUBSCRIPTIONS_ERROR | Subscription retrieval failed |
| SUBSCRIPTION_CHECK_ERROR | Subscription verification failed |
| CREATE_MENU_ERROR | Menu creation failed |
| GET_MENUS_ERROR | Menu retrieval failed |
| CREATE_MENU_ITEM_ERROR | Menu item creation failed |
| UPDATE_MENU_ITEM_ERROR | Menu item update failed |
| ADD_TO_CART_ERROR | Add to cart failed |
| UPDATE_CART_ITEM_ERROR | Cart item update failed |
| REMOVE_CART_ITEM_ERROR | Cart item removal failed |
| GET_CART_ERROR | Cart retrieval failed |
| CREATE_ORDER_ERROR | Order creation failed |
| GET_SESSION_ORDERS_ERROR | Session orders retrieval failed |
| GET_RESTAURANT_ORDERS_ERROR | Restaurant orders retrieval failed |
| UNAUTHORIZED | Authentication failed |
| FORBIDDEN | Access denied |
| NOT_FOUND | Resource not found |
| CONFLICT | Resource conflict |
| INTERNAL_ERROR | Internal server error |

---

## Rate Limiting

Currently, no rate limiting is implemented. It's recommended to add rate limiting middleware for production use.

## CORS

CORS is enabled for all origins. Configure appropriately for production.

## Security Considerations

1. **JWT Tokens**: Tokens expire and need to be refreshed
2. **Password Security**: Passwords are hashed using bcrypt with salt rounds of 12
3. **Input Validation**: All inputs are validated using express-validator
4. **SQL Injection**: Using Sequelize ORM prevents SQL injection
5. **Authorization**: Role-based access control implemented

## Changelog

### Version 1.0.0
- Initial API implementation
- Standardized response format
- Added comprehensive input validation
- Implemented proper HTTP status codes
- Added detailed error handling
- Fixed model inconsistencies
- Added security improvements