# Postman Collection - Biro Mlaku-Mlaku API

Postman collection untuk testing semua endpoint API Biro Mlaku-Mlaku.

## 📁 Files

- `Biro-Mlaku-Mlaku.postman_collection.json` - Postman collection dengan semua endpoint
- `Biro-Mlaku-Mlaku.postman_environment.json` - Environment variables untuk collection

## 🚀 Cara Import ke Postman

### 1. Import Collection

1. Buka Postman
2. Klik **Import** button (di kiri atas)
3. Pilih file `Biro-Mlaku-Mlaku.postman_collection.json`
4. Klik **Import**

### 2. Import Environment

1. Klik **Environments** di sidebar kiri
2. Klik **Import**
3. Pilih file `Biro-Mlaku-Mlaku.postman_environment.json`
4. Klik **Import**
5. Pilih environment "Biro Mlaku-Mlaku Environment" dari dropdown di kanan atas

## 📋 Endpoint List

### Users

- **POST** `/api/users` - Register User
- **POST** `/api/users/login` - Login User (auto-save token)
- **GET** `/api/users/current` - Get Current User
- **PATCH** `/api/users/current` - Update User
- **DELETE** `/api/users/current` - Logout User

### Trips

- **GET** `/api/trips` - Get All Trips (requires auth)
- **GET** `/api/trips/:id` - Get Trip by ID (requires auth)
- **POST** `/api/trips` - Create Trip (requires admin)
- **PATCH** `/api/trips/:id` - Update Trip (requires admin)
- **DELETE** `/api/trips/:id` - Delete Trip (requires admin)

### Trip Participants

- **POST** `/api/trips/:tripId/participants` - Add Participant (requires admin)
- **GET** `/api/trips/:tripId/participants` - Get Participants (requires admin)
- **PATCH** `/api/trips/:tripId/participants/:userId` - Update Participant Status (requires admin)
- **DELETE** `/api/trips/:tripId/participants/:userId` - Remove Participant (requires admin)

## 🔑 Authentication Flow

### 1. Register & Login sebagai User Biasa

```
1. Jalankan "Register User" untuk membuat user baru
2. Jalankan "Login User" - token akan otomatis disimpan ke {{authToken}}
3. Sekarang bisa test endpoint yang membutuhkan authentication
```

### 2. Login sebagai Admin

Untuk test endpoint admin, perlu login dengan user yang role-nya ADMIN:

```
1. Pastikan di database ada user dengan role ADMIN
   UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';

2. Edit request "Login User":
   - Ubah email & password ke credentials admin
   - Jalankan request

3. Copy token dari response

4. Paste token ke environment variable {{adminToken}}:
   - Klik Environments
   - Edit "Biro Mlaku-Mlaku Environment"
   - Set value untuk adminToken
   - Save
```

## 🎯 Testing Workflow

### Scenario 1: User Flow

1. ✅ Register User
2. ✅ Login User (token auto-saved)
3. ✅ Get Current User
4. ✅ Update User
5. ✅ Get All Trips
6. ✅ Get Trip by ID
7. ✅ Logout User

### Scenario 2: Admin Flow (Trip Management)

1. ✅ Login as Admin (set adminToken manually)
2. ✅ Create Trip
3. ✅ Get All Trips
4. ✅ Get Trip by ID
5. ✅ Update Trip
6. ✅ Delete Trip

### Scenario 3: Admin Flow (Participant Management)

1. ✅ Login as Admin
2. ✅ Create Trip
3. ✅ Add Participant to Trip
4. ✅ Get Trip Participants
5. ✅ Update Participant Status
6. ✅ Remove Participant from Trip

## 🔧 Environment Variables

| Variable     | Description                 | Example                  |
| ------------ | --------------------------- | ------------------------ |
| `baseUrl`    | Base URL API server         | `http://localhost:3000`  |
| `authToken`  | Token dari login user biasa | Auto-saved setelah login |
| `adminToken` | Token dari login admin      | Manual set               |

## 📝 Notes

### Auto-Save Token

Request "Login User" sudah dilengkapi dengan **Test Script** yang otomatis menyimpan token ke environment variable `{{authToken}}`. Jadi setelah login, tidak perlu copy-paste token manual.

### Admin Token

Untuk `{{adminToken}}`, harus di-set manual karena perlu login dengan user yang berbeda (admin).

### Status Participant

Nilai valid untuk status participant:

- `PENDING` - Default saat ditambahkan
- `JOINING` - User confirm ikut trip
- `CANCELLED` - User cancel
- `COMPLETED` - Trip sudah selesai

### Date Format

Untuk field date (start_date, end_date), gunakan format ISO 8601:

```
2025-01-15T00:00:00.000Z
```

## 🐛 Troubleshooting

### Error 401 Unauthorized

- Pastikan sudah login dan token tersimpan di environment variable
- Check apakah token masih valid (belum logout)

### Error 403 Forbidden

- Endpoint membutuhkan role ADMIN
- Pastikan menggunakan `{{adminToken}}` bukan `{{authToken}}`
- Pastikan user yang login memiliki role ADMIN di database

### Error 404 Not Found

- Check apakah ID yang digunakan sudah benar
- Pastikan resource (trip/user) sudah ada di database

## 🚀 Quick Start

1. Start server: `npm run start:dev`
2. Import collection & environment ke Postman
3. Register user baru
4. Login untuk dapat token
5. Test semua endpoint!

Happy Testing! 🎉
