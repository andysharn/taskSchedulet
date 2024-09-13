# taskScheduler
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
- `allowedRoles` ['User','Admin','Manager']: Array of roles allowed to access the route.

**Usage:**
- Protects routes based on user roles by checking the user's role against the allowed roles.

---

For further details, feel free to reach out or refer to the codebase.

---

---

## Security Measures

Our application implements several security best practices to ensure data integrity and protect against various attacks. Below is a list of security measures integrated into the system:

### 1. **Helmet**
Helmet is a middleware for Express.js applications that helps secure HTTP headers. It provides protection against a variety of attacks, including but not limited to:

- **Cross-Site Scripting (XSS)**
- **Clickjacking**
- **Content Security Policy (CSP) Violations**
  
**How it works:**
Helmet automatically sets secure HTTP headers like `X-Frame-Options`, `X-XSS-Protection`, `X-Content-Type-Options`, and others, which help prevent malicious scripts and protect the integrity of the application's communication with browsers.

```js
const helmet = require('helmet');
app.use(helmet());
```

### 2. **Argon2id Hashing for Passwords**
We use **Argon2id**, a highly secure and recommended password-hashing algorithm, to hash user passwords before storing them in the database. This helps prevent password theft even if the database is compromised.

**How it works:**
Argon2id is a memory-hard algorithm designed to resist both brute-force attacks and GPU-based cracking. The hashed password includes a salt and is computationally expensive to calculate, making it highly secure.

```js
const argon2 = require('argon2');
const hashPassword = async (password) => {
    const hashedPassword = await argon2.hash(password, {
        type: argon2.argon2id
    });
    return hashedPassword;
};
```

- **Prevents:** Brute-force attacks, dictionary attacks, and rainbow table attacks.

### 3. **Input Validation with Joi**
We use **Joi** for input validation to ensure that all incoming data is sanitized and meets the expected format before processing. This helps mitigate common injection attacks.

**How it works:**
Joi allows us to define schemas that describe the shape and constraints of the input data. It automatically validates incoming requests and rejects those that don't match the criteria.

```js
const Joi = require('joi');

const userSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().email().required()
});

const validateUser = (data) => userSchema.validate(data);
```

- **Prevents:** SQL Injection, NoSQL Injection, and Cross-Site Scripting (XSS) by ensuring that invalid or malicious data is never processed by the application.

### 4. **JSON Web Token (JWT) Authentication**
For securing user authentication, we implement JWT-based authentication. JWT tokens are securely signed and used for verifying user sessions without sharing sensitive user data in each request.

**How it works:**
JWT tokens are signed using a secret key and can only be decoded by the server, ensuring that user data is protected during communication.

```js
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
};
```

- **Prevents:** Token hijacking and protects against replay attacks when implemented with proper expiration times.

### 5. **Rate Limiting**
To prevent brute-force attacks and protect the application from Denial of Service (DoS) attacks, we implement rate limiting on API requests.

**How it works:**
Rate limiting restricts the number of requests an IP address can make to the server within a certain timeframe.

```js
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limit each IP to 100 requests per windowMs
});
app.use('/api/', apiLimiter);
```

- **Prevents:** Brute-force attacks and protects the system from being overwhelmed by traffic.



These security measures combined create a robust protection layer around the application, ensuring both user and data security. They safeguard the system from common attacks like XSS, SQL Injection, brute-force, and more, making the application more secure and reliable.

--- 
