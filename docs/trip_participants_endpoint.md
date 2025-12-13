# Trip Participants Endpoint Documentation

## Add Participant to Trip (Admin Only)

- **Endpoint:** `POST /api/trips/{trip_id}/participants`
- **Description:** Add a participant to a specific trip.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Request Body:**
  - `user_id` (integer, required)
  - `status` (string: joining, pending, cancelled, completed; required)
- **Response:**
  - `201 Created` with participant data on success
  - `400 Bad Request` on validation errors
  - `401 Unauthorized` if token is missing or invalid
  - `403 Forbidden` if user is not an admin
  - `404 Not Found` if trip or user does not exist

## Get Participants of a Trip (Admin only)

- **Endpoint:** `GET /api/trips/{trip_id}/participants`
- **Description:** Retrieve a list of participants for a specific trip.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Response:**
  - `200 OK` with list of participants
  - `401 Unauthorized` if token is missing or invalid
  - `404 Not Found` if trip does not exist

## Update Participant Status (Admin Only)

- **Endpoint:** `PUT /api/trips/{trip_id}/participants/{participant_id}`
- **Description:** Update the status of a participant in a specific trip.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Request Body:**
  - `status` (string: joining, pending, cancelled, completed; required)
- **Response:**
  - `200 OK` on success
  - `400 Bad Request` on validation errors
  - `401 Unauthorized` if token is missing or invalid
  - `403 Forbidden` if user is not an admin
  - `404 Not Found` if trip or participant does not exist

## Remove Participant from Trip (Admin Only)

- **Endpoint:** `DELETE /api/trips/{trip_id}/participants/{participant_id}`
- **Description:** Remove a participant from a specific trip.
- **Headers:**
  - `Authorization: Bearer <token>`
- **Response:**
  - `200 OK` on success
  - `401 Unauthorized` if token is missing or invalid
  - `403 Forbidden` if user is not an admin
  - `404 Not Found` if trip or participant does not exist
