# TaskScheduler API Documentation

## Overview

This README provides detailed information on the API endpoints and middleware used in the TaskScheduler application. Each section includes descriptions of endpoints, request methods, required parameters, and responses.

## Table of Contents

1. [Authentication Routes](#authentication-routes)
2. [Task Routes](#task-routes)
3. [Analytics Routes](#analytics-routes)
4. [Middleware](#middleware)

---

## Authentication Routes

### Register User

**Endpoint:** `POST /register`

**Description:** Registers a new user.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Responses:**
- **201 Created:** User registered successfully.
  ```json
  {
    "token": "string"
  }
  ```
- **400 Bad Request:** Invalid input or user already exists.
- **500 Internal Server Error:** Server error during registration.

---

### Login User

**Endpoint:** `POST /login`

**Description:** Logs in a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Responses:**
- **200 OK:** Login successful.
  ```json
  {
    "msg": "Login successful"
  }
  ```
- **400 Bad Request:** Invalid credentials.
- **500 Internal Server Error:** Server error during login.

---

### Logout User

**Endpoint:** `POST /logout`

**Description:** Logs out a user and clears the JWT token.

**Headers:**
- **Authorization:** `Bearer <token>`

**Responses:**
- **200 OK:** Logout successful.
  ```json
  {
    "msg": "Logout successful"
  }
  ```
- **401 Unauthorized:** Token not provided or invalid.

---

### Get User Profile

**Endpoint:** `GET /profile`

**Description:** Retrieves the user profile and associated tasks.

**Headers:**
- **Authorization:** `Bearer <token>`

**Query Parameters:**
- `status` (optional): Filter tasks by status.
- `priority` (optional): Filter tasks by priority.
- `sortBy` (optional, default `dueDate`): Sort tasks by a field.
- `order` (optional, default `asc`): Sort order (`asc` or `desc`).
- `limit` (optional, default `5`): Number of tasks per page.
- `page` (optional, default `1`): Page number.

**Responses:**
- **200 OK:** User profile and tasks retrieved.
  ```json
  {
    "user": {
      "username": "string",
      "email": "string"
    },
    "tasks": [
      {
        "title": "string",
        "description": "string",
        "dueDate": "string",
        "priority": "string",
        "status": "string"
      }
    ],
    "pagination": {
      "currentPage": "number",
      "totalTasks": "number",
      "totalPages": "number"
    }
  }
  ```
- **401 Unauthorized:** Token not provided or invalid.
- **404 Not Found:** User not found.
- **500 Internal Server Error:** Server error during profile retrieval.

---

## Task Routes

### Create Task

**Endpoint:** `POST /tasks`

**Description:** Creates a new task.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "dueDate": "string",
  "priority": "string",
  "assignedTo": "string"
}
```

**Headers:**
- **Authorization:** `Bearer <token>`

**Responses:**
- **201 Created:** Task created successfully.
  ```json
  {
    "task": {
      "title": "string",
      "description": "string",
      "dueDate": "string",
      "priority": "string",
      "assignedTo": "string"
    }
  }
  ```
- **401 Unauthorized:** Token not provided or invalid.
- **500 Internal Server Error:** Server error during task creation.

---

### Get Tasks

**Endpoint:** `GET /tasks`

**Description:** Retrieves tasks for the authenticated user.

**Query Parameters:**
- `status` (optional): Filter tasks by status.
- `priority` (optional): Filter tasks by priority.
- `sortBy` (optional, default `dueDate`): Sort tasks by a field.
- `order` (optional, default `asc`): Sort order (`asc` or `desc`).
- `limit` (optional, default `5`): Number of tasks per page.
- `page` (optional, default `1`): Page number.

**Headers:**
- **Authorization:** `Bearer <token>`

**Responses:**
- **200 OK:** Tasks retrieved successfully.
  ```json
  {
    "tasks": [
      {
        "title": "string",
        "description": "string",
        "dueDate": "string",
        "priority": "string",
        "status": "string"
      }
    ],
    "pagination": {
      "currentPage": "number",
      "totalTasks": "number",
      "totalPages": "number"
    }
  }
  ```
- **401 Unauthorized:** Token not provided or invalid.
- **500 Internal Server Error:** Server error during task retrieval.

---

### Update Task

**Endpoint:** `PUT /tasks/:taskId`

**Description:** Updates a task.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "status": "string"
}
```

**Headers:**
- **Authorization:** `Bearer <token>`

**Responses:**
- **200 OK:** Task updated successfully.
  ```json
  {
    "task": {
      "title": "string",
      "description": "string",
      "dueDate": "string",
      "priority": "string",
      "status": "string"
    }
  }
  ```
- **401 Unauthorized:** Token not provided or invalid.
- **404 Not Found:** Task not found.
- **500 Internal Server Error:** Server error during task update.

---

### Delete Task

**Endpoint:** `DELETE /tasks/:taskId`

**Description:** Deletes a task.

**Headers:**
- **Authorization:** `Bearer <token>`

**Responses:**
- **200 OK:** Task deleted successfully.
  ```json
  {
    "msg": "Task deleted"
  }
  ```
- **401 Unauthorized:** Token not provided or invalid.
- **404 Not Found:** Task not found.
- **500 Internal Server Error:** Server error during task deletion.

---

## Analytics Routes

### Get Analytics

**Endpoint:** `GET /analytics`

**Description:** Retrieves analytics data.

**Headers:**
- **Authorization:** `Bearer <token>`

**Responses:**
- **200 OK:** Analytics data retrieved.
  ```json
  {
    "data": "string"
  }
  ```
- **401 Unauthorized:** Token not provided or invalid.
- **403 Forbidden:** Insufficient permissions.
- **500 Internal Server Error:** Server error during analytics retrieval.

---

## Middleware

### Authentication Middleware (`authMiddleware`)

**Description:** Verifies JWT tokens and attaches the decoded user information to the request.

**Usage:**
- Protects routes that require authentication by checking for a valid JWT token in the cookies.

### Role-Based Access Control Middleware (`rbacMiddleware`)

**Description:** Checks if the authenticated user has the required roles to access a route.

**Parameters:**
- `allowedRoles` (Array): Array of roles allowed to access the route.

**Usage:**
- Protects routes based on user roles by checking the user's role against the allowed roles.

---

For further details, feel free to reach out or refer to the codebase.

---