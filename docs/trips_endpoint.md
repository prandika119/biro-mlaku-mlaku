# Trip Endpoint Documentation

## Create Trip (Admin Only)

- **Endpoint:** `POST /api/trips`
- **Description:** Create a new trip.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Request Body:**
  - `name` (string, required)
  - `description` (string, optional)
  - `location` (string, required)
  - `start_date` (date, required)
  - `end_date` (date, required)
- **Response:**
  - `201 Created` with trip data on success
  - `400 Bad Request` on validation errors
  - `401 Unauthorized` if token is missing or invalid
  - `403 Forbidden` if user is not an admin

## Get All Trips (Admin & Participant)

- **Endpoint:** `GET /api/trips`
- **Description:** Retrieve a list of all trips.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Response:**
  - `200 OK` with list of trips
  - `401 Unauthorized` if token is missing or invalid

## Get Trip History (Admin & Participant)

- **Endpoint:** `GET /api/trips/history`
- **Description:** Retrieve a list of trips where the user is a participant.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Response:**
  - `200 OK` with list of trips
  - `401 Unauthorized` if token is missing or invalid

## Get Trip by ID (Admin & Participant)

- **Endpoint:** `GET /api/trips/{id}`
- **Description:** Retrieve details of a specific trip by ID.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Response:**
  - `200 OK` with trip data
  - `401 Unauthorized` if token is missing or invalid
  - `404 Not Found` if trip does not exist

## Update Trip (Admin Only)

- **Endpoint:** `PUT /api/trips/{id}`
- **Description:** Update details of a specific trip by ID.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Request Body:**
  - `name` (string, optional)
  - `description` (string, optional)
  - `location` (string, optional)
    - `start_date` (date, optional)
    - `end_date` (date, optional)
- **Response:**
  - `200 OK` on success
  - `400 Bad Request` on validation errors
  - `401 Unauthorized` if token is missing or invalid
  - `403 Forbidden` if user is not an admin
  - `404 Not Found` if trip does not exist

## Delete Trip (Admin Only)

- **Endpoint:** `DELETE /api/trips/{id}`
- **Description:** Delete a specific trip by ID.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Response:**
  - `200 OK` on success
  - `401 Unauthorized` if token is missing or invalid
  - `403 Forbidden` if user is not an admin
  - `404 Not Found` if trip does not exist
