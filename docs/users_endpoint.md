# User API Endpoints

## Add Participant (Admin Only)

- **Endpoint:** `POST /api/users`
- **Description:** Create a new user.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Request Body:**
  - `name` (string, required)
  - `username` (string, required)
  - `email` (string, required)
  - `phone` (string, required)
  - `role` (string: admin, participant; required)
  - `password` (string, required)
- **Response:**
  - `201 Created` with user data on success
  - `400 Bad Request` on validation errors
  - `401 Unauthorized` if token is missing or invalid
  - `403 Forbidden` if user is not an admin

## Login User (Admin & Participant)

- **Endpoint:** `POST /api/users/login`
- **Description:** Authenticate a user and return a JWT token.
- **Request Body:**
  - `email` (string, required)
  - `password` (string, required)

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

- **Response:**
  - `200 OK` with JWT token on success
  - `401 Unauthorized` on authentication failure

```json
// success response example
{
  "status": "true",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "username": "johndoe",
      "email": "john.doe@example.com"
    },
    "token": "<jwt_token>"
  },
  "message": "Login successful",
  "error": null
}

// invalid credentials response example
{
  "status": "false",
  "data": null,
  "message": "Invalid email or password",
  "error": []
}
```

## Get All Users (Admin Only)

- **Endpoint:** `GET /api/users`
- **Description:** Retrieve a list of all users.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Response:**
  - `200 OK` with list of users
  - `401 Unauthorized` if token is missing or invalid
  - `403 Forbidden` if user is not an admin

## Get User Profile (Admin & Participant)

- **Endpoint:** `GET /api/users/profile`
- **Description:** Retrieve the profile of the authenticated user.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Response:**
  - `200 OK` with user profile data
  - `401 Unauthorized` if token is missing or invalid

## Update User Profile (Admin & Participant)

- **Endpoint:** `PUT /api/users/profile`
- **Description:** Update the profile of the authenticated user.
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
  - `401 Unauthorized` if token is missing or invalid

## Delete User (Admin Only)

- **Endpoint:** `DELETE /api/users/{id}`
- **Description:** Delete a user by ID.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Response:**
  - `200 OK` on success
  - `404 Not Found` if user does not exist
