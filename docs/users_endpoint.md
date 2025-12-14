# User API Endpoints

## Register User (Admin Only)

- **Endpoint:** `POST /api/users`
- **Description:** Create a new user
- **Headers:**
  - `Authorization: Bearer <token>` (Admin only)
- **Request Body:**
  - `name` (string, required)
  - `username` (string, required)
  - `email` (string, required)
  - `phone` (string, required)
  - `password` (string, required)
- **Response:**
  - `201 Created` on success
  - `400 Bad Request` on validation errors
  - `401 Unauthorized` if not logged in
  - `403 Forbidden` if not admin

## Login User

- **Endpoint:** `POST /api/users/login`
- **Description:** Authenticate a user and return a token
- **Request Body:**
  - `email` (string, required)
  - `password` (string, required)
- **Response:**
  - `200 OK` on success
  - `401 Unauthorized` on invalid credentials

## Get User Profile

- **Endpoint:** `GET /api/users/profile`
- **Description:** Get the authenticated user's profile
- **Headers:**
  - `Authorization: Bearer <token>`
- **Response:**
  - `200 OK` with user data
  - `401 Unauthorized` if not logged in

## Get All Users (Admin Only)

- **Endpoint:** `GET /api/users`
- **Description:** Get list of all users
- **Headers:**
  - `Authorization: Bearer <token>` (Admin only)
- **Response:**
  - `200 OK` with list of users
  - `401 Unauthorized` if not logged in
  - `403 Forbidden` if not admin

## Update User Profile

- **Endpoint:** `PATCH /api/users`
- **Description:** Update the authenticated user's profile
- **Headers:**
  - `Authorization: Bearer <token>`
- **Request Body:**
  - `name` (string, optional)
  - `username` (string, optional)
  - `email` (string, optional)
  - `phone` (string, optional)
- **Response:**
  - `200 OK` on success
  - `400 Bad Request` on validation errors
  - `401 Unauthorized` if not logged in

## Update User by ID (Admin Only)

- **Endpoint:** `PATCH /api/users/:id`
- **Description:** Update a user by ID
- **Headers:**
  - `Authorization: Bearer <token>` (Admin only)
- **Request Body:**
  - `name` (string, optional)
  - `username` (string, optional)
  - `email` (string, optional)
  - `phone` (string, optional)
- **Response:**
  - `200 OK` on success
  - `400 Bad Request` on validation errors
  - `401 Unauthorized` if not logged in
  - `403 Forbidden` if not admin
  - `404 Not Found` if user does not exist

## Delete User (Admin Only)

- **Endpoint:** `DELETE /api/users/:id`
- **Description:** Delete a user by ID
- **Headers:**
  - `Authorization: Bearer <token>` (Admin only)
- **Response:**
  - `200 OK` on success
  - `401 Unauthorized` if not logged in
  - `403 Forbidden` if not admin
  - `404 Not Found` if user does not exist
