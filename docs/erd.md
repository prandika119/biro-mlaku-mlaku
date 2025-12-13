# Entity Relational Diagram (ERD)

## User

- id (PK)
- name (varchar)
- username (varchar)
- email (varchar)
- phone (varchar)
- role (varchar)
- password (varchar)
- created_at (timestamp)
- updated_at (timestamp)

## Trip

- id (PK)
- name (varchar)
- description (text)
- location (varchar)
- start_date (date)
- end_date (date)
- created_at (timestamp)
- updated_at (timestamp)

## Trip_Participant

- id (PK)
- trip_id (FK to Trip.id)
- user_id (FK to User.id)
- status (varchar: joining, pending, cancelled, completed)
- created_at (timestamp)
